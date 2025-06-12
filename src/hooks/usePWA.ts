import { useState, useEffect } from 'react';

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  isIOS: boolean;
}

export const usePWA = () => {
  const [pwaStatus, setPWAStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent)
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Проверка статуса установки
    const checkInstallStatus = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
      
      setPWAStatus(prev => ({ ...prev, isInstalled }));
    };

    // Обработчик события установки
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPWAStatus(prev => ({ ...prev, isInstallable: true }));
    };

    // Обработчик статуса сети
    const handleOnline = () => setPWAStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPWAStatus(prev => ({ ...prev, isOnline: false }));

    // Обработчик обновления SW
    const handleSWUpdate = () => {
      setPWAStatus(prev => ({ ...prev, isUpdateAvailable: true }));
    };

    checkInstallStatus();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('swUpdate', handleSWUpdate);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('swUpdate', handleSWUpdate);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setPWAStatus(prev => ({ ...prev, isInstallable: false, isInstalled: true }));
      }
    }
  };

  const updatePWA = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.update();
      });
    }
  };

  return {
    ...pwaStatus,
    installPWA,
    updatePWA
  };
};

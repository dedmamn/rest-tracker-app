import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Snackbar, Typography } from '@mui/material';
import { Download, Wifi, WifiOff } from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Проверка доступности установки PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Обработка изменения статуса сети
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (!online) {
        setShowOfflineAlert(true);
      }
    };

    // Обработка обновлений Service Worker
    const handleServiceWorkerUpdate = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setUpdateAvailable(true);
        });

        // Проверка на обновления
        navigator.serviceWorker.ready.then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    handleServiceWorkerUpdate();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA установлено');
    } else {
      console.log('Установка PWA отклонена');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleUpdateClick = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    window.location.reload();
  };

  return (
    <Box>
      {/* Кнопка установки PWA */}
      {isInstallable && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={handleInstallClick}
          sx={{ mb: 2 }}
        >
          Установить приложение
        </Button>
      )}

      {/* Индикатор статуса сети */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {isOnline ? (
          <Wifi color="success" sx={{ mr: 1 }} />
        ) : (
          <WifiOff color="error" sx={{ mr: 1 }} />
        )}
        <Typography variant="body2" color={isOnline ? 'success.main' : 'error.main'}>
          {isOnline ? 'В сети' : 'Офлайн режим'}
        </Typography>
      </Box>

      {/* Уведомление об офлайн режиме */}
      <Snackbar
        open={showOfflineAlert && !isOnline}
        autoHideDuration={6000}
        onClose={() => setShowOfflineAlert(false)}
      >
        <Alert severity="info" onClose={() => setShowOfflineAlert(false)}>
          Приложение работает в офлайн режиме. Ваши данные сохраняются локально.
        </Alert>
      </Snackbar>

      {/* Уведомление об обновлении */}
      <Snackbar
        open={updateAvailable}
        onClose={() => setUpdateAvailable(false)}
      >
        <Alert 
          severity="info" 
          action={
            <Button color="inherit" size="small" onClick={handleUpdateClick}>
              Обновить
            </Button>
          }
        >
          Доступна новая версия приложения
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PWAInstall;

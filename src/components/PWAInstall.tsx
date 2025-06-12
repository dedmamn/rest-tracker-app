import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Snackbar, Typography, Card, CardContent, Chip } from '@mui/material';
import { Download, Wifi, WifiOff, Apple, Android, PhoneIphone, Share } from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Определение типа устройства и браузера
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isChrome = /Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    isStandalone,
    isMobile: isIOS || isAndroid
  };
};

const PWAInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [deviceInfo] = useState(getDeviceInfo());

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

  // Проверяем, нужно ли показывать инструкции для мобильных
  const shouldShowMobileInstructions = () => {
    // Если уже установлено как PWA
    if (deviceInfo.isStandalone) return false;
    
    // Если есть нативная поддержка установки (Android Chrome)
    if (isInstallable) return false;
    
    // Показываем инструкции для iOS Safari и других мобильных браузеров
    return deviceInfo.isMobile;
  };

  const getInstallInstructions = () => {
    if (deviceInfo.isIOS && deviceInfo.isSafari) {
      return {
        title: 'Установка на iPhone/iPad',
        icon: <Apple />,
        steps: [
          'Нажмите кнопку "Поделиться" внизу экрана',
          'Выберите "На экран "Домой""',
          'Нажмите "Добавить" в правом верхнем углу'
        ],
        buttonText: 'Поделиться',
        buttonIcon: <Share />
      };
    } else if (deviceInfo.isAndroid) {
      return {
        title: 'Установка на Android',
        icon: <Android />,
        steps: [
          'Откройте меню браузера (⋮)',
          'Выберите "Добавить на главный экран"',
          'Нажмите "Установить" или "Добавить"'
        ],
        buttonText: 'Меню браузера',
        buttonIcon: <PhoneIphone />
      };
    }
    return null;
  };

  const instructions = getInstallInstructions();

  return (
    <Box>
      {/* Если приложение уже установлено */}
      {deviceInfo.isStandalone && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            🎉 Приложение успешно установлено!
          </Typography>
        </Alert>
      )}

      {/* Кнопка установки PWA (для поддерживаемых браузеров) */}
      {isInstallable && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={handleInstallClick}
          fullWidth
          sx={{ mb: 2, py: 1.5 }}
        >
          Установить приложение
        </Button>
      )}

      {/* Инструкции для мобильных устройств */}
      {shouldShowMobileInstructions() && instructions && (
        <Card sx={{ mb: 2, bgcolor: 'primary.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {instructions.icon}
              <Typography variant="h6" sx={{ ml: 1, color: 'primary.main' }}>
                {instructions.title}
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Установите приложение на домашний экран для лучшего опыта:
            </Typography>
            
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              {instructions.steps.map((step, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </Box>

            {deviceInfo.isIOS && (
              <Box sx={{ mt: 2 }}>
                <Chip 
                  icon={<Share />} 
                  label="Найдите кнопку поделиться"
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Информация о текущем устройстве (только в development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Информация об устройстве:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {deviceInfo.isIOS && <Chip label="iOS" size="small" />}
              {deviceInfo.isAndroid && <Chip label="Android" size="small" />}
              {deviceInfo.isSafari && <Chip label="Safari" size="small" />}
              {deviceInfo.isChrome && <Chip label="Chrome" size="small" />}
              {deviceInfo.isStandalone && <Chip label="PWA Mode" size="small" color="success" />}
              {isInstallable && <Chip label="Installable" size="small" color="primary" />}
            </Box>
          </CardContent>
        </Card>
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

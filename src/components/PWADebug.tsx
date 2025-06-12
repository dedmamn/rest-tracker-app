import React from 'react';
import { usePWA } from '../hooks/usePWA';

const PWADebug: React.FC = () => {
  const { isInstalled, isInstallable, isOnline, isUpdateAvailable, isIOS } = usePWA();

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 5px 0' }}>PWA Status</h4>
      <div>Установлено: {isInstalled ? '✅' : '❌'}</div>
      <div>Можно установить: {isInstallable ? '✅' : '❌'}</div>
      <div>Онлайн: {isOnline ? '✅' : '❌'}</div>
      <div>iOS: {isIOS ? '✅' : '❌'}</div>
      <div>Обновление: {isUpdateAvailable ? '✅' : '❌'}</div>
    </div>
  );
};

export default PWADebug;

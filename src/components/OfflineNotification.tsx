import React from 'react';
import { usePWA } from '../hooks/usePWA';

const OfflineNotification: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ff9800',
      color: 'white',
      padding: '8px 16px',
      textAlign: 'center',
      fontSize: '14px',
      zIndex: 9999,
      borderBottom: '1px solid #f57c00'
    }}>
      ⚠️ Нет соединения с интернетом. Приложение работает в автономном режиме.
    </div>
  );
};

export default OfflineNotification;

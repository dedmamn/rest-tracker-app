import React from 'react';

const PWADebugSimple: React.FC = () => {
  const isOnline = navigator.onLine;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '3px',
      fontSize: '11px',
      zIndex: 999
    }}>
      {isOnline ? '🟢' : '🔴'} {isStandalone ? '📱' : '🌐'}
    </div>
  );
};

export default PWADebugSimple;

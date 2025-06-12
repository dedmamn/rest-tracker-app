import React from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAQuickTest: React.FC = () => {
  const { isInstalled, isInstallable, isOnline, isIOS } = usePWA();

  const runQuickTest = () => {
    const results = [];
    
    // Проверка основных функций PWA
    if ('serviceWorker' in navigator) {
      results.push('✅ Service Worker поддерживается');
    } else {
      results.push('❌ Service Worker не поддерживается');
    }

    if (document.querySelector('link[rel="manifest"]')) {
      results.push('✅ Манифест найден');
    } else {
      results.push('❌ Манифест не найден');
    }

    if (location.protocol === 'https:' || location.hostname === 'localhost') {
      results.push('✅ HTTPS соединение');
    } else {
      results.push('❌ Требуется HTTPS');
    }

    if (isOnline) {
      results.push('✅ Интернет соединение');
    } else {
      results.push('⚠️ Оффлайн режим');
    }

    if (isInstalled) {
      results.push('✅ Приложение установлено');
    } else if (isInstallable) {
      results.push('⚠️ Можно установить');
    } else {
      results.push('❌ Установка недоступна');
    }

    alert(results.join('\n'));
  };

  return (
    <button
      onClick={runQuickTest}
      style={{
        position: 'fixed',
        top: '60px',
        right: '10px',
        background: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: '12px',
        zIndex: 999
      }}
    >
      🔍 Тест PWA
    </button>
  );
};

export default PWAQuickTest;

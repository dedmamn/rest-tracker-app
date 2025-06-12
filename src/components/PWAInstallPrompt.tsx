import React from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installPWA, isIOS } = usePWA();

  // Не показываем prompt если уже установлено
  if (isInstalled) {
    return null;
  }

  // Для iOS показываем инструкции
  if (isIOS && !isInstalled) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        background: '#4CAF50',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000
      }}>
        <div style={{ marginBottom: '10px' }}>
          📱 <strong>Установить приложение</strong>
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          Нажмите на иконку "Поделиться" в Safari, затем "Добавить на экран «Домой»"
        </div>
      </div>
    );
  }

  // Для других браузеров показываем кнопку установки
  if (isInstallable) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        background: '#4CAF50',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            📱 Установить приложение
          </div>
          <div style={{ fontSize: '14px' }}>
            Быстрый доступ с рабочего стола
          </div>
        </div>
        <button
          onClick={installPWA}
          style={{
            background: 'white',
            color: '#4CAF50',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Установить
        </button>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;

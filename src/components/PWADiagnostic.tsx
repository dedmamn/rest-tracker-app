import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

const PWADiagnostic: React.FC = () => {
  const { isInstalled, isInstallable, isOnline, isIOS } = usePWA();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, [isInstalled, isInstallable, isOnline, isIOS]);

  const runDiagnostics = () => {
    const results: DiagnosticResult[] = [];

    // Проверка HTTPS
    results.push({
      name: 'HTTPS',
      status: location.protocol === 'https:' || location.hostname === 'localhost' ? 'success' : 'error',
      message: location.protocol === 'https:' || location.hostname === 'localhost' 
        ? 'Соединение защищено' 
        : 'PWA требует HTTPS'
    });

    // Проверка Service Worker
    results.push({
      name: 'Service Worker',
      status: 'serviceWorker' in navigator ? 'success' : 'error',
      message: 'serviceWorker' in navigator 
        ? 'Поддерживается браузером' 
        : 'Не поддерживается браузером'
    });

    // Проверка манифеста
    results.push({
      name: 'Манифест',
      status: document.querySelector('link[rel="manifest"]') ? 'success' : 'warning',
      message: document.querySelector('link[rel="manifest"]') 
        ? 'Манифест найден' 
        : 'Манифест не найден'
    });

    // Проверка установки
    results.push({
      name: 'Установка',
      status: isInstalled ? 'success' : isInstallable ? 'warning' : 'error',
      message: isInstalled 
        ? 'Приложение установлено' 
        : isInstallable 
          ? 'Можно установить' 
          : 'Установка недоступна'
    });

    // Проверка сети
    results.push({
      name: 'Соединение',
      status: isOnline ? 'success' : 'warning',
      message: isOnline ? 'Онлайн' : 'Оффлайн'
    });

    setDiagnostics(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 1000
        }}
      >
        🔧
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>PWA Диагностика</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: '14px' }}>
        {diagnostics.map((result, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '5px 0',
              borderBottom: index < diagnostics.length - 1 ? '1px solid #eee' : 'none'
            }}
          >
            <span>{result.name}:</span>
            <span>
              {getStatusIcon(result.status)} {result.message}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={runDiagnostics}
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '8px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Обновить
      </button>
    </div>
  );
};

export default PWADiagnostic;

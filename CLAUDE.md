# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды разработки

- `npm start` - запуск dev-сервера на http://localhost:3000
- `npm run build` - создание production сборки 
- `npm test` - запуск тестов
- `npm run eject` - извлечение конфигурации (необратимо)

## Архитектура приложения

### PWA (Progressive Web App)
Это приложение разработано как PWA с полной поддержкой офлайн-режима:
- Service Worker в `public/sw.js` для кэширования
- Manifest в `public/manifest.json` для установки приложения
- Развертывание на GitHub Pages с basename="/rest-tracker-app"

### Технологический стек
- **React 18** с TypeScript
- **Material-UI (MUI)** для компонентов интерфейса
- **React Router** для навигации с basename="/rest-tracker-app" 
- **localStorage** + кастомное хранилище в `utils/enhancedStorage.ts`

### Структура данных
Основные типы в `src/types/index.ts`:
- `Activity` - активности отдыха с типами (physical, mental, social, creative, outdoor, passive)
- `Settings` - настройки приложения (тема, уведомления, время напоминаний)
- `Recurrence` - система повторяющихся активностей

### Система хранения данных
- **Основное хранилище**: `StorageManager` в `utils/storage.ts`
- **Расширенное хранилище**: `EnhancedStorage` в `utils/enhancedStorage.ts`
- **Автоматическая миграция**: `DataMigration` в `utils/dataMigration.ts`
- Префикс ключей: "rest-tracker-"
- Поддержка экспорта/импорта данных в JSON

### Управление состоянием
Центральный хук `useDataManager` в `hooks/useDataManager.ts` управляет:
- Загрузкой/сохранением данных
- CRUD операциями с активностями
- Настройками приложения
- Автоматическими бэкапами

### Система уведомлений
- Хук `useNotifications` для web-уведомлений
- Планированные напоминания об активностях
- Настройки времени напоминаний в Settings

### Адаптивный дизайн
- Mobile-first подход
- Стили в `styles/`: global.css, responsive.css, mobile-fixes.css, pwa.css
- Нижняя навигация для мобильных устройств
- Поддержка темной/светлой темы

### Страницы
- `Home` - главная страница с добавлением активностей
- `Activities` - список всех активностей
- `Settings` - настройки приложения и экспорт/импорт данных

## Особенности разработки

### PWA конфигурация
- Приложение работает с GitHub Pages по пути `/rest-tracker-app/`
- Router настроен с basename="/rest-tracker-app"
- Все пути в manifest.json используют этот префикс

### Отладка и тестирование
- Автоматическое тестирование localStorage при запуске в dev-режиме
- PWA компоненты для диагностики: PWADebug, PWADiagnostic, PWAQuickTest
- Функции `testLocalStorage` и `debugLocalStorage` в `utils/storageTest.ts`

### Система миграции данных
При первом запуске проверяется наличие старых данных и выполняется автоматическая миграция.

### Тематизация
- Material-UI ThemeProvider с динамическим переключением темы
- Обновление meta theme-color в зависимости от выбранной темы
- CSS переменные для кастомных стилей
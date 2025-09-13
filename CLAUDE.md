# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды разработки

- `npm start` - запуск dev-сервера на http://localhost:3000
- `npm run build` - создание production сборки 
- `npm test` - запуск тестов
- `npm run eject` - извлечение конфигурации (необратимо)

## Развертывание

- **GitHub Actions**: `.github/workflows/deploy.yml` - автоматическое развертывание на GitHub Pages
- **CI/CD**: Запускается при push в main/master ветки
- **Сборка**: Node.js 18, использует `npm ci` для чистой установки зависимостей

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
- `Activity` - активности отдыха с типами (physical, emotional, mental, social, sensory, spiritual, creative, outdoor, passive)
- `Settings` - настройки приложения (тема, уведомления, время напоминаний)
- `Recurrence` - система повторяющихся активностей
- **Новое**: `TestResult`, `FatigueScores` - система тестирования усталости

### Система хранения данных
- **Основное хранилище**: `StorageManager` в `utils/storage.ts`
- **Расширенное хранилище**: `EnhancedStorage` в `utils/enhancedStorage.ts`
- **Автоматическая миграция**: `DataMigration` в `utils/dataMigration.ts`
- Префикс ключей: "rest-tracker-data" и "rest-tracker-backup"
- Поддержка экспорта/импорта данных в JSON
- Умное резервное копирование (вечернее, раз в день)

### Управление состоянием
Центральные хуки управляют данными:
- **`useDataManager`** в `hooks/useDataManager.ts` - основные данные и активности
- **`useTestManager`** в `hooks/useTestManager.ts` - система тестирования усталости
- **`useNotifications`** в `hooks/useNotifications.ts` - уведомления и напоминания
- **`usePWA`** в `hooks/usePWA.ts` - PWA функциональность

### Система тестирования усталости
- **TestModal** - интерактивный тест с перемешанными вопросами
- **TestResults** - анализ и визуализация результатов
- **FirstTimeTestPopup** - попап для первого прохождения теста
- Система подсчета баллов по 9 типам усталости
- История результатов тестов в настройках

### Компоненты PWA
- **PWAInstall/PWAInstallPrompt** - установка приложения
- **OfflineNotification** - уведомление о работе офлайн
- **PWADebug/PWADiagnostic/PWAQuickTest** - диагностика PWA
- **BackupReminder** - напоминания о резервном копировании

### Адаптивный дизайн
- Mobile-first подход
- Стили в `styles/`: global.css, responsive.css, mobile-fixes.css, pwa.css
- Нижняя навигация для мобильных устройств
- Поддержка темной/светлой темы

### Страницы
- `Home` - главная страница с добавлением активностей и тестом усталости
- `Activities` - список всех активностей с фильтрацией
- `Settings` - настройки приложения, экспорт/импорт данных, история тестов

## Особенности разработки

### PWA конфигурация
- Приложение работает с GitHub Pages по пути `/rest-tracker-app/`
- Router настроен с basename="/rest-tracker-app"
- Все пути в manifest.json используют этот префикс

### Система миграции данных
- **DataMigration** класс автоматически мигрирует данные из старых ключей localStorage
- Поддержка миграции из ключей: `restTracker`, `rest-tracker-activities`, `rest-tracker-settings`
- Выбор лучших данных по алгоритму подсчета очков
- Автоматическая очистка старых ключей после миграции

### Отладка и тестирование
- Автоматическое тестирование localStorage при запуске в dev-режиме
- PWA компоненты для диагностики: PWADebug, PWADiagnostic, PWAQuickTest
- Функции `testLocalStorage` и `debugLocalStorage` в `utils/storageTest.ts`

### Тематизация
- Material-UI ThemeProvider с динамическим переключением темы
- Обновление meta theme-color в зависимости от выбранной темы
- CSS переменные для кастомных стилей

### Управление тестами усталости
- Перемешивание вопросов при каждом прохождении
- Валидация ответов и проверка завершенности
- Система предупреждений при прерывании теста
- Сохранение истории результатов в localStorage
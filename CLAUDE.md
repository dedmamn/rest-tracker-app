# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды разработки

- `npm start` - запуск dev-сервера на http://localhost:3000 (без sourcemaps: `GENERATE_SOURCEMAP=false`)
- `npm start:dev` - запуск dev-сервера с пустым PUBLIC_URL (для локальной разработки)
- `npm run build` - создание production сборки для GitHub Pages
- `npm run build:dev` - создание локальной сборки (без basename)
- `npm test` - запуск тестов в watch-режиме

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
  - Поля: `id`, `type`, `name`, `description?`, `recurrence?`, `duration?`, `createdAt`, `completedDates`, `isActive`
- `Settings` - настройки приложения (тема, уведомления, время напоминаний)
  - Содержит `testSettings: TestSettings` с историей тестов
- `Recurrence` - система повторяющихся активностей
  - `frequency: 'daily' | 'weekly' | 'monthly'`, `interval`, `daysOfWeek?`, `endDate?`
- `TestResult`, `FatigueScores` - система тестирования усталости
  - 9 типов усталости: physical, emotional, cognitive, social, achievement, caregiving, anxiety, hormonal, chronicFatigue
- `ActivityType` enum - 9 значений: PHYSICAL, EMOTIONAL, MENTAL, SOCIAL, SENSORY, SPIRITUAL, CREATIVE, OUTDOOR, PASSIVE

**Важно:** Всегда десериализуйте даты при загрузке из localStorage: `new Date(dateString)`

### Система хранения данных
Трехуровневая система хранения:
1. **`EnhancedStorage`** в `utils/enhancedStorage.ts` - базовый слой
   - Префикс ключей: `rest-tracker-{key}`
   - Обертка данных с метаданными: `{ data, timestamp, version: '1.0.0' }`
   - Методы: `save()`, `load<T>()`, `remove()`, `clear()`, `export()`, `import()`
2. **`StorageManager`** в `utils/storage.ts` - уровень приложения
   - Статический класс с предопределенными ключами: `data`, `backup`, `migrations`
   - `saveData(activities, settings)` - основной метод сохранения
   - `createSmartBackup()` - логика автосохранения (раз в день, 22:00-23:59)
   - `loadData()` возвращает `{ activities: Activity[]; settings: Settings } | null`
3. **`DataMigration`** в `utils/dataMigration.ts` - уровень миграции
   - Обнаруживает старые ключи: `restTracker`, `rest-tracker-activities`, и т.д.
   - Выбирает лучшие данные по алгоритму подсчета очков
   - Автоматически запускается при первой загрузке, если новое хранилище пустое
   - Вызовите `DataMigration.hasOldData()` перед попытками миграции

**Критически:** Всегда используйте `StorageManager` для данных приложения, никогда не обращайтесь к localStorage напрямую с ключами приложения.

### Управление состоянием
Центральные хуки управляют данными (нет Redux/Context):
- **`useDataManager`** в `hooks/useDataManager.ts` - основные данные и активности
  - Автосохранение в localStorage при изменении данных
  - Умное резервное копирование (раз в день, 22:00-23:59)
  - Автоматическая миграция старых данных при первой загрузке
  - Возврат: `{ activities, settings, addActivity, updateActivity, deleteActivity, exportData, importData, clearAllData, createBackup, getStorageInfo }`
- **`useTestManager`** в `hooks/useTestManager.ts` - система тестирования усталости
  - Управление модальными окнами теста и результатов
  - Автоматическое добавление рекомендуемых активностей
  - Возврат: `{ isTestModalOpen, isResultsModalOpen, currentTestResult, testHistory, shouldShowFirstTimePopup, openTestModal, closeTestModal, openResultsModal, closeResultsModal, completeTest, markFirstTestCompleted, addRecommendedActivities }`
- **`useNotifications`** в `hooks/useNotifications.ts` - уведомления и напоминания
- **`usePWA`** в `hooks/usePWA.ts` - PWA функциональность

### Система тестирования усталости
- **TestModal** - интерактивный тест с перемешанными вопросами
- **TestResults** - анализ и визуализация результатов
- **FirstTimeTestPopup** - всплывающее окно для первого прохождения теста
- Система подсчета баллов по 9 типам усталости (physical, emotional, cognitive, social, achievement, caregiving, anxiety, hormonal, chronicFatigue)
- История результатов тестов в настройках
- Автоматическое создание рекомендуемых активностей на основе результатов теста

### Компоненты PWA
- **PWAInstall** - установка приложения
- **OfflineNotification** - уведомление о работе офлайн
- **BackupReminder** - напоминания о резервном копировании

### Адаптивный дизайн
- Mobile-first подход
- Стили в `styles/`: global.css, responsive.css, mobile-fixes.css, pwa.css
- Нижняя навигация для мобильных устройств (MUI `BottomNavigation`)
- Все страницы используют `Container maxWidth="sm"` для согласования mobile-first дизайна
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
- Метод `DataMigration.hasOldData()` для проверки наличия старых данных
- Метод `DataMigration.showOldDataInfo()` для отображения информации о старых данных

### Отладка и тестирование
- Автоматическое тестирование localStorage при запуске в dev-режиме (App.tsx:76-85)
- Функции `testLocalStorage()` и `debugLocalStorage()` в `utils/storageTest.ts`
- В dev-режиме выводятся консольные логи с информацией о состоянии хранилища и уведомлений

### Тематизация
- Material-UI ThemeProvider с динамическим переключением темы на основе `settings.theme`
- Обновление мета-тега `theme-color` в зависимости от выбранной темы (App.tsx:88-97)
- Добавление data-атрибута `data-mui-color-scheme` для CSS селекторов
- CSS переменные для кастомных стилей в `styles/global.css`

### Управление тестами усталости
- Перемешивание вопросов при каждом прохождении (`shuffleQuestions` в `utils/testUtils.ts:59-66`)
- Валидация ответов и проверка завершенности
- Система предупреждений при прерывании теста
- Сохранение истории результатов в localStorage (`testSettings.testHistory`)
- Автоматическое определение доминирующих типов усталости (score >= 11)
- Функция `shouldShowMedicalWarning()` для отображения медицинских предупреждений при высоких показателях chronicFatigue и hormonal

## Шаблоны и конвенции

### Организация файлов
- **Hooks** (`src/hooks/`) - Вся логика управления состоянием, нет inline useState в страницах
- **Utils** (`src/utils/`) - Статические утилитные классы (StorageManager, DataMigration, NotificationManager, PWAManager, DataFormatter)
- **Types** (`src/types/index.ts`) - Единый источник правды для всех интерфейсов и перечислений
- **Data** (`src/data/`) - Статические данные: `predefinedActivities.ts`, `testData.ts`
- **Components** (`src/components/`) - Переиспользуемые компоненты
- **Pages** (`src/pages/`) - Страницы приложения
- **Styles** (`src/styles/`) - Глобальные CSS файлы: `global.css`, `responsive.css`, `mobile-fixes.css`, `pwa.css`

### Стилизация
- **Основной**: MUI `ThemeProvider` с переключением темы на основе `settings.theme`
- **Глобальный CSS**: `styles/global.css` - базовые стили и CSS переменные
- **Адаптивный**: `styles/responsive.css` - media queries для мобильных/планшетов/десктопа
- **Исправления для мобильных**: `styles/mobile-fixes.css` - специфичные хаки для iOS Safari
- **PWA стили**: `styles/pwa.css` - стили для установки приложения и офлайн баннера

### Стиль кода
- **Интерфейсы вместо типов** для моделей данных
- **Enums** для фиксированных наборов значений (ActivityType, frequency)
- **Хуки** должны возвращать типизированные интерфейсы (например, `UseDataManagerReturn`)
- **Колбэки**: Используйте `useCallback` для функций, передаваемых в дочерние компоненты
- **Обработка дат**: Всегда сериализуйте как ISO строки для хранения, десериализуйте в объекты Date
- **Комментарии**: На русском языке для улучшения понимания кода

### Соглашения именования
- Компоненты: PascalCase (`ActivityCard.tsx`)
- Хуки: camelCase с префиксом `use` (`useDataManager.ts`)
- Утилиты: PascalCase классы (`StorageManager`, `DataMigration`)
- Константы: SCREAMING_SNAKE_CASE (`OLD_KEYS`, `CACHE_NAME`)
- Ключи localStorage: kebab-case с префиксом (`rest-tracker-data`)

## Распространенные задачи

### Добавление нового типа активности
1. Добавьте значение enum в `ActivityType` в [types/index.ts](src/types/index.ts)
2. Обновите `predefinedActivities.ts` с примерами активностей
3. Добавьте маппинг иконок/цветов в компонентах, использующих типы активностей

### Модификация схемы хранения
1. Обновите интерфейсы в [types/index.ts](src/types/index.ts)
2. Увеличьте версию в `EnhancedStorage` (текущая `1.0.0`)
3. Добавьте логику миграции в `DataMigration` при критических изменениях
4. Протестируйте с `testLocalStorage()` в dev-режиме

### Добавление вопросов теста
1. Обновите `testData.ts` с новыми вопросами
2. Вопросы используют блоки A-E, каждый маппится на определенные измерения усталости
3. Логика подсчета баллов в [utils/testUtils.ts](src/utils/testUtils.ts) - каждый ответ вносит вклад в оценку усталости

### Обновления PWA
1. Измените стратегию кэширования или URL в `service-worker.js`
2. Обновите `manifest.json` для ярлыков, иконок или метаданных
3. Протестируйте с хуком `usePWA` для установки и обнаружения офлайн режима
4. Помните: всем URL нужен префикс `/rest-tracker-app/` в production

## Критические моменты

1. **Несоответствия basename** ломают маршрутизацию в production - всегда проверяйте `process.env.NODE_ENV`
2. **Сериализация дат** - localStorage хранит строки, нужно преобразовывать обратно в Date объекты
3. **Кэширование Service Worker** - старый SW может сохраняться, очистите кэш или увеличьте `CACHE_NAME`
4. **Обновление темы** - нужно обновлять тему MUI И мета-тег для интеграции с нативным UI
5. **Миграция запускается один раз** - `DataMigration` очищает старые ключи, тщательно тестируйте перед релизом
6. **Время smart backup** - только в 22:00-23:59, чтобы избежать спама хранилища во время активного использования
7. **Флаг инициализации** - `useDataManager` использует флаг `isInitialized` для предотвращения сохранения при первой загрузке
# Руководство по деплою приложения "Трекер отдыха"

## Обзор

Это PWA приложение на React готово для деплоя на GitHub Pages. Все необходимые файлы уже настроены для автоматического деплоя.

## Подготовка к деплою

### 1. Настройка GitHub репозитория

1. **Создайте GitHub репозиторий** (если еще не создан):

   ```bash
   # В корне проекта
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/rest-tracker-app.git
   git push -u origin main
   ```

2. **Обновите URLs в package.json**:
   - Замените `yourusername` на ваш GitHub username в поле `homepage`
   - Замените URL в поле `repository.url`

### 2. Настройка GitHub Pages

1. Перейдите в настройки репозитория: `Settings → Pages`
2. В разделе "Source" выберите "GitHub Actions"
3. Сохраните настройки

### 3. Автоматический деплой

После push в main ветку автоматически запустится GitHub Actions workflow:

1. **Сборка проекта** - `npm run build`
2. **Деплой на GitHub Pages** - автоматическая публикация
3. **URL приложения** - `https://yourusername.github.io/rest-tracker-app`

## Особенности PWA деплоя

### Service Worker

- ✅ Настроен для кэширования статических ресурсов
- ✅ Работает с GitHub Pages URLs
- ✅ Поддерживает оффлайн режим

### Манифест

- ✅ Настроен для установки приложения
- ✅ Иконки оптимизированы для всех устройств
- ✅ Поддержка shortcuts (быстрые действия)

### Redirects

- ✅ Настроен файл `_redirects` для SPA роутинга
- ✅ Все маршруты ведут на `index.html`

## Проверка деплоя

### 1. Основные функции

После деплоя проверьте:

- [ ] Приложение загружается по URL
- [ ] Навигация между страницами работает
- [ ] Данные сохраняются в localStorage
- [ ] Responsive дизайн работает на мобильных

### 2. PWA функции

- [ ] Появляется prompt для установки
- [ ] Приложение работает оффлайн
- [ ] Манифест загружается без ошибок
- [ ] Service Worker регистрируется

### 3. Инструменты проверки

```bash
# Запуск локальной сборки для тестирования
npm run build
npx serve -s build

# Проверка PWA в Chrome DevTools
# Application → Manifest
# Application → Service Workers
# Lighthouse → PWA аудит
```

## Troubleshooting

### Проблема: 404 при обновлении страницы

**Решение**: Убедитесь что файл `public/_redirects` содержит:

```
/*    /index.html   200
```

### Проблема: Service Worker не обновляется

**Решение**: Очистите кэш браузера или используйте режим инкогнито

### Проблема: Иконки не загружаются

**Решение**: Проверьте пути в `public/manifest.json` - они должны быть относительными

### Проблема: GitHub Actions не запускается

**Решение**:

1. Проверьте что в Settings → Actions разрешено "Allow all actions"
2. Убедитесь что push был в main или master ветку

## Альтернативные платформы

Если GitHub Pages не подходит, приложение можно задеплоить на:

### Netlify

```bash
npm run build
# Drag & drop папку build в Netlify
```

### Vercel

```bash
npx vercel --prod
```

### Digital Ocean App Platform

1. Подключите GitHub репозиторий
2. Настройте build command: `npm run build`
3. Output directory: `build`

## Мониторинг

После деплоя рекомендуется настроить:

- **Google Analytics** для отслеживания использования
- **Sentry** для мониторинга ошибок
- **Lighthouse CI** для регулярного аудита PWA

## Обновления

Для обновления приложения:

1. Внесите изменения в код
2. Сделайте commit и push
3. GitHub Actions автоматически задеплоит обновления
4. Пользователи получат уведомление об обновлении PWA

---

🚀 **Готово к деплою!** Следуйте инструкциям выше для публикации вашего PWA приложения.

const CACHE_NAME = 'rest-tracker-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  // Google Fonts
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Установка Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Установка');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Кеширование файлов');
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, { 
            mode: 'no-cors',
            cache: 'reload'
          });
        })).catch(function(error) {
          console.warn('Service Worker: Ошибка кеширования некоторых файлов:', error);
          // Кешируем файлы по одному, игнорируя ошибки
          return Promise.all(
            urlsToCache.map(url => {
              return cache.add(url).catch(err => {
                console.warn(`Не удалось кешировать ${url}:`, err);
              });
            })
          );
        });
      })
  );
  
  // Форсируем активацию нового Service Worker
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Активация');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Удаление старого кеша', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Берем контроль над всеми клиентами
  return self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', function(event) {
  // Игнорируем запросы к chrome-extension, webpack dev server и другим схемам
  if (!event.request.url.startsWith('http') || 
      event.request.url.includes('webpack') ||
      event.request.url.includes('hot-update') ||
      event.request.url.includes('/ws')) {
    return;
  }

  // В development режиме не кешируем статические файлы
  const isDev = event.request.url.includes('localhost:3000');
  const isStaticAsset = event.request.url.includes('/static/');
  
  if (isDev && isStaticAsset) {
    // В dev режиме всегда идем в сеть для статических файлов
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Возвращаем кешированную версию, если она есть
        if (response) {
          // Логируем только важные файлы, а не каждый запрос
          const url = event.request.url;
          if (url.includes('manifest.json') || url.includes('icon') || url === '/') {
            console.log('Service Worker: Возврат из кеша', url.split('/').pop());
          }
          return response;
        }

        // Если нет в кеше, делаем сетевой запрос
        return fetch(event.request).then(function(response) {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Клонируем ответ для кеширования только важных файлов
          const url = event.request.url;
          const shouldCache = url.includes('manifest.json') || 
                            url.includes('icon') || 
                            url.includes('fonts.googleapis.com') ||
                            url === location.origin + '/';

          if (shouldCache && event.request.method === 'GET') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch(function(error) {
          // Логируем только существенные ошибки
          const url = event.request.url;
          if (!url.includes('gstatic.com') && !url.includes('/ws')) {
            console.log('Service Worker: Сетевой запрос неудачен', error);
          }
          
          // Возвращаем офлайн страницу для навигационных запросов
          if (event.request.destination === 'document') {
            return caches.match('/').then(function(response) {
              return response || new Response('Приложение недоступно офлайн', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/html; charset=utf-8'
                })
              });
            });
          }
          
          // Для шрифтов и других ресурсов тихо возвращаем ошибку
          throw error;
        });
      })
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Синхронизация в фоне (для будущих функций)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Фоновая синхронизация');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Здесь можно добавить логику синхронизации данных
  return Promise.resolve();
}

// Push уведомления (для будущих функций)
self.addEventListener('push', function(event) {
  console.log('Service Worker: Push уведомление получено');
  
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от Трекера отдыха',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть приложение',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Трекер отдыха', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', function(event) {
  console.log('Service Worker: Клик по уведомлению');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

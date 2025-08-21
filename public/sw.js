const CACHE_NAME = 'beatdeath-survivalist-v1';
const STATIC_CACHE = 'beatdeath-static-v1';
const DYNAMIC_CACHE = 'beatdeath-dynamic-v1';

// Critical survivalist resources to cache
const STATIC_ASSETS = [
  '/',
  '/death-scanner',
  '/manifest.json',
  '/favicon.ico'
];

// Field manual data for offline access
const FIELD_MANUAL_DATA = {
  toxins: [
    { name: "Household Bleach", risk: "High", symptoms: "Respiratory distress, skin burns" },
    { name: "Wild Mushrooms", risk: "Extreme", symptoms: "Liver failure, hallucinations" },
    { name: "Carbon Monoxide", risk: "Lethal", symptoms: "Headache, unconsciousness" }
  ],
  environmental: [
    { threat: "Hypothermia", signs: "Shivering, confusion" },
    { threat: "Heat Stroke", signs: "High temperature, no sweating" }
  ]
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing BeatDeath Survivalist Mode...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static survivalist assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open('field-manual').then((cache) => {
        console.log('[SW] Caching field manual for offline access');
        return cache.put('field-manual-data', new Response(JSON.stringify(FIELD_MANUAL_DATA)));
      })
    ])
  );
  
  // Force activate new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating BeatDeath Survivalist Mode...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== 'field-manual') {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle field manual requests
  if (request.url.includes('field-manual-data')) {
    event.respondWith(
      caches.match('field-manual-data').then((response) => {
        return response || new Response(JSON.stringify(FIELD_MANUAL_DATA));
      })
    );
    return;
  }
  
  // Cache-first strategy for static assets
  if (STATIC_ASSETS.some(asset => request.url.endsWith(asset))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
      }).catch(() => {
        // Offline fallback
        if (request.destination === 'document') {
          return caches.match('/');
        }
      })
    );
    return;
  }
  
  // Network-first strategy for dynamic content
  event.respondWith(
    fetch(request).then((response) => {
      // Cache successful responses
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      // Fallback to cache when offline
      return caches.match(request).then((response) => {
        return response || new Response('Offline - BeatDeath Survivalist Mode Active', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'survival-data-sync') {
    event.waitUntil(syncSurvivalData());
  }
});

// Push notifications for survival alerts
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Survival alert detected',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'survival-alert',
    actions: [
      {
        action: 'open-scanner',
        title: 'Open Scanner'
      },
      {
        action: 'view-manual',
        title: 'Field Manual'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BeatDeath Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  let targetUrl = '/';
  if (event.action === 'open-scanner') {
    targetUrl = '/death-scanner';
  } else if (event.action === 'view-manual') {
    targetUrl = '/?manual=true';
  }
  
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});

async function syncSurvivalData() {
  try {
    console.log('[SW] Syncing survival data in background...');
    // Placeholder for future backend sync
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Failed to sync survival data:', error);
  }
}
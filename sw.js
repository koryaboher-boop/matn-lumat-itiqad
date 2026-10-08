/* Ù…Ù†Ø§Ø±Ø© â€” Service Worker: cache-first Ù„Ù„Ø¹Ù…Ù„ Ø§Ù„ÙƒØ§Ù…Ù„ Ø¯ÙˆÙ† Ø¥Ù†ØªØ±Ù†Øª Â· API Ø¯Ø§Ø¦Ù…Ù‹Ø§ Ù…Ù† Ø§Ù„Ø´Ø¨ÙƒØ© */
const CACHE = 'luma-itiqad-v3';
const ASSETS = [
  './index.html?v=85',
  './css/styles.css?v=85',
  './js/data.js?v=85',
  './js/app.js?v=85',
  './manifest.webmanifest?v=85',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/favicon-64.png',
  './icons/apple-touch-icon.png',
  './fonts/amiri-400-arabic.woff2',
  './fonts/amiri-400-latin.woff2',
  './fonts/amiri-400i-arabic.woff2',
  './fonts/amiri-400i-latin.woff2',
  './fonts/amiri-700-arabic.woff2',
  './fonts/amiri-700-latin.woff2',
  './fonts/notokufiarabic-400-arabic.woff2',
  './fonts/notokufiarabic-400-latin.woff2',
  './fonts/notokufiarabic-500-arabic.woff2',
  './fonts/notokufiarabic-500-latin.woff2',
  './fonts/notokufiarabic-600-arabic.woff2',
  './fonts/notokufiarabic-600-latin.woff2',
  './fonts/notokufiarabic-700-arabic.woff2',
  './fonts/notokufiarabic-700-latin.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  /* Ø­Ø³Ø§Ø¨Ø§Øª ÙˆÙ…Ø²Ø§Ù…Ù†Ø© Ø§Ù„ØªÙ‚Ø¯Ù‘Ù…: Ø´Ø¨ÙƒØ© ÙÙ‚Ø·ØŒ Ø¨Ù„Ø§ ØªØ®Ø²ÙŠÙ† â€” ÙˆÙ…Ù„ÙØ§Øª Ø§Ù„ØªØ­Ù…ÙŠÙ„ ÙƒØ°Ù„Ùƒ */
  if (url.origin === location.origin && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/downloads/'))) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit ||
      fetch(e.request).then((res) => {
        if (url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
        throw new Error('offline');
      })
    )
  );
});



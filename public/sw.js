importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // Precache files
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Cache API responses
  workbox.routing.registerRoute(
    new RegExp('https://api.siliconflow.cn/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        }),
      ],
    })
  );

  // Handle navigation requests
  workbox.routing.registerNavigationRoute(
    workbox.precaching.getCacheKeyForURL('/index.html'), {
      denylist: [/^\/api\//] // Ensure API calls aren't routed to index.html
    }
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
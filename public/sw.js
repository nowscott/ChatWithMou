importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  const precacheResources = [
    { url: 'index.html', revision: null },
    { url: 'styles.css', revision: null },
    { url: 'script.js', revision: null }
  ];

  workbox.precaching.precacheAndRoute(precacheResources);

  workbox.routing.registerRoute(
    new RegExp('https://api.siliconflow.cn/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24,
        }),
      ],
    })
  );

  const handler = workbox.precaching.createHandlerBoundToURL('/index.html');
  const navigationRoute = new workbox.routing.NavigationRoute(handler, {
    denylist: [/^\/api\//],
  });

  workbox.routing.registerRoute(navigationRoute);

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
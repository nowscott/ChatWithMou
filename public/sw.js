importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // 定义要缓存的资源列表
  const precacheResources = [
    { url: 'index.html', revision: null },
    { url: 'styles.css', revision: null },
    { url: 'script.js', revision: null }
  ];

  // 预缓存和路由
  workbox.precaching.precacheAndRoute(precacheResources);

  // 缓存 API 响应
  workbox.routing.registerRoute(
    new RegExp('https://api.siliconflow.cn/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24, // 1 天
        }),
      ],
    })
  );

  // 处理导航请求
  const handler = workbox.precaching.createHandlerBoundToURL('/index.html');
  const navigationRoute = new workbox.routing.NavigationRoute(handler, {
    denylist: [/^\/api\//], // 确保 API 调用不被路由到 index.html
  });

  workbox.routing.registerRoute(navigationRoute);

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
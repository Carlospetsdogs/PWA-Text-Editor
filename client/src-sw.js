// Import necessary Workbox modules
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// Precache the assets defined in the Workbox manifest
precacheAndRoute(self.__WB_MANIFEST);

// Define a caching strategy for page navigation requests
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    // Ensure responses are cacheable only if their status is 0 or 200
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    // Set the cache to expire after 30 days
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// Warm up the cache by preloading the specified URLs
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Register a route to use the page cache strategy for navigation requests
registerRoute(
  ({ request }) => request.mode === 'navigate', // Apply this strategy to navigation requests
  pageCache
);

// Register a route to handle caching for styles, scripts, and workers
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    // Name of the cache storage
    cacheName: 'asset-cache',
    plugins: [
      // Cache responses with statuses 0 or 200
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

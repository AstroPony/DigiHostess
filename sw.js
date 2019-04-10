// SW Versioning

const version = "0.1";

// Cache City
const appAssets = [
  "index.html",
  "main.js",
  "images/flame.png",
  "images/logo.png",
  "images/sync.png",
  "vendor/bootstrap.min.css",
  "vendor/jquery.min.js"
];

// SW Install
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(`static-${version}`).then(cache => cache.addAll(appAssets))
  );
});

self.addEventListener("activate", e => {
  let cleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== `static-${version}` && key.match("static-")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(cleaned);
});

// Cache Strategy - Cache with Network Fallback
const staticCache = (req, cacheName = `static-${version}`) => {
  return caches.match(req).then(cachedRes => {
    // Return cached response if found
    if (cachedRes) return cachedRes;

    // Fallback to Network
    return fetch(req).then(networkRes => {
      // Update existing cache
      caches.open(cacheName).then(cache => cache.put(req, networkRes));
      return networkRes.clone();
    });
  });
};

// Cache Strategy - Network with Cache Fallback
const fallbackCache = req => {
  // Try Network
  return (
    fetch(req)
      .then(networkRes => {
        // Check if result is OK, else go to Cache
        if (!networkRes.ok) throw "Fetch Error";

        // Update Cache
        caches
          .open(`static-${version}`)
          .then(cache => cache.put(req, networkRes));

        // Return clone of result
        return networkRes.clone();
      })

      // Try Cache
      .catch(err => caches.match(req))
  );
};

// Clean old dynamic cached items
const cleanDynamicContent = currentDynContent => {
  caches.open("giphy").then(cache => {
    // Get all cache entries
    cache.keys().then(keys => {
      // Loop Entries (Requests)
      keys.forEach(key => {
        // If key does not exist, then delete
        if (!currentDynContent.includes(key.url)) {
          cache.delete(key);
        }
      });
    });
  });
};

// SW Fetch
self.addEventListener("fetch", e => {
  // App Shell
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request));

    // Dynamic
  } else if (e.request.url.match("api.giphy.com/v1/gifs/trending")) {
    e.respondWith(fallbackCache(e.request));

    // Media
  } else if (e.request.url.match("giphy.com/media")) {
    e.respondWith(staticCache(e.request, "giphy"));
  }
});

// Listen for message from client
self.addEventListener("message", e => {
  // Identify Message
  if (e.data.action === "cleanDynamicContent") {
    cleanDynamicContent(e.data.content);
  }
});

const cacheName = 'palleseddel';
const appShellFiles = [
    './',
    './app.json',
    './favicon.ico',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './favicon-96x96.png',
    './index.html',
    './main.css',
    './main.html',
    './sw.js',
    './js/main.js',
    './js/db.js',
    './icons/android-icon-36x36.png',
    './icons/android-icon-48x48.png',
    './icons/android-icon-72x72.png',
    './icons/android-icon-96x96.png',
    './icons/android-icon-144x144.png',
    './icons/android-icon-192x192.png',
    './icons/android-icon-512x512.png',
    './icons/apple-icon.png',
    './icons/apple-icon-57x57.png',
    './icons/apple-icon-60x60.png',
    './icons/apple-icon-72x72.png',
    './icons/apple-icon-76x76.png',
    './icons/apple-icon-114x114.png',
    './icons/apple-icon-120x120.png',
    './icons/apple-icon-144x144.png',
    './icons/apple-icon-152x152.png',
    './icons/apple-icon-180x180.png',
    './icons/apple-icon-precomposed.png',
    './icons/eraser-50x50.png',
    './icons/favicon.ico',
    './icons/favicon-16x16.png',
    './icons/favicon-32x32.png',
    './icons/favicon-96x96.png',
    './icons/ms-icon-70x70.png',
    './icons/ms-icon-144x144.png',
    './icons/ms-icon-150x150.png',
    './icons/ms-icon-310x310.png'
];

async function cacheFiles() {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(appShellFiles);
    console.log('files cached');
}

self.addEventListener('install', event => {
    // fires when the browser installs the app
    // here we're just logging the event and the contents
    // of the object passed to the event. the purpose of this event
    // is to give the service worker a place to setup the local 
    // environment after the installation completes.
    console.log(`Event fired: ${event.type}`);
    console.dir(event);
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(appShellFiles);
            })
    );
});

self.addEventListener('activate', event => {
    // fires after the service worker completes its installation. 
    // It's a place for the service worker to clean up from previous 
    // service worker versions
    console.log(`Event fired: ${event.type}`);
    console.dir(event);
});

self.addEventListener('fetch', event => {
    // Fires whenever the app requests a resource (file or data)
    // normally this is where the service worker would check to see
    // if the requested resource is in the local cache before going
    // to the server to get it. There's a whole chapter in the book
    // covering different cache strategies, so I'm not going to say 
    // any more about this here
    console.log(`Fetching ${event.request.url}`);
    // console.dir(event.request);
    // Next, go get the requested resource from the network, 
    // nothing fancy going on here.
    event.respondWith((async () => {
        const r = await caches.match(event.request);
        console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
        if (r) { return r; }
        const response = await fetch(event.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
        cache.put(event.request, response.clone());
        return response;
    })());
});
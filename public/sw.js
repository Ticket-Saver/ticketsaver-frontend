// Kill-switch del Service Worker viejo.
//
// El sitio anterior se construia con vite-plugin-pwa (workbox, registerType
// 'autoUpdate', globPatterns con **/*.html): precacheaba index.html y todos los
// assets. El rediseno quito el plugin, asi que /sw.js dejo de existir en el
// build y el _redirects SPA lo respondia como index.html (text/html). El
// navegador rechaza esa actualizacion ("unsupported MIME type") y NO desregistra
// el worker viejo: sigue sirviendo el index.html precacheado, o sea el front
// anterior, para siempre. Por eso algunos usuarios ven el sitio viejo.
//
// Este archivo lo reemplaza por un worker que se autodestruye: borra las caches,
// se desregistra y recarga las pestanas abiertas.
//
// NO BORRAR. Un usuario que no vuelve en meses todavia tiene el SW viejo
// registrado y necesita encontrar este archivo cuando vuelva.
// ponytail: sin fetch handler a proposito, asi toda navegacion va a la red.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))

      await self.registration.unregister()

      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })()
  )
})

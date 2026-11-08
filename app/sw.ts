/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, type SerwistGlobalConfig, CacheFirst, ExpirationPlugin, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Study content (JSON bundles under /data). Cache-first; the URL changes only on a new release.
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/data/"),
      handler: new CacheFirst({
        cacheName: "study-data-v1",
        plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 })],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [{ url: "/offline", matcher: ({ request }) => request.destination === "document" }],
  },
});

serwist.addEventListeners();


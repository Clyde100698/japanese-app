"use client";
import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener("statechange", () => {
                if (installing.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("New content available; please refresh.");
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("ServiceWorker registration failed:", err);
        });
    }
  }, []);

  return null;
}


"use client";

import { useEffect } from "react";

/**
 * Marks the element whose id matches the URL hash with `data-highlighted="true"`.
 * CSS `:target` doesn't update on Next.js client-side navigation, so links like
 * /industries#healthcare from the homepage wheel need this to highlight their card.
 */
export function HashHighlight() {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll("[data-highlighted]").forEach((el) => el.removeAttribute("data-highlighted"));
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) document.getElementById(id)?.setAttribute("data-highlighted", "true");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return null;
}

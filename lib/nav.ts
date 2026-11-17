import type { Href, Router } from "expo-router";

let lastKey = "";
let lastAt = 0;

/**
 * Opens a screen once. A repeat tap on the same destination that lands before
 * the screen has appeared is ignored, so a quick double tap cannot stack two
 * copies. Moving on to a different screen is never held back.
 */
export function pushOnce(router: Pick<Router, "push">, href: Href) {
  const key = typeof href === "string" ? href : JSON.stringify(href);
  const now = Date.now();
  if (key === lastKey && now - lastAt < 1000) return;
  lastKey = key;
  lastAt = now;
  router.push(href);
}

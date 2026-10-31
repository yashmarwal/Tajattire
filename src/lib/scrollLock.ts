import { useEffect } from "react";
import { lockScroll as lenisLock } from "./lenis-store";

/**
 * Freezes the page behind an overlay (menu, product popup, photo viewer,
 * chat). `overflow: hidden` alone is ignored by iPhone Safari for touch
 * scrolling, so the body is pinned with position: fixed at the current
 * offset and restored exactly on release. Reference-counted, so stacked
 * overlays (popup → photo viewer) don't unlock each other early.
 */
let count = 0;
let savedY = 0;
const saved: Partial<CSSStyleDeclaration> = {};

export const isScrollLocked = () => count > 0;

function lock() {
  if (count++ > 0) return;
  savedY = window.scrollY;
  const b = document.body.style;
  saved.position = b.position;
  saved.top = b.top;
  saved.left = b.left;
  saved.right = b.right;
  saved.width = b.width;
  saved.overflow = b.overflow;
  b.position = "fixed";
  b.top = `-${savedY}px`;
  b.left = "0";
  b.right = "0";
  b.width = "100%";
  b.overflow = "hidden";
  document.documentElement.style.overscrollBehavior = "none";
  lenisLock(true);
}

function unlock() {
  if (count === 0 || --count > 0) return;
  const b = document.body.style;
  b.position = saved.position ?? "";
  b.top = saved.top ?? "";
  b.left = saved.left ?? "";
  b.right = saved.right ?? "";
  b.width = saved.width ?? "";
  b.overflow = saved.overflow ?? "";
  document.documentElement.style.overscrollBehavior = "";
  window.scrollTo({ top: savedY, left: 0, behavior: "instant" as ScrollBehavior });
  lenisLock(false);
}

/** Lock the page while `active` is true. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}

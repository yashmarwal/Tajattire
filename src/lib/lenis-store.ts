/** Minimal shape of the Lenis instance we use (avoids importing its types eagerly). */
interface LenisLike {
  scrollTo: (
    target: number | HTMLElement,
    opts?: { immediate?: boolean; force?: boolean; offset?: number },
  ) => void;
  stop: () => void;
  start: () => void;
}

let instance: LenisLike | null = null;

export function registerLenis(lenis: LenisLike) {
  instance = lenis;
}

export function unregisterLenis() {
  instance = null;
}

export function scrollToTopInstant() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
}

export function scrollToElement(el: HTMLElement, smooth: boolean) {
  const offset = -80; // clear the fixed header
  if (instance) {
    instance.scrollTo(el, { immediate: !smooth, force: true, offset });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: smooth ? "smooth" : ("instant" as ScrollBehavior) });
}

/** Pause smooth-scrolling while a modal/menu is open. */
export function lockScroll(locked: boolean) {
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}

/** Jump to an exact vertical offset (used to restore position on Back). */
export function scrollToYInstant(y: number) {
  if (instance) instance.scrollTo(y, { immediate: true, force: true });
  window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
}

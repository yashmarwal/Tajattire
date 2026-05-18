let instance: any = null;

export function registerLenis(lenis: any) {
  instance = lenis;
}

export function unregisterLenis() {
  instance = null;
}

export function lenisScrollTo(target: string | HTMLElement) {
  if (instance) {
    instance.scrollTo(target, { immediate: true, force: true });
  } else {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView();
    } else {
      target.scrollIntoView();
    }
  }
}

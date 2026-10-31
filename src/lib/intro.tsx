import { createContext, useContext } from "react";

/** True once the splash screen has finished (or was skipped). The hero
 * starts its text reveal off this, not off a hard-coded delay. */
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);

const KEY = "taj:intro-seen";
/** The splash plays once per browser session, not on every full page load. */
export function shouldPlayIntro(): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}
export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
}

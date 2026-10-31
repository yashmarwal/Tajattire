import { useEffect, useRef } from "react";

/**
 * Makes an overlay respond to the browser / Android back gesture by closing
 * itself instead of leaving the page. Each open overlay pushes one history
 * entry; a depth counter makes sure only the top-most overlay reacts when
 * several are stacked (e.g. a lightbox opened from a product dialog).
 */
let globalDepth = 0;

export function useBackToClose(open: boolean, onClose: () => void) {
  const pushedRef = useRef(false);
  const depthRef = useRef(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Consume our history marker when the overlay closes via the UI (or
  // unmounts while open). Guarded: if a real navigation has since pushed its
  // own entry, going back would undo that navigation, so we leave it.
  const release = () => {
    if (!pushedRef.current) return;
    pushedRef.current = false;
    globalDepth = Math.max(0, globalDepth - 1);
    const state = window.history.state as { overlay?: boolean; depth?: number } | null;
    if (state?.overlay && state.depth === depthRef.current) window.history.back();
  };

  useEffect(() => {
    if (open && !pushedRef.current) {
      depthRef.current = ++globalDepth;
      window.history.pushState(
        { ...(window.history.state ?? {}), overlay: true, depth: depthRef.current },
        "",
      );
      pushedRef.current = true;
    } else if (!open) {
      release();
    }
  }, [open]);

  useEffect(() => {
    const onPop = () => {
      if (pushedRef.current && depthRef.current === globalDepth) {
        pushedRef.current = false;
        globalDepth = Math.max(0, globalDepth - 1);
        onCloseRef.current();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      release();
    };
  }, []);
}

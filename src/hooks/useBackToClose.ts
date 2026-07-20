import { useEffect, useRef } from "react";

/**
 * Makes an overlay/modal respond to the browser/Android back gesture by closing
 * itself instead of leaving the page. Each open overlay pushes one history entry;
 * a stack depth counter ensures only the topmost overlay reacts to a given
 * back-press when multiple overlays are stacked (e.g. Quick Enquiry opened from
 * inside the View All catalogue).
 */
let globalDepth = 0;

export function useBackToClose(open: boolean, onClose: () => void) {
  const pushedRef = useRef(false);
  const myDepthRef = useRef(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open && !pushedRef.current) {
      myDepthRef.current = ++globalDepth;
      window.history.pushState({ overlay: true, depth: myDepthRef.current }, "");
      pushedRef.current = true;
    }
  }, [open]);

  useEffect(() => {
    const handler = () => {
      if (pushedRef.current && myDepthRef.current === globalDepth) {
        pushedRef.current = false;
        globalDepth = Math.max(0, globalDepth - 1);
        onCloseRef.current();
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Overlay closed via UI (not the back button) — consume the pushed history entry
  // so a later physical back-press doesn't land on a dangling forward state.
  // Guarded: if a real navigation (e.g. a route link inside the overlay) has
  // since pushed its own entry on top, the overlay's marker is no longer the
  // current history state — calling back() here would silently undo that
  // navigation instead of just dropping the marker.
  useEffect(() => {
    if (!open && pushedRef.current) {
      pushedRef.current = false;
      globalDepth = Math.max(0, globalDepth - 1);
      if ((window.history.state as { overlay?: boolean } | null)?.overlay) {
        window.history.back();
      }
    }
  }, [open]);
}

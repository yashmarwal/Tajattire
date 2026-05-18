import { createContext, useContext } from "react";

export type NavigateFn = (href: string) => void;

export const PageTransitionContext = createContext<NavigateFn>(() => {});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

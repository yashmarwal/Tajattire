import type { ReactNode } from "react";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { IconArrow } from "./icons";

export type PillVariant = "primary" | "secondary" | "tertiary" | "secondary-dark" | "wa";

interface PillProps {
  children: ReactNode;
  /** Internal route ("/contact") — navigates with the page cross-fade. */
  to?: string;
  /** External link (WhatsApp, tel:, mailto:, PDF …). */
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: PillVariant;
  className?: string;
  download?: boolean;
  newTab?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}

/** CTA pill: label + round icon chip. Primary / secondary / tertiary share one
 * shape so a row of them always reads as a set. Hover sweep is transform-only
 * and only on devices that really hover (no sticky hover after a tap). */
export function Pill({
  children,
  to,
  href,
  onClick,
  icon,
  variant = "primary",
  className = "",
  download,
  newTab,
  type = "button",
  ariaLabel,
}: PillProps) {
  const navigate = usePageTransition();
  const cls = `pill pill-${variant} ${className}`;
  const inner = (
    <>
      <span className="pill-label">{children}</span>
      <span className="pill-chip" aria-hidden="true">
        {icon ?? <IconArrow size={15} />}
      </span>
    </>
  );

  if (to) {
    return (
      <a
        href={to}
        className={cls}
        aria-label={ariaLabel}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
          e.preventDefault();
          onClick?.();
          navigate(to);
        }}
      >
        {inner}
      </a>
    );
  }
  if (href) {
    const external = newTab ?? /^https?:/.test(href);
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        onClick={onClick}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

/** Stacks full-width on phones, one non-wrapping row from tablet up. */
export function PillRow({
  children,
  className = "",
  align = "start",
}: {
  children: ReactNode;
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={`pill-row ${align === "center" ? "pill-row-center" : ""} ${className}`}>
      {children}
    </div>
  );
}

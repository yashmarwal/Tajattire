/** Small inline icon set — no icon library download. All 24×24, currentColor. */
type P = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  className,
  "aria-hidden": true as const,
  focusable: "false" as const,
});

export const IconWhatsApp = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} fill="currentColor">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35z" />
    <path d="M12 0C5.37 0 0 5.37 0 12c0 2.14.56 4.14 1.54 5.87L0 24l6.3-1.65A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 21.82a9.79 9.79 0 01-5-1.37l-.36-.21-3.72.97 1-3.63-.24-.37A9.78 9.78 0 012.18 12C2.18 6.57 6.57 2.18 12 2.18S21.82 6.57 21.82 12 17.43 21.82 12 21.82z" />
  </svg>
);

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconPhone = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} {...stroke}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const IconMail = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} {...stroke}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

export const IconArrow = ({ size = 16, className }: P) => (
  <svg {...base(size, className)} {...stroke} strokeWidth={1.8}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconChevron = ({
  size = 16,
  className,
  dir = "right",
}: P & { dir?: "left" | "right" }) => (
  <svg
    {...base(size, className)}
    {...stroke}
    strokeWidth={1.8}
    style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconGrid = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} {...stroke}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconDownload = ({ size = 16, className }: P) => (
  <svg {...base(size, className)} {...stroke}>
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
  </svg>
);

export const IconClose = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} {...stroke} strokeWidth={1.8}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const IconEnquire = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} {...stroke}>
    <path d="M4 5h16v11H8l-4 4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </svg>
);

export const IconInstagram = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} {...stroke}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPlay = ({ size = 18, className }: P) => (
  <svg {...base(size, className)} fill="currentColor">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

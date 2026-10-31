import { usePageTransition } from "@/lib/PageTransitionContext";
import { useCategories } from "@/lib/catalog";
import {
  waLink,
  telLink,
  mailLink,
  PHONE_DISPLAY,
  EMAIL,
  INSTAGRAM_URL,
  GSTIN,
  CITY,
  DEV_CREDIT,
  FOUNDED_YEAR,
} from "@/lib/contact";
import { IconWhatsApp, IconInstagram, IconMail, IconPhone } from "./icons";

export function Footer() {
  const navigate = usePageTransition();
  const categories = useCategories();
  const link = (href: string, label: string) => (
    <li key={href}>
      <a
        href={href}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          navigate(href);
        }}
        className="text-cloud/65 [@media(hover:hover)]:hover:text-[var(--gold)] transition-colors"
      >
        {label}
      </a>
    </li>
  );
  const credit = DEV_CREDIT.text && DEV_CREDIT.whatsapp;

  return (
    <footer data-bg="dark" className="site-footer relative bg-deep-black pt-20 md:pt-24 text-sm">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <a
              href="/"
              onClick={(e) => (e.preventDefault(), navigate("/"))}
              className="inline-flex items-center gap-3"
              aria-label="TajAttire — home"
            >
              <img
                src="/images/logo-mark-96.webp"
                alt=""
                width={42}
                height={48}
                loading="lazy"
                className="h-12 w-auto"
              />
              <span className="font-display text-cloud text-3xl tracking-wide">TajAttire</span>
            </a>
            <p className="mt-5 text-cloud/60 leading-relaxed max-w-xs">
              Wholesale kurtis, gowns and contemporary tops, made in Jaipur since {FOUNDED_YEAR} for
              retailers across India.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TajAttire on Instagram"
                className="w-11 h-11 rounded-full border border-white/15 grid place-items-center text-[var(--gold)] [@media(hover:hover)]:hover:bg-white/5"
              >
                <IconInstagram size={18} />
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TajAttire on WhatsApp"
                className="w-11 h-11 rounded-full border border-white/15 grid place-items-center text-[#25D366] [@media(hover:hover)]:hover:bg-white/5"
              >
                <IconWhatsApp size={18} />
              </a>
            </div>
          </div>

          <nav aria-label="Shop">
            <h2 className="font-body text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">
              Shop
            </h2>
            <ul className="space-y-2.5">
              {link("/catalogue", "Full catalogue")}
              {categories.map((c) => link(`/catalogue/${c.slug}`, c.name))}
              {link("/custom-orders", "Custom & private label")}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="font-body text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">
              Company
            </h2>
            <ul className="space-y-2.5">
              {link("/craft", "Our craft")}
              {link("/reviews", "Reviews")}
              {link("/faq", "FAQ")}
              {link("/contact", "Contact")}
              {link("/terms", "Terms of trade")}
              {link("/privacy", "Privacy policy")}
            </ul>
          </nav>

          <div>
            <h2 className="font-body text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">
              Contact
            </h2>
            <ul className="space-y-3 text-cloud/70">
              <li>
                <a
                  href={telLink}
                  className="inline-flex items-center gap-2.5 [@media(hover:hover)]:hover:text-[var(--gold)]"
                >
                  <IconPhone size={15} /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 [@media(hover:hover)]:hover:text-[var(--gold)]"
                >
                  <IconWhatsApp size={15} /> WhatsApp {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={mailLink()}
                  className="inline-flex items-center gap-2.5 [@media(hover:hover)]:hover:text-[var(--gold)]"
                >
                  <IconMail size={15} /> {EMAIL}
                </a>
              </li>
              <li className="text-cloud/50">{CITY}</li>
              <li className="text-cloud/50">Mon–Sat · replies within 2 business hours</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16" />
        <div className="py-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-2 text-[12px] text-cloud/45">
          <span>© {new Date().getFullYear()} TajAttire. All rights reserved.</span>
          <span>GSTIN {GSTIN}</span>
          {credit && (
            <a
              href={`https://wa.me/${DEV_CREDIT.whatsapp}${DEV_CREDIT.message ? `?text=${encodeURIComponent(DEV_CREDIT.message)}` : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="[@media(hover:hover)]:hover:text-[var(--gold)]"
            >
              {DEV_CREDIT.text}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

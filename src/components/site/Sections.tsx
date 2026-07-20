import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MagneticButton, SplitHeading, FadeLines, CurtainImage, CountUp, Parallax } from "./Primitives";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { useCatalogueItems, useTestimonials, useFaqItems, useStats, useInstagramImages, useSustainabilityCards, useSettings } from "@/hooks/useSiteData";
import { useImg } from "@/hooks/useImg";
import { useBackToClose } from "@/hooks/useBackToClose";
import { parseWorkspaceMedia } from "@/lib/siteData";

/* ─────────── SECTION BLEND (soft color bridge between hard bg jumps) ─────────── */
const BLEND_COLORS = {
  black: "#0A0A0A",
  cloud: "#F8F6F1",
  emerald: "#1A5C38",
} as const;

export function SectionBlend({ from, to }: { from: keyof typeof BLEND_COLORS; to: keyof typeof BLEND_COLORS }) {
  return (
    <div
      aria-hidden
      className="relative z-[15] pointer-events-none"
      style={{
        height: "4rem",
        marginTop: "-2rem",
        marginBottom: "-2rem",
        background: `linear-gradient(to bottom, ${BLEND_COLORS[from]}, ${BLEND_COLORS[to]})`,
      }}
    />
  );
}

/* ─────────── HERO ─────────── */
export function Hero() {
  const navigate = usePageTransition();
  const IMG = useImg();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Scatter chars
  const headlineA = "Where Craft".split("");
  const headlineB = "Meets Commerce.".split("");

  const floatingDots = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: `dot-${i}`,
    left: 10 + Math.random() * 80,
    top: 20 + Math.random() * 60,
    size: Math.random() * 2 + 2,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 5,
  })), []);

  return (
    <section ref={ref} id="top" data-bg="dark" className="relative min-h-[100vh] w-full overflow-hidden overflow-x-hidden bg-deep-black grain">
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        {IMG.heroVideo ? (
          <video
            src={IMG.heroVideo}
            autoPlay muted loop playsInline
            className="w-full h-[130%] object-cover opacity-50 origin-center"
          />
        ) : (
          <motion.img
            src={IMG.hero}
            alt=""
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="w-full h-[130%] object-cover opacity-50 origin-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/50 to-[#0A0A0A]" />
      </motion.div>

      {/* Ambient Floating Dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {floatingDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-[#C9A84C]"
            style={{ left: `${dot.left}%`, top: `${dot.top}%`, width: dot.size, height: dot.size }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, -5, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: dot.duration,
              delay: dot.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hairline draw */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.5, duration: 1.4, ease: "easeInOut" }}
        style={{ transformOrigin: "left" }}
        className="absolute top-32 left-12 right-12 h-px bg-[var(--gold)]"
      />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-12 pt-44 pb-32">
        <h1 className="font-display text-cloud leading-[0.95] tracking-[-0.02em]">
          <span className="block max-w-full overflow-hidden text-[9vw] font-light">
            {headlineA.map((c, i) => (
              <motion.span
                key={`a${i}`}
                initial={{ opacity: 0, x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, rotate: (Math.random() - 0.5) * 60 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ delay: 2.7 + i * 0.06, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
                style={{ whiteSpace: "pre" }}
              >{c}</motion.span>
            ))}
          </span>
          <span className="block max-w-full overflow-hidden text-[9vw] font-bold">
            {headlineB.map((c, i) => (
              <motion.span
                key={`b${i}`}
                initial={{ opacity: 0, x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, rotate: (Math.random() - 0.5) * 60 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ delay: 3.2 + i * 0.06, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className={`inline-block ${i >= 6 ? "text-[var(--gold)] italic font-light" : ""}`}
                style={{ whiteSpace: "pre" }}
              >{c}</motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 1 }}
          className="mt-10 max-w-xl text-cloud/70 text-base leading-relaxed font-body"
        >
          India's most trusted wholesale partner for kurtis, gowns & contemporary tops. Every thread, a promise. Every piece, a bestseller.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.3, duration: 1 }}
          className="mt-10 flex flex-wrap gap-5"
        >
          <MagneticButton href="/#collections" onClick={() => navigate("/#collections")} variant="gold" cursorLabel="Explore">
            Explore Collections <span>→</span>
          </MagneticButton>
          <MagneticButton href="https://wa.me/917976667197" variant="outline" cursorLabel="Order">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
            WhatsApp to Order
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Vertical text */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5, duration: 1 }}
        className="absolute left-6 bottom-32 text-[10px] tracking-[0.4em] text-[var(--gold)]/70 font-body"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        EST. 2004 · JAIPUR, INDIA
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }}
        className="absolute right-8 bottom-16 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.3em] text-[var(--gold)]/60 font-body">SCROLL</span>
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="w-px h-16 bg-[var(--gold)]"
        />
      </motion.div>
    </section>
  );
}

/* ─────────── BOLD ROTATING MARQUEE ─────────── */

function RotatingBox({ texts, isFilled, interval, minW }: { texts: string[]; isFilled: boolean; interval: number; minW: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, texts.length]);

  return (
    <motion.div 
      layout
      style={{ minWidth: minW }}
      className={`relative flex items-center justify-center rounded-full px-3 md:px-7 h-[30px] md:h-[48px] overflow-hidden flex-shrink-0 ${
        isFilled 
          ? "bg-[var(--gold)] text-[#0A0A0A]" 
          : "border border-[var(--gold)] text-[var(--gold)] bg-transparent"
      }`}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0, position: "absolute" }}
          animate={{ y: 0, opacity: 1, position: "relative", transition: { duration: 0.6, ease: "easeOut" } }}
          exit={{ y: -20, opacity: 0, position: "absolute", transition: { duration: 0.6, ease: "easeIn" } }}
          className={`whitespace-nowrap text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.15em] font-body ${isFilled ? "font-bold" : "font-medium"}`}
        >
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function Marquee() {
  const boxesData = [
    { texts: ["500+ Designs", "Kurtis", "Gowns and Tops", "New Arrivals"], filled: true, delay: 3000, minW: 180 },
    { texts: ["MOQ 100 Pieces", "Bulk Orders", "Custom Made", "Private Label"], filled: false, delay: 3200, minW: 160 },
    { texts: ["Starting ₹180", "Best Margins", "Wholesale Price", "Trade Only"], filled: true, delay: 3400, minW: 180 },
    { texts: ["Pan India Delivery", "20+ States", "Fast Dispatch", "On Time"], filled: false, delay: 3600, minW: 160 },
  ];

  const mobileBoxesData = [
    { texts: ["500+ Designs", "Kurtis", "Gowns and Tops"], filled: true, delay: 3000, minW: 115 },
    { texts: ["MOQ 100 Pieces", "Bulk Orders", "Custom Made"], filled: false, delay: 3200, minW: 115 },
    { texts: ["Starting 180 rupees", "Pan India Delivery", "Fast Dispatch"], filled: true, delay: 3400, minW: 115 },
  ];

  return (
    <section data-bg="dark" className="w-full bg-[#0A0A0A] border-y border-[var(--gold)]/40 py-[10px] md:py-[12px] relative z-20 flex justify-center overflow-hidden">
      {/* DESKTOP */}
      <div className="hidden md:flex justify-evenly items-center w-full min-w-full px-4 overflow-hidden">
        {boxesData.map((box, i) => (
          <RotatingBox key={`desktop-${i}`} texts={box.texts} isFilled={box.filled} interval={box.delay} minW={box.minW} />
        ))}
      </div>
      
      {/* MOBILE */}
      <div className="flex md:hidden justify-evenly items-center w-full px-1 overflow-x-auto scrollbar-hide">
        {mobileBoxesData.map((box, i) => (
          <RotatingBox key={`mobile-${i}`} texts={box.texts} isFilled={box.filled} interval={box.delay} minW={box.minW} />
        ))}
      </div>
    </section>
  );
}

/* ─────────── BRAND STATEMENT ─────────── */
export function Statement() {
  const words = `"We don't just make clothes. We build the inventory that builds your business."`.split(" ");
  return (
    <section data-bg="dark" className="relative bg-deep-black grain py-40 overflow-hidden">
      {/* Taj watermark */}
      <svg viewBox="0 0 200 120" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] opacity-[0.03]">
        <path d="M100 10 L60 50 L60 100 L140 100 L140 50 Z M100 10 L100 100 M80 40 L120 40 M70 70 L130 70" stroke="white" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.blockquote 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
          className="font-display italic leading-[1.1] tracking-tight text-[clamp(1.5rem,5vw,3.5rem)] flex flex-wrap justify-center gap-[0.2em]"
        >
          {words.map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
            const isHighlight = ["clothes", "inventory", "business"].includes(cleanWord);
            return (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                variants={{
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    color: isHighlight ? ["var(--gold)", "#C9A84C", "var(--gold)"] : "var(--gold)",
                    textShadow: isHighlight ? ["0 0 0px transparent", "0 0 20px rgba(201,168,76,0.8)", "0 0 0px transparent"] : "0 0 0px transparent",
                    transition: {
                      opacity: { duration: 0.6, delay: i * 0.05 },
                      y: { duration: 0.6, ease: "easeOut", delay: i * 0.05 },
                      color: isHighlight ? { duration: 0.6, delay: 0.8 + (["clothes", "inventory", "business"].indexOf(cleanWord) * 0.4) } : {},
                      textShadow: isHighlight ? { duration: 0.6, delay: 0.8 + (["clothes", "inventory", "business"].indexOf(cleanWord) * 0.4) } : {}
                    }
                  }
                }}
                className="text-[var(--gold)]"
              >
                {word}
              </motion.span>
            );
          })}
        </motion.blockquote>
        <div className="hairline mt-16 mx-auto w-32" />
        <p className="mt-6 text-cloud/50 text-xs tracking-[0.3em] uppercase">— TajAttire, crafting wholesale fashion since 2004</p>
      </div>
    </section>
  );
}

/* ─────────── COLLECTIONS → CUSTOM SHOWCASE ─────────── */

const COLLECTION_STATS = [
  { label: "Kurtis", n: "180+" },
  { label: "Gowns", n: "80+" },
  { label: "Tops", n: "120+" },
  { label: "Private Label", n: "Custom" },
];

const MARQUEE_WORDS = ["KURTIS", "GOWNS", "TOPS", "PRIVATE LABEL", "CUSTOM PRINTS", "BULK EMBROIDERY", "FABRIC SELECTION"];

export function Collections() {
  const navigate = usePageTransition();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="collections" ref={ref} data-bg="dark" className="relative bg-deep-black grain py-28 md:py-40 overflow-hidden">
      {/* Ambient floating glow */}
      <motion.div style={{ y: orbY1 }} className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[var(--gold)]/10 blur-[100px]" />
      <motion.div style={{ y: orbY2 }} className="pointer-events-none absolute -bottom-32 -right-16 w-[420px] h-[420px] rounded-full bg-[var(--emerald-deep)]/40 blur-[110px]" />

      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">01 — Custom Collections</span>
          <span className="hidden md:block text-xs uppercase tracking-[0.3em] text-[var(--gold)]/50">Est. 2004 · Jaipur</span>
        </div>

        <div className="text-center mb-14">
          <SplitHeading text="Your Vision." as="h2" className="font-display text-cloud font-light text-[clamp(2.2rem,8vw,5.5rem)] leading-[1.05]" />
          <SplitHeading text="Our Craftsmanship." delay={0.15} as="h2" className="font-display italic text-[var(--gold)] font-bold text-[clamp(2.2rem,8vw,5.5rem)] leading-[1.05]" />
        </div>

        {/* Infinite marquee strip */}
        <div className="marquee-wrap relative mb-16 overflow-hidden border-y border-[var(--gold)]/15 py-5">
          <div className="marquee-left flex w-max gap-10 whitespace-nowrap">
            {[0, 1].map(r => (
              <div key={r} className="flex gap-10 flex-shrink-0">
                {MARQUEE_WORDS.map(w => (
                  <span key={w} className="text-[clamp(1.3rem,4vw,2.4rem)] font-display italic text-cloud/15">{w}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Central custom-collection showcase card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto bg-[var(--emerald-deep)] grain border border-[var(--gold)]/25 rounded-2xl px-8 py-14 md:px-16 md:py-20 text-center overflow-hidden shimmer-sweep"
        >
          {/* Rotating gold rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full border border-dashed border-[var(--gold)]/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
            className="pointer-events-none absolute -bottom-28 -left-28 w-72 h-72 rounded-full border border-dashed border-[var(--gold)]/10"
          />

          <span className="relative inline-block text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-5">Build Something Yours</span>
          <h3 className="relative font-display text-cloud font-light text-[clamp(1.8rem,5vw,3.5rem)] leading-tight mb-6">
            Want a collection <span className="italic text-[var(--gold)] font-bold">nobody else has?</span>
          </h3>
          <p className="relative text-cloud/70 max-w-xl mx-auto mb-10 leading-relaxed">
            From fabric selection to final stitch — if you can imagine it, we can manufacture it. Share your reference and we'll build your private-label collection from scratch.
          </p>

          {/* Stat chips — fixed in place, gold highlight cycles through them one by one */}
          <div className="relative flex flex-wrap justify-center gap-4 mb-10">
            {COLLECTION_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                animate={{
                  borderColor: ["rgba(201,168,76,0.3)", "rgba(201,168,76,1)", "rgba(201,168,76,0.3)"],
                  backgroundColor: ["rgba(255,255,255,0.05)", "rgba(201,168,76,0.18)", "rgba(255,255,255,0.05)"],
                  boxShadow: ["0 0 0px rgba(201,168,76,0)", "0 0 20px rgba(201,168,76,0.45)", "0 0 0px rgba(201,168,76,0)"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: COLLECTION_STATS.length - 0.8,
                  delay: i,
                  ease: "easeInOut",
                }}
                className="px-4 py-2.5 rounded-full border text-cloud/90 text-xs uppercase tracking-wider"
              >
                <b className="text-[var(--gold)] mr-1.5">{s.n}</b>{s.label}
              </motion.div>
            ))}
          </div>

          <div className="relative">
            <MagneticButton href="/custom-orders" onClick={() => navigate("/custom-orders")} variant="gold" cursorLabel="Start">
              Start Your Custom Collection →
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Catalogue() {
  const [activeTab, setActiveTab] = useState("Kurtis");
  const tabs = ["Kurtis", "Gowns", "Tops"] as const;

  // "View All" full-catalogue overlay
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [viewAllTab, setViewAllTab] = useState<"All" | "Kurtis" | "Gowns" | "Tops">("All");

  // Quick-enquiry modal state
  const [modalItem, setModalItem] = useState<{ label: string; img: string; price: string } | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [qForm, setQForm] = useState({ name: "", whatsapp: "", quantity: "" });
  const [qStatus, setQStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const openModal = (label: string, img: string, price: string) => {
    setModalItem({ label, img, price });
    setShowEnquiryForm(false);
    setQForm({ name: "", whatsapp: "", quantity: "" });
    setQStatus("idle");
  };
  const closeModal = () => setModalItem(null);

  // Structured, product-specific message reused across WhatsApp and Email
  const buildEnquiryMessage = (label: string, price: string) =>
    `Hi TajAttire! I'm interested in a wholesale enquiry for:\n\nProduct: ${label}\nPrice: ${price}\n\nCould you please share availability, MOQ, and pricing details? Thank you!`;

  // Fire-and-forget lead log so admin can see which channel a visitor used, per product
  const logChannelClick = (channel: string, label: string) => {
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.from("enquiry_submissions").insert({
        name: "", email: "", phone: "", city: "",
        message: `Clicked ${channel} enquiry for: ${label}`,
        product: label,
      }).then(() => {}).catch(() => {});
    });
  };

  // Back button (Android/browser) closes these overlays instead of leaving the site
  useBackToClose(!!modalItem, closeModal);
  useBackToClose(viewAllOpen, () => setViewAllOpen(false));

  const submitQuickEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setQStatus("loading");
    try {
      // Non-blocking Supabase save
      import("@/lib/supabase").then(({ supabase }) => {
        supabase.from("enquiry_submissions").insert({
          name: qForm.name,
          email: "",
          phone: qForm.whatsapp,
          city: "",
          message: `Quick enquiry for: ${modalItem?.label} | Qty: ${qForm.quantity}`,
          product: modalItem?.label ?? null,
        }).then(() => {}).catch(() => {});
      });

      const fd = new FormData();
      fd.append("access_key", "eac902e8-cb07-44ff-b8d0-6fb0785f6ba0");
      fd.append("subject", `Quick Enquiry — ${modalItem?.label} | TajAttire`);
      fd.append("from_name", "TajAttire Quick Enquiry");
      fd.append("name", qForm.name);
      fd.append("email", "info@tajattire.in");
      fd.append("message",
        `━━━ QUICK PRODUCT ENQUIRY ━━━\n\n` +
        `🛍  Product:   ${modalItem?.label}\n` +
        `👤 Name:      ${qForm.name}\n` +
        `📱 WhatsApp:  ${qForm.whatsapp}\n` +
        `📦 Quantity:  ${qForm.quantity || "Not specified"}\n\n` +
        `━━━ Sent via TajAttire Website ━━━`
      );
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json as Record<string, unknown>).success !== false) setQStatus("success");
      else setQStatus("error");
    } catch { setQStatus("error"); }
  };

  const CATALOGUE_IMGS: Record<string, string[]> = {
    Kurtis: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
      "https://images.unsplash.com/photo-1610189025214-7b6c6c44f6f0?w=600&q=80",
      "https://images.unsplash.com/photo-1617059062265-1ca7b50d6e92?w=600&q=80",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
      "https://images.unsplash.com/photo-1583391733981-8498408cf57f?w=600&q=80",
    ],
    Gowns: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
    ],
    Tops: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
      "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80",
      "https://images.unsplash.com/photo-1551232864-3f0890e1776f?w=600&q=80",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=600&q=80",
    ],
  };

  const generateDefaultItems = (category: string) => {
    const imgs = CATALOGUE_IMGS[category] ?? CATALOGUE_IMGS["Kurtis"];
    return Array.from({ length: 6 }).map((_, i) => ({
      id: `${category}-${i}`,
      img: imgs[i],
      label: `${category.toUpperCase().slice(0, -1)} — ${
        category === "Kurtis" ? (i % 2 === 0 ? "COTTON PRINTED" : "RAYON EMBROIDERED") :
        category === "Gowns" ? (i % 2 === 0 ? "FLOOR LENGTH" : "ANARKALI STYLE") :
        (i % 2 === 0 ? "CONTEMPORARY CUT" : "TUNIC STYLE")
      }`,
      price: "₹180 onwards · MOQ 100 pcs"
    }));
  };

  const { data: dbItems } = useCatalogueItems(activeTab);
  const items = (dbItems && dbItems.length > 0)
    ? dbItems.map(it => ({ id: it.id, img: it.image_url, label: it.label || it.name, price: it.price }))
    : generateDefaultItems(activeTab);

  // Full catalogue (all categories, all active products — including everything added in the admin panel)
  const { data: allDbItems } = useCatalogueItems();
  const allItems = (allDbItems && allDbItems.length > 0)
    ? allDbItems.map(it => ({ id: it.id, img: it.image_url, label: it.label || it.name, price: it.price, category: it.category }))
    : tabs.flatMap(t => generateDefaultItems(t).map(it => ({ ...it, category: t })));
  const viewAllItems = viewAllTab === "All" ? allItems : allItems.filter(it => it.category === viewAllTab);

  // Downloadable catalogue PDFs (admin-uploaded, per category with an "all categories" fallback)
  const { data: siteSettings } = useSettings();
  const catalogueDownloadUrl = (category: string) => {
    const key = `catalogue_pdf_${category.toLowerCase()}`;
    return siteSettings?.[key] || siteSettings?.catalogue_pdf_all || "";
  };

  useEffect(() => {
    if (!viewAllOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [viewAllOpen]);

  const inputCls = "w-full bg-transparent border-b border-[var(--gold)]/30 py-2 text-[13px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-[#C9A84C] transition-colors";

  return (
    <>
      {/* ── Quick-Enquiry Modal ── */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex items-end md:items-center justify-center p-4 md:p-0"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              data-lenis-prevent
              className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#F8F6F1] rounded-t-2xl md:rounded-2xl shadow-2xl"
            >
              {/* Gold top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent sticky top-0 z-10" />

              {/* Product image */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-charcoal/5">
                <img src={modalItem.img} alt={modalItem.label} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F8F6F1] to-transparent pointer-events-none" />
                <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center text-xs hover:bg-black/70 transition-colors">✕</button>
              </div>

              <div className="px-6 pb-6">
                <div className="text-[9px] uppercase tracking-[0.3em] text-[#C9A84C] mb-1">— Quick Enquiry</div>
                <h3 className="font-display text-charcoal text-xl mb-1 leading-tight">{modalItem.label}</h3>
                <p className="text-charcoal/50 text-xs mb-5">{modalItem.price}</p>

                {qStatus === "success" ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-3 text-[#C9A84C]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <p className="text-charcoal font-medium mb-1">Enquiry Sent!</p>
                    <p className="text-charcoal/60 text-xs">We'll WhatsApp you within 2 hours.</p>
                    <button onClick={closeModal} className="mt-4 text-xs text-[#C9A84C] underline">Close</button>
                  </div>
                ) : !showEnquiryForm ? (
                  <div className="flex flex-col gap-3">
                    <a
                      href="tel:+917976667197"
                      onClick={() => logChannelClick("Call", modalItem.label)}
                      className="flex items-center gap-4 w-full bg-[#1A5C38] text-white py-3.5 px-5 rounded-xl hover:bg-[#164a2d] transition-colors"
                    >
                      <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </span>
                      <span className="text-left">
                        <span className="block text-sm font-semibold">Call Us Now</span>
                        <span className="block text-[11px] text-white/60">+91 79766 67197 · Instant</span>
                      </span>
                    </a>

                    <a
                      href={`https://wa.me/917976667197?text=${encodeURIComponent(buildEnquiryMessage(modalItem.label, modalItem.price))}`}
                      target="_blank" rel="noreferrer"
                      onClick={() => logChannelClick("WhatsApp", modalItem.label)}
                      className="flex items-center gap-4 w-full bg-[#25D366] text-white py-3.5 px-5 rounded-xl hover:bg-[#1fbd5a] transition-colors"
                    >
                      <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.874L0 24l6.304-1.653A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.001-1.371l-.36-.214-3.722.976.995-3.63-.234-.373A9.778 9.778 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/></svg>
                      </span>
                      <span className="text-left">
                        <span className="block text-sm font-semibold">WhatsApp</span>
                        <span className="block text-[11px] text-white/75">Pre-filled message, ready to send</span>
                      </span>
                    </a>

                    <a
                      href={`mailto:info@tajattire.in?subject=${encodeURIComponent(`Wholesale Enquiry — ${modalItem.label}`)}&body=${encodeURIComponent(buildEnquiryMessage(modalItem.label, modalItem.price))}`}
                      onClick={() => logChannelClick("Email", modalItem.label)}
                      className="flex items-center gap-4 w-full border-2 border-[#C9A84C] text-charcoal py-3.5 px-5 rounded-xl hover:bg-[#C9A84C]/10 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-full bg-[#C9A84C]/15 flex items-center justify-center flex-shrink-0">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" opacity="0"/><path d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                      </span>
                      <span className="text-left">
                        <span className="block text-sm font-semibold">Email</span>
                        <span className="block text-[11px] text-charcoal/50">info@tajattire.in</span>
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowEnquiryForm(true)}
                      className="text-center text-[11px] text-charcoal/40 underline underline-offset-2 mt-1"
                    >
                      Prefer to fill a quick form instead?
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitQuickEnquiry} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">Your Name</label>
                      <input required value={qForm.name} onChange={e => setQForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">WhatsApp Number</label>
                      <input required type="tel" value={qForm.whatsapp} onChange={e => setQForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+91 99999 99999" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">Quantity Needed</label>
                      <input value={qForm.quantity} onChange={e => setQForm(f => ({ ...f, quantity: e.target.value }))} placeholder="e.g. 100 pieces" className={inputCls} />
                    </div>
                    {qStatus === "error" && <p className="text-red-500 text-xs">Something went wrong. Please try WhatsApp.</p>}
                    <button
                      type="submit"
                      disabled={qStatus === "loading"}
                      className="w-full bg-[#1A5C38] text-white py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-60 mt-1"
                    >
                      {qStatus === "loading" ? "Sending…" : "Send Enquiry →"}
                    </button>
                    <button type="button" onClick={() => setShowEnquiryForm(false)} className="text-center text-[11px] text-charcoal/40 underline underline-offset-2">
                      ← Back to call / WhatsApp / email
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Catalogue Grid ── */}
      <section id="catalogue" data-bg="light" className="relative bg-cloud grain py-32 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-6">— Our Catalogue</span>
            <SplitHeading text="Every Design. Ready to Ship." as="h2" className="font-display text-charcoal text-[2rem] leading-tight md:text-7xl font-light mb-6" />
            <p className="text-charcoal/60 max-w-xl font-body leading-relaxed">
              Browse a snapshot of our current catalogue. 500+ designs available — request the full lookbook via WhatsApp.
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-16">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] transition-colors border ${
                  activeTab === tab
                    ? "bg-[var(--gold)] border-[var(--gold)] text-deep-black"
                    : "border-charcoal text-charcoal hover:bg-charcoal/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10"
            >
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => openModal(item.label, item.img, item.price)}
                  className="group relative bg-white rounded-lg shadow-sm border border-charcoal/5 overflow-hidden flex flex-col cursor-pointer card-lift"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-[var(--gold)] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 hidden md:block" />
                    <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[var(--gold)] text-xs tracking-widest uppercase bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg font-semibold">
                        Enquire →
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-grow bg-white relative z-10">
                    <div className="h-px w-full bg-[var(--gold)]/30 mb-4" />
                    <h4 className="text-[10px] md:text-xs font-semibold tracking-wider text-charcoal mb-2">{item.label}</h4>
                    <p className="text-[10px] md:text-xs text-charcoal/50 mb-3">{item.price}</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); openModal(item.label, item.img, item.price); }}
                      className="mt-auto w-full py-2.5 text-[10px] md:text-[11px] tracking-widest uppercase font-semibold text-[var(--gold)] border border-[var(--gold)]/40 rounded-full hover:bg-[var(--gold)] hover:text-deep-black transition-colors duration-200"
                    >
                      Enquire →
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-20 flex flex-col items-center gap-5">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => { setViewAllTab("All"); setViewAllOpen(true); }}
                className="px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors duration-300"
              >
                View All Products
              </button>
              {catalogueDownloadUrl(activeTab) && (
                <a
                  href={catalogueDownloadUrl(activeTab)}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold bg-[var(--gold)] text-deep-black hover:bg-[#D4B55A] transition-colors duration-300 inline-flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
                  Download {activeTab} Catalogue
                </a>
              )}
            </div>
            <p className="text-sm text-charcoal/70">Want to see the full catalogue?</p>
            <MagneticButton href="https://wa.me/917976667197" variant="wa" cursorLabel="WhatsApp">
              Request Full Lookbook on WhatsApp
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── View All Products Overlay ── */}
      <AnimatePresence>
        {viewAllOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9500] flex flex-col bg-cloud"
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-charcoal/10 bg-cloud/95 backdrop-blur-sm">
              <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">— Full Catalogue</span>
                  <h3 className="font-display text-charcoal text-xl md:text-2xl leading-tight">All Products</h3>
                </div>
                <button
                  onClick={() => setViewAllOpen(false)}
                  className="w-9 h-9 rounded-full border border-charcoal/20 text-charcoal flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pb-5 flex flex-wrap items-center gap-2.5">
                {(["All", ...tabs] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setViewAllTab(t)}
                    className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] transition-colors border ${
                      viewAllTab === t
                        ? "bg-[var(--gold)] border-[var(--gold)] text-deep-black"
                        : "border-charcoal/30 text-charcoal hover:bg-charcoal/5"
                    }`}
                  >
                    {t} {t !== "All" ? `(${allItems.filter(it => it.category === t).length})` : `(${allItems.length})`}
                  </button>
                ))}
                {catalogueDownloadUrl(viewAllTab) && (
                  <a
                    href={catalogueDownloadUrl(viewAllTab)}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="ml-auto px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-semibold border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
                    Download PDF
                  </a>
                )}
              </div>
            </div>

            {/* Scrollable grid */}
            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-10">
                {viewAllItems.length === 0 ? (
                  <p className="text-center text-charcoal/50 py-20">No products in this category yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {viewAllItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => { openModal(item.label, item.img, item.price); }}
                        className="group relative bg-white rounded-lg shadow-sm border border-charcoal/5 overflow-hidden flex flex-col cursor-pointer card-lift"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                          <img src={item.img} alt={item.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]" />
                          <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-[var(--gold)] text-[11px] tracking-widest uppercase bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg font-semibold">
                              Enquire →
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow bg-white relative z-10">
                          <div className="h-px w-full bg-[var(--gold)]/30 mb-3" />
                          <h4 className="text-[10px] md:text-xs font-semibold tracking-wider text-charcoal mb-1.5">{item.label}</h4>
                          <p className="text-[10px] md:text-xs text-charcoal/50 mb-2.5">{item.price}</p>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); openModal(item.label, item.img, item.price); }}
                            className="mt-auto w-full py-2 text-[10px] tracking-widest uppercase font-semibold text-[var(--gold)] border border-[var(--gold)]/40 rounded-full hover:bg-[var(--gold)] hover:text-deep-black transition-colors duration-200"
                          >
                            Enquire →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


export function CustomOrder() {
  return (
    <section data-bg="dark" className="relative bg-[#1A5C38] grain py-32 overflow-hidden border-t border-[var(--gold)]/20">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 3 * 0.15 }}
          className="text-center max-w-2xl flex flex-col items-center w-full mx-auto"
        >
          <h3 className="font-display text-cloud text-[2rem] leading-tight md:text-7xl mb-6 md:mb-8">
            <span className="block font-light">Can't find</span>
            <span className="block font-light">your style?</span>
            <span className="block font-bold italic text-[var(--gold)] mt-2">We do custom.</span>
          </h3>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            {["Custom Prints", "Fabric Selection", "Bulk Embroidery", "Private Label"].map(pill => (
              <span key={pill} className="px-3 md:px-4 py-1.5 rounded-full border border-cloud/30 text-cloud/90 text-[10px] md:text-xs uppercase tracking-wider bg-white/5">
                {pill}
              </span>
            ))}
          </div>
          
          <p className="text-cloud/70 mb-8 md:mb-10 max-w-md mx-auto leading-relaxed text-sm md:text-base">
            From fabric selection to final stitch — if you can imagine it, we can manufacture it. Share your reference and we'll build it from scratch.
          </p>
          
          <div className="flex flex-col gap-3 w-full md:w-auto min-w-[260px]">
            <MagneticButton href="https://wa.me/917976667197" variant="gold" cursorLabel="Chat">Discuss Custom Order</MagneticButton>
            <MagneticButton href="mailto:info@tajattire.in" variant="outline" cursorLabel="Email">Send Reference Images</MagneticButton>
          </div>
          
          <p className="mt-8 md:mt-10 text-[var(--gold)]/50 text-[10px] md:text-xs tracking-widest uppercase">
            Minimum 100 pieces apply for custom orders
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── CRAFT (light) ─────────── */
export function Craft() {
  const IMG = useImg();
  return (
    <section id="craft" data-bg="light" className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
        <CurtainImage src={IMG.craft} alt="The craft" className="aspect-[3/4] w-full" />
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -m-10 p-10"><div className="outline-num text-[clamp(6rem,20vw,18rem)] absolute -top-20 -left-4 md:-left-10 select-none max-w-full overflow-hidden">01</div></div>
          <div className="relative">
            <SplitHeading text="Not Just Fabric." as="h2" className="block font-display text-emerald text-[2rem] leading-tight md:text-7xl font-light" />
            <SplitHeading text="A Philosophy." delay={0.3} as="h2" className="block font-display text-emerald italic text-[2rem] leading-tight md:text-7xl font-light" />
            <div className="mt-10 space-y-6">
              <FadeLines
                lines={[
                  "Every kurti that leaves our floor has been checked twice and shipped once.",
                  "We work with weavers, not just machines — because your customers can feel the difference.",
                  "From first sample to final shipment, we treat your order like it's our reputation on the line. Because it is.",
                  "This is what Handcrafted Heritage means to us — not a tagline. A standard.",
                ]}
                lineClass="text-charcoal/80 leading-relaxed border-l border-[var(--gold)] pl-6"
              />
            </div>
            <div className="mt-14 hairline" />
            <div className="mt-6 flex flex-wrap gap-4 md:gap-8 text-xs tracking-[0.2em] uppercase text-charcoal/70">
              <span className="whitespace-nowrap"><b className="text-emerald font-display text-lg md:text-xl mr-1">500+</b>Designs</span>
              <span className="whitespace-nowrap"><b className="text-emerald font-display text-lg md:text-xl mr-1">₹180</b>Start</span>
              <span className="whitespace-nowrap"><b className="text-emerald font-display text-lg md:text-xl mr-1">100</b>MOQ</span>
              <span className="whitespace-nowrap"><b className="text-emerald font-display text-lg md:text-xl mr-1">20+</b>States</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── WHY (emerald) ─────────── */
const whys = [
  { n: "01", title: "MOQ That Respects Your Reality", copy: "100 pieces minimum. Not 500. Not 1,000. We know what it takes to start, and we built our model around your actual business — not an ideal version of it.", big: true, badge: "100 pcs" },
  { n: "02", title: "Pricing Built for Profitable Retail", copy: "Wholesale rates from ₹180 per piece. Margins that let you compete, grow, and still sleep at night.", big: true, badge: "₹180" },
  { n: "03", title: "Craft You Can Stake Your Name On", copy: "Double quality-checked before dispatch. Your customers judge you — we make sure you pass.", big: false, badge: "2x checked" },
  { n: "04", title: "Pan-India. On Time. Every Time.", copy: "20+ states. Reliable dispatch windows. Because your restock cycle is a business commitment, not a suggestion.", big: false, badge: "20+ states" },
];

export function Why() {
  return (
    <section data-bg="dark" className="relative bg-[var(--emerald-deep)] grain py-32 overflow-x-clip">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-20 flex-wrap gap-6">
          <SplitHeading
            text="The Partner Your Margins Have Been Waiting For."
            as="h2"
            className="font-display text-cloud font-light max-w-3xl leading-[1.05] text-[clamp(1.8rem,6vw,4.5rem)]"
          />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">02 — Why TajAttire</span>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          <div className="col-span-2 grid gap-6">
            {whys.filter(w => w.big).map((w, i) => (
              <motion.div
                key={`desktop-${w.n}`}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
                style={{ top: `calc(6rem + ${i * 2}rem)` }}
                className="sticky z-10 card-lift border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-10 bg-[#0A2416] shadow-[0_-20px_40px_rgba(0,0,0,0.3)]"
                data-cursor="Read"
              >
                <span className="absolute top-4 right-6 outline-num text-7xl opacity-40">{w.n}</span>
                <motion.div 
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 + i * 0.15 }}
                  className="absolute -top-3 -right-3 border border-[var(--gold)] bg-[#0A2416] text-[var(--gold)] text-[10px] uppercase font-bold py-1.5 px-3 rounded-full"
                >
                  {w.badge}
                </motion.div>
                <h3 className="font-display text-cloud text-3xl md:text-4xl font-light mb-4">{w.title}</h3>
                <p className="text-cloud/70 leading-relaxed max-w-2xl">{w.copy}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-6">
            {whys.filter(w => !w.big).map((w, i) => (
              <motion.div
                key={`desktop-${w.n}`}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.15 }}
                style={{ top: `calc(6rem + ${i * 2}rem)` }}
                className="sticky z-10 card-lift border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-8 bg-[#0A2416] shadow-[0_-20px_40px_rgba(0,0,0,0.3)]"
                data-cursor="Read"
              >
                <span className="absolute top-3 right-5 outline-num text-5xl opacity-40">{w.n}</span>
                <motion.div 
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.9 + i * 0.15 }}
                  className="absolute -top-3 -right-3 border border-[var(--gold)] bg-[#0A2416] text-[var(--gold)] text-[10px] uppercase font-bold py-1.5 px-3 rounded-full"
                >
                  {w.badge}
                </motion.div>
                <h3 className="font-display text-cloud text-2xl font-light mb-3">{w.title}</h3>
                <p className="text-cloud/70 text-sm leading-relaxed">{w.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="grid md:hidden gap-6">
          {whys.map((w, i) => (
            <motion.div
              key={`mobile-${w.n}`}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              style={{ top: `calc(6rem + ${i * 1.5}rem)` }}
              className={`sticky z-10 card-lift border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] ${w.big ? 'p-8' : 'p-6'} bg-[#0A2416] shadow-[0_-15px_30px_rgba(0,0,0,0.4)]`}
              data-cursor="Read"
            >
              <span className={`absolute right-5 outline-num opacity-40 ${w.big ? 'top-4 text-6xl' : 'top-3 text-5xl'}`}>{w.n}</span>
              <h3 className={`font-display text-cloud font-light mb-3 ${w.big ? 'text-2xl' : 'text-xl'}`}>{w.title}</h3>
              <p className="text-cloud/70 text-sm leading-relaxed">{w.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── STATS ─────────── */
export function Stats() {
  const { data: dbStats } = useStats();
  const items = (dbStats && dbStats.length > 0)
    ? dbStats.map(s => ({ v: s.value, prefix: s.prefix || undefined, suffix: s.suffix || undefined, label: s.label }))
    : [
        { v: 500, suffix: "+", label: "Designs Ready to Ship" },
        { v: 180, prefix: "₹", label: "Starting Wholesale Price" },
        { v: 100, label: "Minimum Order Quantity" },
        { v: 20, suffix: "+", label: "States Delivered Across India" },
      ];
  return (
    <section data-bg="light" className="relative bg-cloud grain py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />
      <motion.div
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(201,168,76,0.08) 2px, transparent 2px)",
          backgroundSize: "60px 60px",
          willChange: "transform, opacity",
        }}
      />
      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald">02 — By the Numbers</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center md:text-left min-w-0">
              <CountUp end={it.v} prefix={it.prefix} suffix={it.suffix} className="font-display text-emerald text-[clamp(1.6rem,7.5vw,2.75rem)] md:text-[clamp(2.5rem,6vw,6rem)] font-light leading-none whitespace-nowrap" />
              <div className="hairline my-5 md:w-16" />
              <div className="text-xs uppercase tracking-[0.25em] text-charcoal/70">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── HOW IT WORKS ─────────── */
const steps = [
  { n: "01", title: "Browse the Collection", copy: "Explore 500+ designs across kurtis, gowns and tops. Filter by fabric, occasion, and price. Find what fits your store's identity — not just what's available." },
  { n: "02", title: "Send Your Enquiry", copy: "Drop a WhatsApp, fill the form, or call us directly. Share your quantity, preferred styles, delivery city. We'll have a quote back within hours — not days." },
  { n: "03", title: "Confirm & Receive", copy: "Order confirmed. Production or dispatch begins. Your stock lands at your door, on schedule, quality-checked. You stock your shelf. Your customers come back. Repeat." },
];

export function HowItWorks() {
  return (
    <section data-bg="light" className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald">03 — How It Works</span>
          <SplitHeading text="From First Look to First Shipment." as="h2" className="mt-4 font-display text-emerald text-[2rem] leading-tight md:text-7xl font-light" />
          <p className="mt-6 text-charcoal/70 max-w-xl">Three steps. Zero confusion. Exactly how wholesale should work.</p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-10">
          <svg className="hidden md:block absolute top-20 left-0 right-0 w-full h-1 overflow-visible z-0 pointer-events-none">
            <motion.line x1="16" y1="0" x2="100%" y2="0" stroke="var(--gold)" strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 3.6, ease: [0.76, 0, 0.24, 1] }} />
          </svg>
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
              className="relative pt-8 z-10"
            >
              <div className="absolute top-14 left-0 w-4 h-4 rounded-full bg-cloud border-2 border-[var(--gold)]" />
              <motion.div
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="outline-num text-6xl md:text-8xl mb-6 pl-8"
              >{s.n}</motion.div>
              <h3 className="font-display text-emerald text-3xl font-light mb-4 pl-8">{s.title}</h3>
              <p className="text-charcoal/70 leading-relaxed pl-8">{s.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── TESTIMONIALS ─────────── */
const DEFAULT_TESTIMONIALS = [
  { quote: "TajAttire has been our go-to wholesale partner for over a decade. Consistent quality, designs that always sell, and a team that actually picks up the phone.", name: "Priya Sharma", role: "Boutique Owner · Jaipur" },
  { quote: "The 100-piece MOQ was the reason we started. Today we order 5x that every season. The margins are the best we've seen in this category.", name: "Rajan Mehta", role: "Multi-brand Fashion Retailer · Surat" },
  { quote: "From kurtis to gowns — every collection delivers. Our customers don't just buy these pieces. They ask for them by name.", name: "Neha Kapoor", role: "Fashion Store Owner · Lucknow" },
  { quote: "We've tried four other suppliers. Nobody matches TajAttire on consistency. Reorder rates from our boutique jumped 40% after switching.", name: "Arjun Singhania", role: "Multi-outlet Boutique Chain · Ahmedabad" },
];

export function Testimonials() {
  const { data: dbTestimonials } = useTestimonials();
  const testimonials = (dbTestimonials && dbTestimonials.length > 0)
    ? dbTestimonials.map(t => ({ quote: t.quote, name: t.name, role: t.role }))
    : DEFAULT_TESTIMONIALS;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchStartRef = useRef<number>(0);

  const goNext = () => {
    setDirection(1);
    setCurrent(p => (p + 1) % testimonials.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent(p => (p - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance — resets on manual navigation, pauses while the reader is engaging with it
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent(p => (p + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [current, paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? goNext() : goPrev(); }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: (dir > 0 ? -80 : 80), opacity: 0 }),
  };

  return (
    <section data-bg="dark" className="relative bg-[var(--emerald-deep)] grain py-32 overflow-x-clip">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-16 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">01 — Testimonials</span>
          <SplitHeading text="1,000+ Retailers. One Thing in Common." as="h2" className="mt-4 font-display text-cloud font-light leading-[1.05] text-[clamp(1.8rem,6vw,4.5rem)]" />
        </div>

        <div
          className="relative max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Large decorative quote mark */}
          <div
            className="absolute -top-8 -left-4 font-display leading-none text-[var(--gold)] pointer-events-none select-none"
            style={{ fontSize: "200px", opacity: 0.06 }}
          >&ldquo;</div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              onTouchStart={e => { setPaused(true); onTouchStart(e); }}
              onTouchEnd={e => { setPaused(false); onTouchEnd(e); }}
              className="bg-[#0A2416] border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-10 md:p-14"
              data-cursor="Read"
            >
              <div className="flex gap-1 mb-8 text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, j) => <span key={j}>★</span>)}
              </div>
              <blockquote className="font-display italic text-cloud leading-snug mb-8" style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)" }}>
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              <div className="hairline mb-6 w-16" />
              <div className="text-cloud font-medium text-sm">{testimonials[current].name}</div>
              <div className="text-cloud/60 text-xs tracking-wider uppercase mt-1">{testimonials[current].role}</div>
            </motion.div>
          </AnimatePresence>

          {/* Controls: arrows + dots */}
          <div className="flex items-center gap-6 mt-8">
            <motion.button
              onClick={goPrev}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous testimonial"
              data-cursor="Prev"
              className="w-10 h-10 rounded-full border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2L4 7l5 5"/></svg>
            </motion.button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`rounded-full transition-all duration-400 ${
                    i === current
                      ? "w-6 h-1.5 bg-[var(--gold)]"
                      : "w-1.5 h-1.5 bg-[var(--gold)]/30 hover:bg-[var(--gold)]/60"
                  }`}
                />
              ))}
            </div>
            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next testimonial"
              data-cursor="Next"
              className="w-10 h-10 rounded-full border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2l5 5-5 5"/></svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── CTA BAND ─────────── */
export function CtaBand() {
  const navigate = usePageTransition();
  const IMG = useImg();
  const { data: settings } = useSettings();
  const catalogPdf = settings?.catalogue_pdf_all || "";
  return (
    <section data-bg="dark" className="relative min-h-[80vh] grain shimmer-sweep overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <img src={IMG.cta} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[var(--emerald-deep)]/80" />
      </div>
      <div className="relative max-w-5xl mx-auto px-6 text-center py-24">
        <SplitHeading text="Your next bestseller is already in our catalog." as="h2" className="font-display text-cloud font-light leading-[1.05] text-[clamp(2rem,7vw,4.5rem)]" />
        <p className="mt-8 font-display italic text-[var(--gold)] text-2xl md:text-3xl">The only question is — when do you want to start?</p>
        <div className="mt-12 flex flex-wrap gap-5 justify-center">
          {catalogPdf ? (
            <MagneticButton href={catalogPdf} target="_blank" rel="noreferrer" download variant="gold" cursorLabel="Download">Download Catalog</MagneticButton>
          ) : (
            <MagneticButton href="/contact" onClick={() => navigate("/contact")} variant="gold" cursorLabel="Catalog">Request Catalog</MagneticButton>
          )}
          <MagneticButton href="https://wa.me/917976667197" variant="outline" cursorLabel="Chat">WhatsApp Us Now</MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ─────────── INQUIRY FORM ─────────── */
export function Inquiry() {
  const IMG = useImg();
  const [interests, setInterests] = useState<string[]>([]);
  const toggle = (v: string) => setInterests((p) => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const [formData, setFormData] = useState({ name: "", business: "", city: "", whatsapp: "", quantity: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhoto = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) { alert("Photo must be under 8 MB"); return; }
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = e => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => { setPhoto(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // ① Non-blocking: save to Supabase DB (fire-and-forget, never blocks the form)
      import("@/lib/supabase").then(({ supabase }) => {
        supabase.from("enquiry_submissions").insert({
          name: formData.name,
          email: "",
          phone: formData.whatsapp,
          city: formData.city,
          message: `Business: ${formData.business} | Qty: ${formData.quantity} | Interest: ${interests.join(", ")}`,
          product: interests.join(", ") || null,
        }).then(() => {}).catch(() => {});
      });

      // ② Build multipart form for Web3Forms (attach photo directly — no Supabase upload needed)
      const fd = new FormData();
      fd.append("access_key", "eac902e8-cb07-44ff-b8d0-6fb0785f6ba0");
      fd.append("subject", `New Bulk Enquiry — TajAttire | ${formData.name} | ${formData.city}`);
      fd.append("from_name", "TajAttire Website");
      fd.append("name", formData.name);
      fd.append("email", "info@tajattire.in");
      fd.append("message",
        `━━━ NEW BULK ORDER ENQUIRY ━━━\n\n` +
        `👤 Name:         ${formData.name}\n` +
        `🏪 Business:     ${formData.business}\n` +
        `📍 City / State: ${formData.city}\n` +
        `📱 WhatsApp:     ${formData.whatsapp}\n` +
        `🛍  Interest:     ${interests.length ? interests.join(", ") : "Not specified"}\n` +
        `📦 Quantity:     ${formData.quantity}\n` +
        (photo ? `🖼  Reference photo attached (${photo.name}, ${(photo.size / 1024).toFixed(0)} KB)\n` : "") +
        `\n━━━ Sent via TajAttire Website ━━━`
      );
      // Attach photo directly to email if user provided one
      if (photo) fd.append("attachment", photo, photo.name);

      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));

      if (res.ok && (json as Record<string, unknown>).success !== false) {
        setStatus("success");
      } else {
        console.warn("Web3Forms response:", json);
        setStatus("error");
      }
    } catch (err) {
      console.error("Enquiry submit error:", err);
      setStatus("error");
    }
  };


  const resetForm = () => {
    setFormData({ name: "", business: "", city: "", whatsapp: "", quantity: "" });
    setInterests([]);
    setStatus("idle");
    removePhoto();
  };

  return (
    <section id="order" data-bg="light" className="relative bg-[#F8F6F1] flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/2 relative min-h-[500px] md:min-h-screen bg-[#1A5C38] flex items-center justify-center">
        <img src={IMG.form} alt="Indian Fashion Editorial" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1A5C38]/60" />
        <div className="relative text-center px-8 flex flex-col items-center">
          <p className="font-display italic text-white text-4xl md:text-5xl leading-tight max-w-lg">
            "Your customers deserve better. So do your margins."
          </p>
          <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
            TAJATTIRE · JAIPUR
          </div>
        </div>
      </div>

      <div className="md:w-1/2 py-24 px-8 md:px-16 flex flex-col justify-center">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--gold)] flex items-center justify-center mb-6 text-[var(--gold)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 className="font-display text-4xl text-charcoal mb-4">We have received your request!</h3>
            <p className="font-body text-charcoal/70 mb-8">Our team will reach out within 2 business hours on WhatsApp.</p>
            <button onClick={resetForm} className="border border-[var(--gold)] text-[var(--gold)] px-6 py-3 text-xs uppercase tracking-widest hover:bg-[var(--gold)] hover:text-white transition-colors">
              Send Another Enquiry
            </button>
          </div>
        ) : (
          <div className="max-w-lg mx-auto w-full">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">— GET IN TOUCH</div>
            <h2 className="font-display text-charcoal text-4xl md:text-5xl mb-3">Ready to Stock Smart?</h2>
            <p className="text-charcoal/60 text-sm mb-6">Fill in your details and we will reach out within 2 business hours. No spam, no fluff.</p>
            <div className="h-[1px] w-full bg-[var(--gold)]/30 mb-8" />
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Full Name</label>
                <input required value={formData.name} onChange={handleChange("name")} placeholder="John Doe" className="w-full bg-transparent border-b-[1.5px] border-[var(--gold)]/30 py-2.5 text-[14px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>

              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Business Name</label>
                <input required value={formData.business} onChange={handleChange("business")} placeholder="Store Name" className="w-full bg-transparent border-b-[1.5px] border-[var(--gold)]/30 py-2.5 text-[14px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>

              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">City / State</label>
                <input required value={formData.city} onChange={handleChange("city")} placeholder="Jaipur, Rajasthan" className="w-full bg-transparent border-b-[1.5px] border-[var(--gold)]/30 py-2.5 text-[14px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>

              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">WhatsApp Number</label>
                <input required type="tel" value={formData.whatsapp} onChange={handleChange("whatsapp")} placeholder="+91 99999 99999" className="w-full bg-transparent border-b-[1.5px] border-[var(--gold)]/30 py-2.5 text-[14px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>

              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-3 group-focus-within:text-[#C9A84C] transition-colors">What are you interested in?</label>
                <div className="flex flex-wrap gap-3">
                  {["Kurtis", "Gowns", "Tops"].map((o) => (
                    <button key={o} type="button" onClick={() => toggle(o)} className={`px-5 py-2 text-xs border transition-all ${interests.includes(o) ? "bg-[#C9A84C] text-black border-[#C9A84C]" : "border-[var(--gold)]/30 text-charcoal hover:border-[#C9A84C]"}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Approximate Quantity</label>
                <input required value={formData.quantity} onChange={handleChange("quantity")} placeholder="e.g. 100 pieces" className="w-full bg-transparent border-b-[1.5px] border-[var(--gold)]/30 py-2.5 text-[14px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>

              {/* ── Photo / Reference Upload ── */}
              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-2">
                  Reference Photo <span className="normal-case text-charcoal/40">(optional — design, catalogue, screenshot)</span>
                </label>
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img src={photoPreview} alt="Preview" className="h-28 w-auto rounded object-cover border border-[var(--gold)]/30" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-charcoal text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                    >✕</button>
                    <p className="text-[11px] text-charcoal/50 mt-1">{photo?.name}</p>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handlePhoto(f); }}
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--gold)]/25 rounded py-6 cursor-pointer hover:border-[var(--gold)]/50 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span className="text-[12px] text-charcoal/50">Drop image or <span className="text-[#C9A84C] underline">click to browse</span></span>
                    <span className="text-[10px] text-charcoal/30">PNG · JPG · WEBP · Max 8 MB</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }} />
              </div>

              <div className="pt-4">
                <button disabled={status === "loading"} type="submit" className="w-full bg-[#1A5C38] text-white h-[52px] font-semibold text-[12px] tracking-widest hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-60">
                  {status === "loading" ? "SENDING..." : "SEND ENQUIRY →"}
                </button>
                {status === "error" && (
                  <div className="mt-4 border border-red-500 p-3 text-[12px] text-red-600">
                    Something went wrong. Please email us directly at info@tajattire.in
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */
export function Footer() {
  const IMG = useImg();
  const navigate = usePageTransition();
  const handleFooterClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
  };
  return (
    <footer id="connect" data-bg="dark" className="relative bg-deep-black grain pt-24 pb-8 overflow-hidden">
      <motion.div 
        initial={{ scaleY: 1 }} whileInView={{ scaleY: 0 }} viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "bottom" }}
        className="absolute inset-0 z-50 bg-[#1A5C38]"
      />
      <div className="overflow-hidden border-y border-[var(--gold)]/10 py-3 mb-16">
        <div className="marquee-left whitespace-nowrap flex gap-8 text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]/40" style={{ width: "max-content" }}>
          {Array.from({ length: 20 }).map((_, i) => <span key={i}>TAJATTIRE · HANDCRAFTED HERITAGE ·</span>)}
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <img src={IMG.logo} alt="TajAttire Logo" style={{ height: '48px', width: 'auto', mixBlendMode: 'lighten' }} className="mx-auto mb-4" />
          <h3 className="font-display text-cloud text-5xl tracking-wider">TajAttire</h3>
          <p className="font-display italic text-[var(--gold)] mt-2">Handcrafted Heritage</p>
        </div>

        <div className="hairline mb-12" />

        <div className="grid md:grid-cols-3 gap-12 text-cloud/70">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">About TajAttire</h4>
            <p className="text-sm leading-relaxed">Wholesale fashion partner for India's most ambitious retailers. Kurtis, gowns and tops — designed to sell, priced to scale.</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#collections" onClick={(e) => handleFooterClick(e, "/#collections")} data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Collections</a></li>
              <li><a href="/craft" onClick={(e) => handleFooterClick(e, "/craft")} data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Why Us</a></li>
              <li><a href="/custom-orders" onClick={(e) => handleFooterClick(e, "/custom-orders")} data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Custom Orders</a></li>
              <li><a href="/reviews" onClick={(e) => handleFooterClick(e, "/reviews")} data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Reviews</a></li>
              <li><a href="/faq" onClick={(e) => handleFooterClick(e, "/faq")} data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">FAQ</a></li>
              <li><a href="/contact" onClick={(e) => handleFooterClick(e, "/contact")} data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">How to Order</a></li>
              <li><a href="#connect" onClick={(e) => handleFooterClick(e, "#connect")} data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>WhatsApp: +91 79766 67197</li>
              <li>Email: info@tajattire.in</li>
              <li>Location: Jaipur, India</li>
            </ul>
            <div className="mt-5 flex gap-4">
              <a href="https://www.instagram.com/tajattire" target="_blank" rel="noreferrer" data-cursor="IG" className="text-[var(--gold)] hover:scale-125 transition-transform inline-block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="hairline mt-16 mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-cloud/40">
          <span>© 2025 TajAttire. All rights reserved.</span>
          <span>GST: 08EZDPA6047K1Z9</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── FACTORY VISIT POPUP ─────────── */
export function FactoryVisitPopup() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [formData, setFormData] = useState({
    name: "", businessType: "Retailer", date: "", people: "1", whatsapp: ""
  });

  // Back button (Android/browser) dismisses this popup instead of leaving the site
  useBackToClose(visible, () => setVisible(false));

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let maxScrollY = window.scrollY;
    const handleScroll = () => {
      const sy = window.scrollY;
      if (sy > maxScrollY) maxScrollY = sy;
      if (maxScrollY > 600 && sy < lastScrollY - 20) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
      lastScrollY = sy;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "eac902e8-cb07-44ff-b8d0-6fb0785f6ba0",
          subject: "Factory Visit Request — TajAttire",
          name: formData.name,
          business_type: formData.businessType,
          visit_date: formData.date,
          number_of_people: formData.people,
          whatsapp: formData.whatsapp,
        })
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", businessType: "Retailer", date: "", people: "1", whatsapp: "" });
    setStatus("idle");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed z-[9000] bottom-0 left-0 right-0 md:bottom-[28px] md:right-[28px] md:left-auto md:w-[380px] bg-[#0A0A0A] rounded-t-[16px] md:rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          
          <div className="p-7 relative">
            <button onClick={() => setVisible(false)} className="absolute top-6 right-6 text-[var(--gold)] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <div className="mb-6 pr-8">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] mb-2 font-medium">Limited Slots Available</div>
              <h3 className="font-display text-white text-[24px] mb-2 leading-tight">Visit Our Jaipur Factory</h3>
              <p className="font-body text-white/50 text-[11px]">See 500+ designs in person. Walk-in pricing on bulk orders.</p>
            </div>
            
            <div className="h-[1px] w-full bg-[#C9A84C]/30 mb-6" />

            {status === "success" ? (
              <div className="py-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C] flex items-center justify-center mb-4 text-[#C9A84C]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="font-display text-white text-2xl mb-2">We have received your request!</h3>
                <p className="font-body text-white/70 text-xs mb-6">Our team will reach out within 2 business hours on WhatsApp.</p>
                <button onClick={resetForm} className="border border-[#C9A84C] text-[#C9A84C] px-5 py-2.5 text-[10px] uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors">
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.1em] text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Your Name</label>
                  <input required value={formData.name} onChange={handleChange("name")} className="w-full bg-transparent border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors text-[13px]" />
                </div>
                
                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.1em] text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Business Type</label>
                  <select required value={formData.businessType} onChange={handleChange("businessType")} className="w-full bg-[#0A0A0A] border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none text-[13px]">
                    <option value="Retailer">Retailer</option>
                    <option value="Boutique Owner">Boutique Owner</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Exporter">Exporter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="group w-[60%]">
                    <label className="text-[10px] uppercase tracking-[0.1em] text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Preferred Visit Date</label>
                    <input required type="date" min={new Date().toISOString().split("T")[0]} value={formData.date} onChange={handleChange("date")} className="w-full bg-[#0A0A0A] border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors text-[13px] [color-scheme:dark]" />
                  </div>
                  <div className="group w-[40%]">
                    <label className="text-[10px] uppercase tracking-[0.1em] text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">People</label>
                    <select required value={formData.people} onChange={handleChange("people")} className="w-full bg-[#0A0A0A] border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none text-[13px]">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>
                </div>

                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.1em] text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Your WhatsApp Number</label>
                  <input required type="tel" value={formData.whatsapp} onChange={handleChange("whatsapp")} className="w-full bg-transparent border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors text-[13px]" />
                </div>

                <div className="mt-4">
                  <button disabled={status === "loading"} type="submit" className="w-full bg-[#C9A84C] text-[#0A0A0A] h-[44px] font-semibold text-[11px] tracking-widest hover:bg-white hover:text-[#0A0A0A] transition-colors">
                    {status === "loading" ? "PROCESSING..." : "REQUEST FACTORY VISIT →"}
                  </button>
                  {status === "error" && (
                    <div className="mt-3 border border-red-500 p-2 text-[11px] text-red-500 text-center">
                      Something went wrong. Please email us directly at info@tajattire.in
                    </div>
                  )}
                  <div className="text-center text-[#C9A84C]/40 text-[10px] mt-3 tracking-widest">
                    ✦ We confirm within 2 hours ✦
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────── FLOATING CALL ─────────── */
export function FloatingCall() {
  return (
    <a
      href="tel:+917976667197"
      className="hidden md:flex fixed z-[8000] md:bottom-[98px] md:right-[28px] w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-full bg-[var(--gold)] shadow-[0_4px_20px_rgba(201,168,76,0.5)] items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(201,168,76,0.7)]"
      aria-label="Call TajAttire"
      data-cursor="Call"
    >
      <div className="absolute inset-0 rounded-full border-2 border-[var(--gold)] pointer-events-none"
           style={{ animation: 'pulse-ring-call 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="z-10">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
      <style>{`
        @keyframes pulse-ring-call {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </a>
  );
}

/* ─────────── FLOATING WHATSAPP ─────────── */
export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/917976667197"
      target="_blank"
      rel="noreferrer"
      className="hidden md:flex fixed z-[8000] md:bottom-[28px] md:right-[28px] w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)]"
    >
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366] pointer-events-none" 
           style={{ animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
      <svg viewBox='0 0 24 24' fill='white' className="w-[24px] h-[24px] md:w-[26px] md:h-[26px] z-10"><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z'/><path d='M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.874L0 24l6.304-1.653A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.001-1.371l-.36-.214-3.722.976.995-3.63-.234-.373A9.778 9.778 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z'/></svg>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </a>
  );
}

/* ─────────── SUSTAINABILITY ─────────── */
export function SustainabilitySection() {
  const { data: dbCards } = useSustainabilityCards();
  const stats = (dbCards && dbCards.length > 0)
    ? dbCards.map(c => ({ n: c.number, value: c.value, label: c.label, detail: c.detail }))
    : [
        { n: "01", value: "100%", label: "Natural Fibre Sourcing", detail: "Every fabric — cotton, rayon, linen — comes from natural, traceable sources. No synthetics by default." },
        { n: "02", value: "Zero", label: "Single-Use Plastic Policy", detail: "We pack in biodegradable polybags and recycled cartons. Our commitment: no virgin plastic in any shipment." },
        { n: "03", value: "500+", label: "Artisan Livelihoods Supported", detail: "Every order you place supports skilled workers and their families in Jaipur. Craft is our responsibility." },
      ];

  return (
    <section data-bg="dark" className="relative bg-[var(--emerald-deep)] grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Text side */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] block mb-6">— Sustainability</span>
            <SplitHeading text="Made Responsibly." as="h2" className="font-display text-cloud font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]" />
            <SplitHeading text="Worn Proudly." delay={0.2} as="h2" className="font-display text-cloud italic font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]" />
            <div className="mt-8 space-y-5">
              <FadeLines
                lines={[
                  "We believe fashion wholesale doesn't have to cost the earth. TajAttire has always sourced natural fabrics, worked directly with weavers, and built for longevity — not trend chasing.",
                  "Our production runs are planned to minimise waste, and our artisans are paid fairly. When you stock TajAttire, you're backing a supply chain that respects people and planet.",
                ]}
                lineClass="text-cloud/80 leading-relaxed"
              />
            </div>
          </div>

          {/* Stat cards side */}
          <div className="grid gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
                className="relative border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-8 bg-[#0A2416]"
              >
                <span className="absolute top-4 right-6 outline-num text-6xl opacity-30">{s.n}</span>
                <div className="font-display text-[var(--gold)] font-light mb-2" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>{s.value}</div>
                <div className="text-cloud text-xs uppercase tracking-[0.2em] font-body mb-3">{s.label}</div>
                <p className="text-cloud/60 text-sm leading-relaxed font-body">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── MANUFACTURING TEASER ─────────── */
export function ManufacturingTeaser() {
  const navigate = usePageTransition();
  const IMG = useImg();
  const { data: settings } = useSettings();

  const customMedia = parseWorkspaceMedia(settings?.workspace_media_json);
  const allMedia = customMedia.length > 0
    ? customMedia
    : [
        { id: "w1", type: "image" as const, url: IMG.workspace1, label: "Production Floor — Jaipur" },
        { id: "w2", type: "image" as const, url: IMG.workspace2, label: "Quality Check Station" },
        { id: "w3", type: "image" as const, url: IMG.workspace3, label: "Finishing & Packaging" },
      ];
  const WORKSPACE_IMGS = allMedia.slice(0, 3);

  const [galleryOpen, setGalleryOpen] = useState(false);
  useBackToClose(galleryOpen, () => setGalleryOpen(false));
  useEffect(() => {
    if (!galleryOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [galleryOpen]);

  return (
    <section data-bg="dark" className="relative bg-[var(--deep-black)] grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] block mb-6">— Inside Our Workspace</span>
            <SplitHeading text="See How We" as="h2" className="font-display text-cloud font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]" />
            <SplitHeading text="Make Everything." delay={0.2} as="h2" className="font-display text-cloud italic font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]" />
            <div className="mt-8 mb-10">
              <FadeLines
                lines={[
                  "From raw fabric rolls to finished, tagged, and packed garments — every step happens under one roof in our Jaipur facility.",
                  "We invest in skilled hands, not just machines. That's why every TajAttire piece carries the precision of a production line and the care of a craftsman.",
                ]}
                lineClass="text-cloud/70 leading-relaxed"
              />
            </div>
            <div className="flex flex-wrap gap-8 mb-10 text-xs tracking-[0.2em] uppercase text-cloud/50">
              <span>
                <b className="font-display text-[var(--gold)] block mb-1" style={{ fontSize: "1.8rem" }}>25+</b>
                Skilled Artisans
              </span>
              <span>
                <b className="font-display text-[var(--gold)] block mb-1" style={{ fontSize: "1.8rem" }}>20</b>
                Yrs Exporting
              </span>
              <span>
                <b className="font-display text-[var(--gold)] block mb-1" style={{ fontSize: "1.8rem" }}>500+</b>
                Active Designs
              </span>
            </div>
            <MagneticButton
              href="/contact"
              onClick={() => navigate("/contact")}
              variant="outline"
              cursorLabel="Visit"
            >
              Request Factory Visit →
            </MagneticButton>
          </div>

          {/* Stacked images side */}
          <div className="relative h-[420px] md:h-[520px] mt-8 md:mt-0">
            {WORKSPACE_IMGS.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -4 : 4 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: i === 0 ? -2 : i === 1 ? 1.5 : -1,
                }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.18 }}
                className="absolute overflow-hidden border border-[var(--gold)]/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                style={{
                  width: "72%",
                  aspectRatio: "16/10",
                  top: `${i * 28}%`,
                  left: i % 2 === 0 ? "0" : "28%",
                  zIndex: 3 - i,
                }}
              >
                {img.type === "video" ? (
                  <video src={img.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                ) : (
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {i === 0 && (
                  <div className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] font-body">
                    {img.label}
                  </div>
                )}
              </motion.div>
            ))}
            {/* Floating badge — opens the full gallery */}
            <motion.button
              type="button"
              onClick={() => setGalleryOpen(true)}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 }}
              whileHover={{ scale: 1.06 }}
              className="absolute bottom-2 right-0 z-20 border border-[var(--gold)] bg-[var(--deep-black)] text-[var(--gold)] text-[10px] uppercase font-bold py-2 px-4 rounded-full hover:bg-[var(--gold)] hover:text-deep-black transition-colors duration-200 cursor-pointer"
            >
              ✦ View All Photos &amp; Videos ({allMedia.length})
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Full Workspace Gallery ── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9500] flex flex-col bg-[var(--deep-black)]"
          >
            <div className="flex-shrink-0 border-b border-[var(--gold)]/10 bg-[var(--deep-black)]/95 backdrop-blur-sm">
              <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">— Inside Our Workspace</span>
                  <h3 className="font-display text-cloud text-xl md:text-2xl leading-tight">Full Gallery</h3>
                </div>
                <button
                  onClick={() => setGalleryOpen(false)}
                  className="w-9 h-9 rounded-full border border-[var(--gold)]/30 text-cloud flex items-center justify-center hover:bg-[var(--gold)] hover:text-deep-black transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {allMedia.map(m => (
                    <div key={m.id} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--gold)]/10 bg-white/5">
                      {m.type === "video" ? (
                        <video src={m.url} className="w-full h-full object-cover" controls playsInline />
                      ) : (
                        <img src={m.url} alt={m.label} loading="lazy" className="w-full h-full object-cover" />
                      )}
                      {m.label && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 pointer-events-none">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--gold)]">{m.label}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Lead-capture CTA — don't let an engaged visitor leave without a next step */}
                <div className="mt-14 border-t border-[var(--gold)]/10 pt-10 text-center">
                  <p className="text-cloud/70 mb-6 max-w-lg mx-auto">Like what you see? Come experience it in person, or get a quote started right now.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <MagneticButton
                      href="/contact"
                      onClick={() => { setGalleryOpen(false); navigate("/contact"); }}
                      variant="gold"
                      cursorLabel="Visit"
                    >
                      Request Factory Visit →
                    </MagneticButton>
                    <MagneticButton href="https://wa.me/917976667197" variant="wa" cursorLabel="WhatsApp">
                      WhatsApp Us Now
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────── INSTAGRAM GRID ─────────── */
const DEFAULT_IG_IMAGES = [
  { src: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80", alt: "Kurti Collection" },
  { src: "https://images.unsplash.com/photo-1610189025214-7b6c6c44f6f0?w=600&q=80", alt: "Artisan Craft" },
  { src: "https://images.unsplash.com/photo-1583391733981-8498408cf57f?w=600&q=80", alt: "Gown Collection" },
  { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", alt: "Fashion Editorial" },
  { src: "https://images.unsplash.com/photo-1617059062265-1ca7b50d6e92?w=600&q=80", alt: "TajAttire Style" },
  { src: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80", alt: "Wholesale Fashion" },
];

export function InstagramGrid() {
  const { data: dbImages } = useInstagramImages();
  const IG_IMAGES = (dbImages && dbImages.length > 0)
    ? dbImages.map(img => ({ src: img.image_url, alt: img.alt }))
    : DEFAULT_IG_IMAGES;

  return (
    <section data-bg="light" className="relative bg-[var(--cloud)] grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] block mb-6">— Follow the Journey</span>
          <SplitHeading text="@TajAttire on" as="h2" className="font-display text-emerald font-light leading-[1.05] text-[clamp(2rem,4vw,3.5rem)]" />
          <SplitHeading text="Instagram" delay={0.15} as="h2" className="font-display text-emerald italic font-light leading-[1.05] text-[clamp(2rem,4vw,3.5rem)]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-12">
          {IG_IMAGES.map((img, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/tajattire"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden"
              data-cursor="View"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[var(--emerald-deep)]/0 group-hover:bg-[var(--emerald-deep)]/40 transition-colors duration-500 flex items-center justify-center">
                <svg
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center">
          <MagneticButton
            href="https://www.instagram.com/tajattire"
            variant="outline-dark"
            cursorLabel="Follow"
          >
            Follow @TajAttire
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ─────────── FAQ ACCORDION ─────────── */
const DEFAULT_FAQ = [
  {
    q: "What is the minimum order quantity?",
    a: "Our MOQ is 100 pieces per style for catalogue designs. For custom/private label orders, the minimum is 200 pieces per design. No exceptions on minimums.",
  },
  {
    q: "What product categories do you offer?",
    a: "We specialise in kurtis (cotton, rayon, printed, embroidered — 180+ designs), gowns (floor-length, anarkali — 80+ designs), and contemporary tops (120+ designs). Custom designs are also welcome.",
  },
  {
    q: "Can I place a custom or private label order?",
    a: "Yes. Share your design brief and reference images via WhatsApp or email. We quote within 24 hours and can manufacture from 200 pieces with your branding, labels, and packaging.",
  },
  {
    q: "What are your wholesale prices?",
    a: "Wholesale prices start from ₹180 per piece for kurtis. Gowns and tops vary based on fabric and design complexity. We'll send you a full price list on request.",
  },
  {
    q: "What are your payment terms?",
    a: "We work on 50% advance at order confirmation and 50% before dispatch. Accepted modes: NEFT/RTGS/IMPS and UPI. We'll share our bank details once your order is confirmed.",
  },
  {
    q: "How long does production and delivery take?",
    a: "Standard catalogue orders: 7–15 days. Custom orders: 20–30 days depending on quantity and complexity. Delivery via Delhivery, Bluedart, or DTDC across 20+ states.",
  },
  {
    q: "Are samples available before bulk ordering?",
    a: "Yes. Sample pieces are available at a nominal charge, which is fully adjusted against your first bulk order. WhatsApp us to request a specific design.",
  },
  {
    q: "Do you do private label / white label manufacturing?",
    a: "Yes — full private label services including custom woven labels, hang tags, polybag printing, and branded carton boxes. MOQ is 200 pieces per style.",
  },
  {
    q: "What fabrics do you work with?",
    a: "Cotton, rayon, georgette, crepe, linen, and blended fabrics. We can also source custom fabrics to your specification for larger orders.",
  },
  {
    q: "How do I check quality before placing a large order?",
    a: "Every dispatch is double quality-checked at our end. For new clients, we strongly recommend ordering a sample set first. Any defective pieces are replaced in the next order.",
  },
  {
    q: "Can I visit your factory in Jaipur?",
    a: "Absolutely. We welcome retailers, boutique owners, and wholesalers to visit our Jaipur production facility. Book a slot via WhatsApp or fill the factory visit form on our site.",
  },
  {
    q: "How do I place my first order?",
    a: "Fill the enquiry form at the bottom of this page, or send us a WhatsApp with your requirements. Our team responds within 2 business hours with pricing and next steps.",
  },
];

export function FAQ() {
  const { data: dbFaq } = useFaqItems();
  const faqItems = (dbFaq && dbFaq.length > 0)
    ? dbFaq.map(f => ({ q: f.question, a: f.answer }))
    : DEFAULT_FAQ;

  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen((p) => (p === i ? null : i));

  return (
    <section data-bg="light" className="relative bg-[var(--cloud)] grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-6">— Frequently Asked</span>
          <SplitHeading
            text="Questions Buyers"
            as="h2"
            className="font-display text-emerald font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]"
          />
          <SplitHeading
            text="Always Ask Us."
            delay={0.2}
            as="h2"
            className="font-display text-emerald italic font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]"
          />
          <p className="mt-6 text-charcoal/60 max-w-xl font-body leading-relaxed">
            Everything you need to know before placing your first wholesale order.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-4xl mx-auto">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className={`border-b border-charcoal/10 last:border-b-0 transition-colors duration-300 ${open === i ? "bg-[var(--gold)]/[0.04]" : ""}`}
            >
              <button
                id={`faq-btn-${i}`}
                aria-expanded={open === i}
                onClick={() => toggle(i)}
                data-cursor={open === i ? "Close" : "Open"}
                className="w-full flex items-center justify-between py-6 px-4 -mx-4 text-left group"
              >
                <span className="font-display text-charcoal font-light group-hover:text-[var(--emerald-deep)] transition-colors pr-8 leading-snug text-lg md:text-xl">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0 w-7 h-7 rounded-full border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10 transition-all duration-300"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2v8M2 6h8" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 text-charcoal/70 leading-relaxed font-body border-l-2 border-[var(--gold)] pl-6">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-16 text-center">
          <p className="text-charcoal/50 text-sm mb-6 font-body">Still have questions?</p>
          <MagneticButton href="https://wa.me/917976667197" variant="wa" cursorLabel="Chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
            </svg>
            Ask Us on WhatsApp
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

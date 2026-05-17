import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton, SplitHeading, FadeLines, CurtainImage, CountUp, Parallax } from "./Primitives";

const IMG = {
  hero: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80",
  kurti: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80",
  gown: "https://images.unsplash.com/photo-1583391733981-8498408cf57f?w=1200&q=80",
  tops: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80",
  craft: "https://images.unsplash.com/photo-1610189025214-7b6c6c44f6f0?w=1200&q=80",
  cta: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920&q=80",
  form: "https://images.unsplash.com/photo-1617059062265-1ca7b50d6e92?w=1200&q=80",
};

/* ─────────── HERO ─────────── */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Scatter chars
  const headlineA = "Where Craft".split("");
  const headlineB = "Meets Commerce.".split("");

  const particles = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: 40 + Math.random() * 60,
    dx: (Math.random() - 0.5) * 60,
    delay: Math.random() * 8,
    size: Math.random() * 2 + 1,
  })), []);

  return (
    <section ref={ref} id="top" className="relative min-h-[100vh] w-full overflow-hidden bg-deep-black grain">
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <img src={IMG.hero} alt="" className="w-full h-[130%] object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/50 to-[#0A0A0A]" />
      </motion.div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle absolute rounded-full bg-[var(--gold)]"
            style={{
              left: `${p.left}%`, top: `${p.top}%`,
              width: p.size, height: p.size,
              ["--dx" as any]: `${p.dx}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Hairline draw */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.5, duration: 0.9, ease: "easeInOut" }}
        style={{ transformOrigin: "left" }}
        className="absolute top-32 left-12 right-12 h-px bg-[var(--gold)]"
      />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-12 pt-44 pb-32">
        <h1 className="font-display text-cloud leading-[0.95] tracking-[-0.02em]">
          <span className="block text-[12vw] md:text-[9vw] font-light">
            {headlineA.map((c, i) => (
              <motion.span
                key={`a${i}`}
                initial={{ opacity: 0, x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, rotate: (Math.random() - 0.5) * 60 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ delay: 2.7 + i * 0.04, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="inline-block"
                style={{ whiteSpace: "pre" }}
              >{c}</motion.span>
            ))}
          </span>
          <span className="block text-[12vw] md:text-[9vw] font-bold">
            {headlineB.map((c, i) => (
              <motion.span
                key={`b${i}`}
                initial={{ opacity: 0, x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, rotate: (Math.random() - 0.5) * 60 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ delay: 3.2 + i * 0.04, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
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
          <MagneticButton href="#collections" variant="gold" cursorLabel="Explore">
            Explore Collections <span>→</span>
          </MagneticButton>
          <MagneticButton href="https://wa.me/919999999999" variant="outline" cursorLabel="Order">
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

/* ─────────── MARQUEE ─────────── */
export function Marquee() {
  const top = ["500+ Designs", "MOQ 100 Pieces", "Starting ₹180", "Pan-India Delivery", "Kurtis · Gowns · Tops"];
  const bot = ["Trusted by Retailers", "20+ States", "Custom Orders Welcome", "Quality Guaranteed", "Handcrafted Heritage"];
  const Row = ({ items, dir }: { items: string[]; dir: "left" | "right" }) => (
    <div className="overflow-hidden">
      <div className={`flex gap-12 whitespace-nowrap ${dir === "left" ? "marquee-left" : "marquee-right"}`} style={{ width: "max-content" }}>
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-cloud text-3xl md:text-5xl italic font-light">
            {t}
            <span className="text-[var(--gold)] text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <section className="relative bg-[var(--emerald-deep)] py-10 grain marquee-wrap border-y border-[var(--gold)]/20">
      <div className="space-y-6">
        <Row items={top} dir="left" />
        <Row items={bot} dir="right" />
      </div>
    </section>
  );
}

/* ─────────── BRAND STATEMENT ─────────── */
export function Statement() {
  return (
    <section className="relative bg-deep-black grain py-40 overflow-hidden">
      {/* Taj watermark */}
      <svg viewBox="0 0 200 120" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] opacity-[0.03]">
        <path d="M100 10 L60 50 L60 100 L140 100 L140 50 Z M100 10 L100 100 M80 40 L120 40 M70 70 L130 70" stroke="white" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <SplitHeading
          text={`"We don't just make clothes. We build the inventory that builds your business."`}
          as="blockquote"
          className="font-display italic text-[var(--gold)] text-[7vw] md:text-[4.5vw] leading-[1.1] tracking-tight"
        />
        <div className="hairline mt-16 mx-auto w-32" />
        <p className="mt-6 text-cloud/50 text-xs tracking-[0.3em] uppercase">— TajAttire, crafting wholesale fashion since 2004</p>
      </div>
    </section>
  );
}

/* ─────────── COLLECTIONS (horizontal scroll) ─────────── */
const collections = [
  { tag: "01", title: "Kurti Collection", count: "180+ Designs", copy: "Cotton. Rayon. Printed. Embroidered. The range your customers reach for before they reach for anything else.", img: IMG.kurti },
  { tag: "02", title: "Gown Collection", count: "80+ Designs", copy: "Floor-length. Occasion-ready. Wholesale-priced. Because your buyers deserve evening wear that moves — and margins that don't hurt.", img: IMG.gown },
  { tag: "03", title: "Tops Collection", count: "120+ Designs", copy: "Contemporary cuts. Versatile silhouettes. The everyday essential that keeps your customers coming back — and your shelf turning over.", img: IMG.tops },
];

export function Collections() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section id="collections" ref={ref} className="relative bg-deep-black" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden grain">
        <div className="absolute top-0 left-0 right-0 z-20 px-6 lg:px-12 py-8 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">04 — Our Collections</span>
          <span className="hidden md:block text-xs uppercase tracking-[0.3em] text-cloud/40">Scroll to explore →</span>
        </div>

        <motion.div style={{ x }} className="flex h-full pt-24 md:pt-32 pb-12 pl-6 lg:pl-12 gap-6">
          {collections.map((c) => (
            <div key={c.tag} className="relative w-[85vw] md:w-[60vw] h-full flex-shrink-0 overflow-hidden border border-[var(--gold)]/20" data-cursor="View">
              <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
              <div className="absolute top-6 left-6 text-xs tracking-[0.3em] text-[var(--gold)]">{c.tag}</div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] mb-3">{c.count}</div>
                <h3 className="font-display text-cloud text-5xl md:text-7xl font-light mb-5">{c.title}</h3>
                <p className="text-cloud/70 max-w-md mb-6 leading-relaxed">{c.copy}</p>
                <MagneticButton href="#order" variant="gold" cursorLabel="Enquire">Enquire This Collection →</MagneticButton>
              </div>
            </div>
          ))}

          {/* Final panel */}
          <div className="relative w-[85vw] md:w-[60vw] h-full flex-shrink-0 flex items-center justify-center bg-[var(--emerald-deep)] grain border border-[var(--gold)]/20">
            <div className="text-center max-w-md px-8">
              <p className="font-display italic text-[var(--gold)] text-5xl md:text-6xl leading-tight mb-8">"Can't find your style? We do custom too."</p>
              <MagneticButton href="https://wa.me/919999999999" variant="wa" cursorLabel="Chat">WhatsApp Us</MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── CRAFT (light) ─────────── */
export function Craft() {
  return (
    <section id="craft" className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
        <CurtainImage src={IMG.craft} alt="The craft" className="aspect-[3/4] w-full" />
        <div className="relative">
          <div className="outline-num text-[18rem] absolute -top-20 -left-4 md:-left-10 select-none pointer-events-none">05</div>
          <div className="relative">
            <SplitHeading text="Not Just Fabric." as="h2" className="block font-display text-emerald text-5xl md:text-7xl font-light leading-tight" />
            <SplitHeading text="A Philosophy." delay={0.3} as="h2" className="block font-display text-emerald italic text-5xl md:text-7xl font-light leading-tight" />
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
              <span><b className="text-emerald font-display text-xl mr-1">500+</b>Designs</span>
              <span><b className="text-emerald font-display text-xl mr-1">₹180</b>Start</span>
              <span><b className="text-emerald font-display text-xl mr-1">100</b>MOQ</span>
              <span><b className="text-emerald font-display text-xl mr-1">20+</b>States</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── WHY (emerald) ─────────── */
const whys = [
  { n: "01", title: "MOQ That Respects Your Reality", copy: "100 pieces minimum. Not 500. Not 1,000. We know what it takes to start, and we built our model around your actual business — not an ideal version of it.", big: true },
  { n: "02", title: "Pricing Built for Profitable Retail", copy: "Wholesale rates from ₹180 per piece. Margins that let you compete, grow, and still sleep at night.", big: true },
  { n: "03", title: "Craft You Can Stake Your Name On", copy: "Double quality-checked before dispatch. Your customers judge you — we make sure you pass.", big: false },
  { n: "04", title: "Pan-India. On Time. Every Time.", copy: "20+ states. Reliable dispatch windows. Because your restock cycle is a business commitment, not a suggestion.", big: false },
];

export function Why() {
  return (
    <section className="relative bg-[var(--emerald-deep)] grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-20 flex-wrap gap-6">
          <SplitHeading
            text="The Partner Your Margins Have Been Waiting For."
            as="h2"
            className="font-display text-cloud text-5xl md:text-7xl font-light max-w-3xl leading-[1.05]"
          />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">06 — Why TajAttire</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid gap-6">
            {whys.filter(w => w.big).map((w, i) => (
              <motion.div
                key={w.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="card-lift relative border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-10 bg-black/20 backdrop-blur-sm"
                data-cursor="Read"
              >
                <span className="absolute top-4 right-6 outline-num text-7xl opacity-40">{w.n}</span>
                <h3 className="font-display text-cloud text-3xl md:text-4xl font-light mb-4">{w.title}</h3>
                <p className="text-cloud/70 leading-relaxed max-w-2xl">{w.copy}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-6">
            {whys.filter(w => !w.big).map((w, i) => (
              <motion.div
                key={w.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: 0.24 + i * 0.12 }}
                className="card-lift relative border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-8 bg-black/20 backdrop-blur-sm"
                data-cursor="Read"
              >
                <span className="absolute top-3 right-5 outline-num text-5xl opacity-40">{w.n}</span>
                <h3 className="font-display text-cloud text-2xl font-light mb-3">{w.title}</h3>
                <p className="text-cloud/70 text-sm leading-relaxed">{w.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── STATS ─────────── */
export function Stats() {
  const items = [
    { v: 500, suffix: "+", label: "Designs Ready to Ship" },
    { v: 180, prefix: "₹", label: "Starting Wholesale Price" },
    { v: 100, label: "Minimum Order Quantity" },
    { v: 20, suffix: "+", label: "States Delivered Across India" },
  ];
  return (
    <section className="relative bg-cloud grain py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />
      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald">07 — By the Numbers</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center md:text-left">
              <CountUp end={it.v} prefix={it.prefix} suffix={it.suffix} className="font-display text-emerald text-7xl md:text-8xl font-light leading-none" />
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathScale = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

  return (
    <section className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald">08 — How It Works</span>
          <SplitHeading text="From First Look to First Shipment." as="h2" className="mt-4 font-display text-emerald text-5xl md:text-7xl font-light leading-tight" />
          <p className="mt-6 text-charcoal/70 max-w-xl">Three steps. Zero confusion. Exactly how wholesale should work.</p>
        </div>

        <div ref={ref} className="relative grid md:grid-cols-3 gap-10">
          <motion.div style={{ scaleX: pathScale, transformOrigin: "left" }} className="hidden md:block absolute top-20 left-0 right-0 h-px bg-[var(--gold)]" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="relative pt-8"
            >
              <div className="absolute top-14 left-0 w-4 h-4 rounded-full bg-cloud border-2 border-[var(--gold)]" />
              <div className="outline-num text-8xl mb-6 pl-8">{s.n}</div>
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
const testimonials = [
  { quote: "TajAttire has been our go-to wholesale partner for over a decade. Consistent quality, designs that always sell, and a team that actually picks up the phone.", name: "Priya Sharma", role: "Boutique Owner · Jaipur" },
  { quote: "The 100-piece MOQ was the reason we started. Today we order 5x that every season. The margins are the best we've seen in this category.", name: "Rajan Mehta", role: "Multi-brand Fashion Retailer · Surat" },
  { quote: "From kurtis to gowns — every collection delivers. Our customers don't just buy these pieces. They ask for them by name.", name: "Neha Kapoor", role: "Fashion Store Owner · Lucknow" },
];

export function Testimonials() {
  return (
    <section className="relative bg-[var(--emerald-deep)] grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">09 — Testimonials</span>
          <SplitHeading text="1,000+ Retailers. One Thing in Common." as="h2" className="mt-4 font-display text-cloud text-5xl md:text-7xl font-light leading-[1.05]" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`card-lift bg-black/30 backdrop-blur-md border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-8 ${i === 1 ? "md:mt-12" : ""} ${i === 2 ? "md:mt-6" : ""}`}
              data-cursor="Read"
            >
              <div className="flex gap-1 mb-5 text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, j) => <span key={j}>★</span>)}
              </div>
              <p className="font-display italic text-cloud text-xl leading-snug mb-6">"{t.quote}"</p>
              <div className="hairline mb-4 w-12" />
              <div className="text-cloud font-medium text-sm">{t.name}</div>
              <div className="text-cloud/60 text-xs tracking-wider uppercase mt-1">{t.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── CTA BAND ─────────── */
export function CtaBand() {
  return (
    <section className="relative min-h-[80vh] grain shimmer-sweep overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <img src={IMG.cta} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[var(--emerald-deep)]/80" />
      </div>
      <div className="relative max-w-5xl mx-auto px-6 text-center py-24">
        <SplitHeading text="Your next bestseller is already in our catalog." as="h2" className="font-display text-cloud text-5xl md:text-7xl font-light leading-[1.05]" />
        <p className="mt-8 font-display italic text-[var(--gold)] text-2xl md:text-3xl">The only question is — when do you want to start?</p>
        <div className="mt-12 flex flex-wrap gap-5 justify-center">
          <MagneticButton href="#order" variant="gold" cursorLabel="Catalog">Download Catalog</MagneticButton>
          <MagneticButton href="https://wa.me/919999999999" variant="outline" cursorLabel="Chat">WhatsApp Us Now</MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ─────────── INQUIRY FORM ─────────── */
export function Inquiry() {
  const [interests, setInterests] = useState<string[]>([]);
  const toggle = (v: string) => setInterests((p) => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  return (
    <section id="order" className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald">10 — Inquiry</span>
          <SplitHeading text="Ready to Stock Smart? Let's Talk." as="h2" className="mt-4 font-display text-emerald text-5xl md:text-7xl font-light leading-tight" />
          <p className="mt-6 text-charcoal/70 max-w-xl">Fill in your details and we'll reach out within 2 business hours. No spam. No fluff. Just a conversation about your next order.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          <div className="relative overflow-hidden min-h-[500px]">
            <img src={IMG.form} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[var(--emerald-deep)]/75" />
            <div className="relative p-10 h-full flex items-end">
              <p className="font-display italic text-cloud text-3xl md:text-4xl leading-snug">"Your customers deserve better. So do your margins."</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you — we'll be in touch within 2 business hours."); }} className="space-y-5">
            {["Full Name", "Business Name", "City / State", "WhatsApp Number"].map((f) => (
              <div key={f}>
                <label className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 mb-2 block">{f}</label>
                <input required className="w-full bg-transparent border-b border-charcoal/20 py-3 text-charcoal focus:outline-none focus:border-[var(--gold)] transition-colors" />
              </div>
            ))}
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 mb-3 block">Interested In</label>
              <div className="flex flex-wrap gap-3">
                {["Kurtis", "Gowns", "Tops", "Full Catalog"].map((o) => (
                  <button key={o} type="button" onClick={() => toggle(o)} data-cursor="Pick"
                    className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-all ${interests.includes(o) ? "bg-emerald text-cloud border-emerald" : "border-charcoal/20 text-charcoal/70 hover:border-[var(--gold)]"}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 mb-2 block">Approximate Quantity Needed</label>
              <input required className="w-full bg-transparent border-b border-charcoal/20 py-3 text-charcoal focus:outline-none focus:border-[var(--gold)] transition-colors" />
            </div>
            <div className="pt-4">
              <MagneticButton cursorLabel="Send" variant="gold">Send My Enquiry →</MagneticButton>
            </div>
            <div className="pt-6 border-t border-charcoal/10 flex items-center justify-between flex-wrap gap-4">
              <span className="text-sm text-charcoal/70">Prefer to talk directly?</span>
              <MagneticButton href="https://wa.me/919999999999" variant="wa" cursorLabel="Chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
                WhatsApp
              </MagneticButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */
export function Footer() {
  return (
    <footer id="connect" className="relative bg-deep-black grain pt-24 pb-8 overflow-hidden">
      <div className="overflow-hidden border-y border-[var(--gold)]/10 py-3 mb-16">
        <div className="marquee-left whitespace-nowrap flex gap-8 text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]/40" style={{ width: "max-content" }}>
          {Array.from({ length: 20 }).map((_, i) => <span key={i}>TAJATTIRE · HANDCRAFTED HERITAGE ·</span>)}
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <svg viewBox="0 0 40 28" className="w-12 h-9 mx-auto mb-4">
            <path d="M20 3 L8 13 L8 24 L32 24 L32 13 Z M20 3 L20 24 M14 9 L26 9" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
          </svg>
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
              <li><a href="#collections" data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Collections</a></li>
              <li><a href="#craft" data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Why Us</a></li>
              <li><a href="#order" data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">How to Order</a></li>
              <li><a href="#connect" data-cursor="Go" className="hover:text-[var(--gold)] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>WhatsApp: +91 99999 99999</li>
              <li>Email: orders@tajattire.com</li>
              <li>Location: Jaipur, India</li>
            </ul>
            <div className="mt-5 flex gap-4">
              <a href="#" data-cursor="IG" className="text-[var(--gold)] hover:scale-125 transition-transform inline-block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
              <a href="https://wa.me/919999999999" data-cursor="WA" className="text-[var(--gold)] hover:scale-125 transition-transform inline-block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .2.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="hairline mt-16 mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-cloud/40">
          <span>© 2025 TajAttire. All rights reserved.</span>
          <span>GST: 07XXXXX1234X1Z5</span>
        </div>
      </div>
    </footer>
  );
}

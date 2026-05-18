import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { MagneticButton, SplitHeading, FadeLines, CurtainImage, CountUp, Parallax } from "./Primitives";

const IMG = {
  hero: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80",
  kurti: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80",
  gown: "https://images.unsplash.com/photo-1583391733981-8498408cf57f?w=1200&q=80",
  tops: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80",
  craft: "https://images.unsplash.com/photo-1610189025214-7b6c6c44f6f0?w=1200&q=80",
  cta: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
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
    <section ref={ref} id="top" className="relative min-h-[100vh] w-full overflow-hidden overflow-x-hidden bg-deep-black grain">
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <motion.img 
          src={IMG.hero} 
          alt="" 
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="w-full h-[130%] object-cover opacity-50 origin-center" 
        />
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
          <MagneticButton href="#collections" variant="gold" cursorLabel="Explore">
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
    <section className="w-full bg-[#0A0A0A] border-y border-[var(--gold)]/40 py-[10px] md:py-[12px] relative z-20 flex justify-center overflow-hidden">
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
          className="font-display italic text-[var(--gold)] leading-[1.1] tracking-tight text-[clamp(1.5rem,5vw,3.5rem)]"
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
  const smoothProgress = useSpring(scrollYProgress, { damping: 50, stiffness: 400, mass: 0.1 });
  const x = useTransform(smoothProgress, [0, 1], ["calc(0% + 0vw)", "calc(-100% + 100vw)"]);

  const [currentCard, setCurrentCard] = useState("01");
  const cardIndexTransform = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [1, 2, 3, 4]);

  useEffect(() => {
    return cardIndexTransform.onChange((latest) => {
      const idx = Math.round(latest);
      setCurrentCard(`0${idx}`);
    });
  }, [cardIndexTransform]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const hintOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <section id="collections" ref={ref} className="relative bg-deep-black" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden grain">
        
        <div className="absolute top-0 left-0 right-0 z-20 px-6 lg:px-12 py-8 flex items-center justify-between">
          <span className={`uppercase tracking-[0.3em] text-[var(--gold)] ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
            04 — Our Collections
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-medium">
            {currentCard} / 04
          </span>
        </div>

        <motion.div style={{ x, willChange: "transform" }} className="flex h-full w-max gap-4 md:gap-6 px-6 lg:px-12 pt-24 md:pt-32 pb-12 items-center">
          {collections.map((c, i) => (
            <div key={c.tag} className="relative w-[90vw] md:w-[75vw] h-full flex-shrink-0 overflow-hidden border border-[var(--gold)]/20 rounded-md" data-cursor="View">
              <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
              
              <div className="absolute top-6 left-6 text-xs tracking-[0.3em] text-[var(--gold)]">{c.tag}</div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pb-24 md:pb-32">
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] mb-3">{c.count}</div>
                <h3 className={`font-display text-cloud font-light mb-5 leading-tight ${isMobile ? 'text-[clamp(2rem,8vw,5rem)]' : 'text-5xl md:text-7xl'}`}>{c.title}</h3>
                
                {isMobile && (
                  <div className="mb-6 flex flex-row w-full gap-4">
                    <img src="https://placehold.co/400x500/1A5C38/C9A84C?text=Coming+Soon" alt="Thumb" className="w-1/2 h-32 rounded-[8px] border border-[var(--gold)]/30 object-cover" />
                    <img src="https://placehold.co/400x500/1A5C38/C9A84C?text=Coming+Soon" alt="Thumb" className="w-1/2 h-32 rounded-[8px] border border-[var(--gold)]/30 object-cover" />
                  </div>
                )}

                <p className="text-cloud/70 max-w-md mb-6 leading-relaxed">{c.copy}</p>
                <MagneticButton href="#order" variant="gold" cursorLabel="Enquire" className={isMobile ? "w-full justify-center" : ""}>Enquire This Collection →</MagneticButton>
              </div>

              {i === 0 && (
                <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/60">Scroll to explore</span>
                  <motion.span 
                    animate={{ x: [0, 8, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="text-[var(--gold)]/60 text-xs"
                  >→</motion.span>
                </motion.div>
              )}
            </div>
          ))}

          <div className="relative w-[90vw] md:w-[75vw] h-full flex-shrink-0 bg-[var(--emerald-deep)] grain flex flex-col justify-center items-center text-center p-8 border border-[var(--gold)]/20 rounded-md">
            <h3 className={`font-display text-cloud font-light mb-6 leading-[1.1] ${isMobile ? 'text-[clamp(2rem,8vw,5rem)]' : 'text-5xl md:text-7xl'}`}>
              <span className="block">Want something</span>
              <span className="block italic text-[var(--gold)] font-bold mt-2">custom?</span>
            </h3>
            <p className="text-cloud/70 max-w-md mx-auto mb-8 leading-relaxed">
              From fabric selection to final stitch — if you can imagine it, we can manufacture it. Share your reference and we'll build it from scratch.
            </p>
            <div className={`flex flex-col gap-4 ${isMobile ? 'w-full px-6' : 'w-auto'}`}>
              <MagneticButton href="https://wa.me/917976667197" variant="gold" cursorLabel="Custom" className={isMobile ? "w-full justify-center" : ""}>Discuss Custom Order</MagneticButton>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[rgba(201,168,76,0.3)] z-20">
          <motion.div style={{ width: progressWidth }} className="h-full bg-[#C9A84C]" />
        </div>

      </div>
    </section>
  );
}

export function Catalogue() {
  const [activeTab, setActiveTab] = useState("Kurtis");
  const tabs = ["Kurtis", "Gowns", "Tops"];
  
  const generateItems = (category: string) => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: `${category}-${i}`,
      img: "https://placehold.co/600x750/F0EBE1/C9A84C?text=TajAttire",
      label: `${category.toUpperCase().slice(0, -1)} — ${
        category === "Kurtis" ? (i % 2 === 0 ? "COTTON PRINTED" : "RAYON EMBROIDERED") :
        category === "Gowns" ? (i % 2 === 0 ? "FLOOR LENGTH" : "ANARKALI STYLE") :
        (i % 2 === 0 ? "CONTEMPORARY CUT" : "TUNIC STYLE")
      }`,
      price: "₹180 onwards · MOQ 100 pcs"
    }));
  };

  const items = useMemo(() => generateItems(activeTab), [activeTab]);

  return (
    <section className="relative bg-cloud grain py-32 overflow-hidden">
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
                className="group relative bg-white rounded-lg shadow-sm border border-charcoal/5 overflow-hidden flex flex-col cursor-pointer card-lift"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-[var(--gold)] opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <span className="text-[var(--gold)] text-xs tracking-widest uppercase bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">Enquire →</span>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow bg-white relative z-10">
                  <div className="h-px w-full bg-[var(--gold)]/30 mb-4" />
                  <h4 className="text-[10px] md:text-xs font-semibold tracking-wider text-charcoal mb-2">{item.label}</h4>
                  <p className="text-[10px] md:text-xs text-charcoal/50">{item.price}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-20 flex flex-col items-center">
          <p className="text-sm text-charcoal/70 mb-6">Want to see the full catalogue?</p>
          <MagneticButton href="https://wa.me/917976667197" variant="wa" cursorLabel="WhatsApp">
            Request Full Lookbook on WhatsApp
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

export function CustomOrder() {
  return (
    <section className="relative bg-[#1A5C38] grain py-32 overflow-hidden border-t border-[var(--gold)]/20">
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
            <MagneticButton href="mailto:connect.tajattire@gmail.com" variant="outline" cursorLabel="Email">Send Reference Images</MagneticButton>
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
  return (
    <section id="craft" className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
        <CurtainImage src={IMG.craft} alt="The craft" className="aspect-[3/4] w-full" />
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -m-10 p-10"><div className="outline-num text-[clamp(6rem,20vw,18rem)] absolute -top-20 -left-4 md:-left-10 select-none max-w-full overflow-hidden">05</div></div>
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
  { n: "01", title: "MOQ That Respects Your Reality", copy: "100 pieces minimum. Not 500. Not 1,000. We know what it takes to start, and we built our model around your actual business — not an ideal version of it.", big: true },
  { n: "02", title: "Pricing Built for Profitable Retail", copy: "Wholesale rates from ₹180 per piece. Margins that let you compete, grow, and still sleep at night.", big: true },
  { n: "03", title: "Craft You Can Stake Your Name On", copy: "Double quality-checked before dispatch. Your customers judge you — we make sure you pass.", big: false },
  { n: "04", title: "Pan-India. On Time. Every Time.", copy: "20+ states. Reliable dispatch windows. Because your restock cycle is a business commitment, not a suggestion.", big: false },
];

export function Why() {
  return (
    <section className="relative bg-[var(--emerald-deep)] grain py-32 overflow-x-clip">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-20 flex-wrap gap-6">
          <SplitHeading
            text="The Partner Your Margins Have Been Waiting For."
            as="h2"
            className="font-display text-cloud font-light max-w-3xl leading-[1.05] text-[clamp(1.8rem,6vw,4.5rem)]"
          />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">06 — Why TajAttire</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center md:text-left min-w-0">
              <CountUp end={it.v} prefix={it.prefix} suffix={it.suffix} className="font-display text-emerald text-[2.8rem] md:text-8xl font-light leading-none whitespace-nowrap" />
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
    <section className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald">08 — How It Works</span>
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
              <div className="outline-num text-6xl md:text-8xl mb-6 pl-8">{s.n}</div>
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
    <section className="relative bg-[var(--emerald-deep)] grain py-32 overflow-x-clip">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">09 — Testimonials</span>
          <SplitHeading text="1,000+ Retailers. One Thing in Common." as="h2" className="mt-4 font-display text-cloud font-light leading-[1.05] text-[clamp(1.8rem,6vw,4.5rem)]" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
              style={{ top: `calc(6rem + ${i * 1.5}rem)` }}
              className={`sticky z-10 bg-[#0A2416] shadow-[0_-15px_30px_rgba(0,0,0,0.4)] border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-8 ${i === 1 ? "md:mt-12" : ""} ${i === 2 ? "md:mt-6" : ""}`}
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
        <SplitHeading text="Your next bestseller is already in our catalog." as="h2" className="font-display text-cloud font-light leading-[1.05] text-[clamp(2rem,7vw,4.5rem)]" />
        <p className="mt-8 font-display italic text-[var(--gold)] text-2xl md:text-3xl">The only question is — when do you want to start?</p>
        <div className="mt-12 flex flex-wrap gap-5 justify-center">
          <MagneticButton href="#order" variant="gold" cursorLabel="Catalog">Download Catalog</MagneticButton>
          <MagneticButton href="https://wa.me/917976667197" variant="outline" cursorLabel="Chat">WhatsApp Us Now</MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ─────────── INQUIRY FORM ─────────── */
export function Inquiry() {
  const [interests, setInterests] = useState<string[]>([]);
  const toggle = (v: string) => setInterests((p) => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const [formData, setFormData] = useState({ name: "", business: "", city: "", whatsapp: "", quantity: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error"|"redirecting">("idle");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    if (isMobile) {
      const text = `Hello TajAttire Team,\nName: ${formData.name}\nBusiness: ${formData.business}\nCity: ${formData.city}\nWhatsApp: ${formData.whatsapp}\nInterested In: ${interests.length ? interests.join(", ") : "Not specified"}\nQuantity: ${formData.quantity}\nLooking forward to connecting!`;
      
      setStatus("redirecting");
      setTimeout(() => {
        window.open(`https://wa.me/917976667197?text=${encodeURIComponent(text)}`, "_blank");
        setStatus("idle");
      }, 1000);
    } else {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: "eac902e8-cb07-44ff-b8d0-6fb0785f6ba0",
            name: formData.name,
            business: formData.business,
            city: formData.city,
            whatsapp: formData.whatsapp,
            interest: interests.length ? interests.join(", ") : "Not specified",
            quantity: formData.quantity,
          })
        });
        if (res.ok) setStatus("success");
        else setStatus("error");
      } catch {
        setStatus("error");
      }
    }
  };

  return (
    <section id="order" className="relative bg-cloud grain py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-20 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald">10 — Inquiry</span>
          <SplitHeading text="Ready to Stock Smart? Let's Talk." as="h2" className="mt-4 font-display text-emerald font-light leading-tight text-[clamp(1.8rem,6vw,4.5rem)]" />
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 mb-2 block">Full Name</label>
              <input required value={formData.name} onChange={handleChange("name")} className="w-full bg-transparent border-b border-charcoal/20 py-3 text-charcoal focus:outline-none focus:border-[var(--gold)] transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 mb-2 block">Business Name</label>
              <input required value={formData.business} onChange={handleChange("business")} className="w-full bg-transparent border-b border-charcoal/20 py-3 text-charcoal focus:outline-none focus:border-[var(--gold)] transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 mb-2 block">City / State</label>
              <input required value={formData.city} onChange={handleChange("city")} className="w-full bg-transparent border-b border-charcoal/20 py-3 text-charcoal focus:outline-none focus:border-[var(--gold)] transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-charcoal/60 mb-2 block">WhatsApp Number</label>
              <input required type="tel" value={formData.whatsapp} onChange={handleChange("whatsapp")} className="w-full bg-transparent border-b border-charcoal/20 py-3 text-charcoal focus:outline-none focus:border-[var(--gold)] transition-colors" />
            </div>
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
              <input required value={formData.quantity} onChange={handleChange("quantity")} className="w-full bg-transparent border-b border-charcoal/20 py-3 text-charcoal focus:outline-none focus:border-[var(--gold)] transition-colors" />
            </div>
            <div className="pt-4 flex flex-col gap-2">
              <button type="submit" className="w-fit btn-liquid inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm tracking-[0.15em] uppercase font-medium border bg-[var(--gold)] border-[var(--gold)] text-[var(--deep-black)] hover:bg-[#b0913c]">
                {status === "loading" ? "Processing..." : isMobile ? "Chat on WhatsApp" : "Send Enquiry"}
              </button>
              {status === "redirecting" && <p className="text-sm font-medium text-emerald">Redirecting you to WhatsApp...</p>}
              {status === "success" && <p className="text-sm font-medium text-[#1A5C38]">Your enquiry has been sent! We will reach out within 2 hours.</p>}
              {status === "error" && (
                <div className="text-sm text-red-600 mt-1">
                  Something went wrong. Please try WhatsApp instead.
                  <br />
                  <a href="https://wa.me/917976667197" target="_blank" className="underline mt-1 inline-block text-emerald">wa.me/917976667197</a>
                </div>
              )}
            </div>
            <div className="pt-6 border-t border-charcoal/10 flex items-center justify-between flex-wrap gap-4">
              <span className="text-sm text-charcoal/70">Prefer to talk directly?</span>
              <MagneticButton href="https://wa.me/917976667197" variant="wa" cursorLabel="Chat">
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
          <img src="/logo.png" alt="TajAttire Logo" style={{ height: '48px', width: 'auto', mixBlendMode: 'lighten' }} className="mx-auto mb-4" />
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
              <li>WhatsApp: +91 79766 67197</li>
              <li>Email: connect.tajattire@gmail.com</li>
              <li>Location: Jaipur, India</li>
            </ul>
            <div className="mt-5 flex gap-4">
              <a href="#" data-cursor="IG" className="text-[var(--gold)] hover:scale-125 transition-transform inline-block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
              <a href="https://wa.me/917976667197" data-cursor="WA" className="text-[var(--gold)] hover:scale-125 transition-transform inline-block">
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

/* ─────────── FACTORY VISIT POPUP ─────────── */
export function FactoryVisitPopup() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error"|"redirecting">("idle");
  const [formData, setFormData] = useState({
    name: "", businessType: "Retailer", date: "", people: "1", whatsapp: ""
  });

  useEffect(() => {
    if (sessionStorage.getItem("factoryVisitShown")) return;
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);

    if (mobile) {
      const t = setTimeout(() => {
        setVisible(true);
        sessionStorage.setItem("factoryVisitShown", "true");
      }, 13000);
      return () => clearTimeout(t);
    } else {
      let lastScrollY = window.scrollY;
      let maxScrollY = window.scrollY;
      const handleScroll = () => {
        const sy = window.scrollY;
        if (sy > maxScrollY) maxScrollY = sy;
        if (maxScrollY > 600 && sy < lastScrollY - 20) {
          setVisible(true);
          sessionStorage.setItem("factoryVisitShown", "true");
          window.removeEventListener("scroll", handleScroll);
        }
        lastScrollY = sy;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    if (isMobile) {
      const text = `Hello TajAttire Team,\nI would like to visit your factory in Jaipur.\nName: ${formData.name}\nBusiness Type: ${formData.businessType}\nVisit Date: ${formData.date}\nNumber of People: ${formData.people}\nWhatsApp: ${formData.whatsapp}\nPlease confirm my visit. Thank you!`;
      setStatus("redirecting");
      setTimeout(() => {
        window.open(`https://wa.me/917976667197?text=${encodeURIComponent(text)}`, "_blank");
        setStatus("success");
      }, 1000);
    } else {
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
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={isMobile ? { y: "100%" } : { y: 40, opacity: 0 }}
          animate={isMobile ? { y: "0%" } : { y: 0, opacity: 1 }}
          exit={isMobile ? { y: "100%" } : { y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed z-[9000] bottom-0 left-0 right-0 md:bottom-8 md:right-8 md:left-auto md:w-[380px] bg-[#0A0A0A] border-[1.5px] border-[var(--gold)]/40 rounded-t-[16px] md:rounded-[16px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          <button onClick={() => { setVisible(false); sessionStorage.setItem("factoryVisitShown", "true"); }} className="absolute top-6 right-6 text-[var(--gold)] hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          
          <div className="mb-6 pr-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2 font-medium">Exclusive Offer</div>
            <h3 className="font-display text-white text-3xl mb-2">Visit Our Factory in Jaipur</h3>
            <p className="text-white/60 font-body text-[13px] leading-relaxed">See our full catalogue in person, meet the team, and get exclusive walk-in pricing on bulk orders.</p>
          </div>

          {status === "success" ? (
            <div className="py-10 text-center">
              <div className="text-[var(--gold)] mb-4 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
              <p className="text-[var(--gold)] font-medium">Your factory visit request has been sent! We will confirm within 2 hours.</p>
              <button onClick={() => setVisible(false)} className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white font-semibold h-[44px] rounded-lg transition-colors text-[13px]">Close Window</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input required placeholder="Your Name" value={formData.name} onChange={handleChange("name")} className="w-full bg-white/5 border border-[var(--gold)]/20 rounded-lg text-white px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[var(--gold)]/60 placeholder-white/30" />
              
              <select required value={formData.businessType} onChange={handleChange("businessType")} className="w-full bg-[#121212] border border-[var(--gold)]/20 rounded-lg text-white px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[var(--gold)]/60 appearance-none">
                <option value="Retailer">Retailer</option>
                <option value="Boutique Owner">Boutique Owner</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Exporter">Exporter</option>
                <option value="Other">Other</option>
              </select>

              <div className="flex gap-3">
                <input required type="date" min={new Date().toISOString().split("T")[0]} value={formData.date} onChange={handleChange("date")} className="w-[60%] bg-[#121212] border border-[var(--gold)]/20 rounded-lg text-white px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[var(--gold)]/60 [color-scheme:dark]" />
                <select required value={formData.people} onChange={handleChange("people")} className="w-[40%] bg-[#121212] border border-[var(--gold)]/20 rounded-lg text-white px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[var(--gold)]/60 appearance-none">
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5+">5+ People</option>
                </select>
              </div>

              <input required type="tel" placeholder="Your WhatsApp Number" value={formData.whatsapp} onChange={handleChange("whatsapp")} className="w-full bg-white/5 border border-[var(--gold)]/20 rounded-lg text-white px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[var(--gold)]/60 placeholder-white/30" />

              <div className="mt-2">
                <button disabled={status === "loading" || status === "redirecting"} type="submit" className="w-full bg-[#C9A84C] hover:bg-[#b0913c] text-black font-semibold h-[44px] rounded-lg transition-colors flex items-center justify-center text-[13px]">
                  {status === "loading" ? "Processing..." : status === "redirecting" ? "Redirecting..." : isMobile ? "Book via WhatsApp" : "Request Factory Visit"}
                </button>
                {status === "redirecting" && <p className="text-[11px] text-emerald mt-2 text-center">Redirecting to WhatsApp to confirm your visit!</p>}
                {status === "error" && (
                  <p className="text-[11px] text-red-500 mt-2 text-center">Something went wrong. Please <a href="https://wa.me/917976667197" target="_blank" className="underline text-emerald">try WhatsApp instead.</a></p>
                )}
                <p className="text-[10px] text-[var(--gold)]/50 text-center mt-2 font-medium tracking-wide">We confirm visits within 2 hours on WhatsApp</p>
              </div>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

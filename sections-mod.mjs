import fs from 'fs';
let content = fs.readFileSync('src/components/site/Sections.tsx', 'utf8');

// 1. Z-index of FloatingWhatsApp
content = content.replace('z-[8000]', 'z-[7000]');

// 2. Hero ambient dots
const heroDots = `  const floatingDots = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: \`dot-\${i}\`,
    left: 10 + Math.random() * 80,
    top: 20 + Math.random() * 60,
    size: Math.random() * 2 + 2,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 5,
  })), []);`;
content = content.replace(/const particles = useMemo[\s\S]*?\)\), \[\]\);/, heroDots);

const heroJSX = `      {/* Ambient Floating Dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {floatingDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-[#C9A84C]"
            style={{ left: \`\${dot.left}%\`, top: \`\${dot.top}%\`, width: dot.size, height: dot.size }}
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
      </div>`;
content = content.replace(/\{\/\* Particles \*\/\}[\s\S]*?<\/div>/, heroJSX);

// 3. Statement section
const statementBlock = `export function Statement() {
  const words = \`"We don't just make clothes. We build the inventory that builds your business."\`.split(" ");
  return (
    <section className="relative bg-deep-black grain py-40 overflow-hidden">
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
                    transition: {
                      opacity: { duration: 0.6, delay: i * 0.05 },
                      y: { duration: 0.6, ease: "easeOut", delay: i * 0.05 },
                      color: isHighlight ? { duration: 0.6, delay: 0.8 + (["clothes", "inventory", "business"].indexOf(cleanWord) * 0.4) } : {},
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
}`;
content = content.replace(/export function Statement\(\) \{[\s\S]*?\}\n/, statementBlock.trim() + '\n');

// 4. Collections Parallax Text
const collectionsTitle = `const textX = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  return (`;
content = content.replace(/const hintOpacity = useTransform\(smoothProgress, \[0, 0\.1\], \[1, 0\]\);\s*return \(/, collectionsTitle + '\n    const hintOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);');
content = content.replace(/<h3 className=\{`font-display text-cloud font-light mb-5 leading-tight \$\{isMobile \? 'text-\[clamp\(2rem,8vw,5rem\)\]' : 'text-5xl md:text-7xl'\}`\}>\{c\.title\}<\/h3>/, 
  `<motion.h3 style={{ x: textX }} className={\`font-display text-cloud font-light mb-5 leading-tight \${isMobile ? 'text-[clamp(2rem,8vw,5rem)]' : 'text-5xl md:text-7xl'}\`}>{c.title}</motion.h3>`);

// 5. Why counter badges
content = content.replace(/const whys = \[([\s\S]*?)\];/, `const whys = [
  { n: "01", title: "MOQ That Respects Your Reality", copy: "100 pieces minimum. Not 500. Not 1,000. We know what it takes to start, and we built our model around your actual business — not an ideal version of it.", big: true, badge: "100 pcs" },
  { n: "02", title: "Pricing Built for Profitable Retail", copy: "Wholesale rates from ₹180 per piece. Margins that let you compete, grow, and still sleep at night.", big: true, badge: "₹180" },
  { n: "03", title: "Craft You Can Stake Your Name On", copy: "Double quality-checked before dispatch. Your customers judge you — we make sure you pass.", big: false, badge: "2x checked" },
  { n: "04", title: "Pan-India. On Time. Every Time.", copy: "20+ states. Reliable dispatch windows. Because your restock cycle is a business commitment, not a suggestion.", big: false, badge: "20+ states" },
];`);

const whyBadge = `                <span className="absolute top-4 right-6 outline-num text-7xl opacity-40">{w.n}</span>
                <motion.div 
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 + i * 0.15 }}
                  className="absolute -top-3 -right-3 border border-[var(--gold)] bg-[#0A2416] text-[var(--gold)] text-[10px] uppercase font-bold py-1.5 px-3 rounded-full"
                >
                  {w.badge}
                </motion.div>`;
content = content.replace(/<span className="absolute top-4 right-6 outline-num text-7xl opacity-40">\{w\.n\}<\/span>/, whyBadge);

const whyBadgeSmall = `                <span className="absolute top-3 right-5 outline-num text-5xl opacity-40">{w.n}</span>
                <motion.div 
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.9 + i * 0.15 }}
                  className="absolute -top-3 -right-3 border border-[var(--gold)] bg-[#0A2416] text-[var(--gold)] text-[10px] uppercase font-bold py-1.5 px-3 rounded-full"
                >
                  {w.badge}
                </motion.div>`;
content = content.replace(/<span className="absolute top-3 right-5 outline-num text-5xl opacity-40">\{w\.n\}<\/span>/, whyBadgeSmall);

// 6. Stats section background grid pulse
const statsGrid = `      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />
      <motion.div 
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          background: "radial-gradient(circle at center, rgba(201,168,76,0.08) 2px, transparent 2px)", 
          backgroundSize: "60px 60px" 
        }} 
      />`;
content = content.replace(/<div\s+className="absolute inset-0 opacity-\[0\.04\]"\s+style={{ backgroundImage: "linear-gradient[\s\S]*? \/>/, statsGrid);

// 7. How it works step number glow
content = content.replace(/<div className="outline-num text-6xl md:text-8xl mb-6 pl-8">\{s\.n\}<\/div>/g, 
  `<motion.div 
    animate={{ textShadow: ["0 0 40px rgba(201,168,76,0.0)", "0 0 40px rgba(201,168,76,0.15)", "0 0 40px rgba(201,168,76,0.0)"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className="outline-num text-6xl md:text-8xl mb-6 pl-8"
  >{s.n}</motion.div>`);

// 8. Testimonial cards float
content = content.replace(/className={\`sticky z-10 bg-\[#0A2416\] shadow-\[0_-15px_30px_rgba\(0,0,0,0\.4\)\] border border-\[var\(--gold\)\]\/20 border-l-2 border-l-\[var\(--gold\)\] p-8 \$\{i === 1 \? "md:mt-12" : ""\} \$\{i === 2 \? "md:mt-6" : ""\}\`}/, 
  `className={\`sticky z-10 bg-[#0A2416] shadow-[0_-15px_30px_rgba(0,0,0,0.4)] border border-[var(--gold)]/20 border-l-2 border-l-[var(--gold)] p-8 \${i === 1 ? "md:mt-12" : ""} \${i === 2 ? "md:mt-6" : ""}\`}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: i * 1.3 }}`);

// 9. Footer reveal curtain
const footerCurtain = `<footer id="connect" className="relative bg-deep-black grain pt-24 pb-8 overflow-hidden">
      <motion.div 
        initial={{ scaleY: 1 }} whileInView={{ scaleY: 0 }} viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "bottom" }}
        className="absolute inset-0 z-50 bg-[#1A5C38]"
      />`;
content = content.replace(/<footer id="connect" className="relative bg-deep-black grain pt-24 pb-8 overflow-hidden">/, footerCurtain);


fs.writeFileSync('src/components/site/Sections.tsx', content);
console.log("Sections rewritten.");

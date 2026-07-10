import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Knowledge base: keyword → answer ── */
const KB = [
  {
    keys: ["moq", "minimum", "order", "quantity", "pieces", "units"],
    answer:
      "Our MOQ is 100 pieces per style for catalogue designs, and 200 pieces for custom/private label orders.",
  },
  {
    keys: ["price", "pricing", "cost", "rate", "rupee", "₹", "wholesale", "cheap", "afford"],
    answer:
      "Wholesale prices start from ₹180 per piece for kurtis. Gowns and embroidered styles range higher. WhatsApp us for a detailed rate card.",
  },
  {
    keys: ["kurti", "kurtis", "cotton", "rayon", "printed", "embroidered"],
    answer:
      "We have 180+ kurti designs — cotton, rayon, georgette, linen. Available in printed, embroidered, and solid variants. All ready for wholesale dispatch.",
  },
  {
    keys: ["gown", "gowns", "floor", "anarkali", "evening"],
    answer:
      "Our gown range has 80+ designs — floor-length, anarkali, occasion-ready silhouettes that retail exceptionally well.",
  },
  {
    keys: ["top", "tops", "contemporary", "blouse", "tunic"],
    answer:
      "120+ contemporary tops across versatile silhouettes. Our best-selling everyday items that keep your customers returning season after season.",
  },
  {
    keys: ["custom", "private", "label", "white", "oem", "bespoke", "own label"],
    answer:
      "Yes! Full private label manufacturing available — your design, your branding, your labels. MOQ: 200 pieces. Share references on WhatsApp for a quote within 24 hours.",
  },
  {
    keys: ["sample", "samples", "trial", "test"],
    answer:
      "Yes, samples are available at a nominal charge — fully adjustable against your first bulk order. Drop us a WhatsApp with the design you'd like to test.",
  },
  {
    keys: ["deliver", "delivery", "shipping", "dispatch", "lead time", "days", "speed"],
    answer:
      "Catalogue orders: 7–15 days. Custom orders: 20–30 days. We ship pan-India (20+ states) via Delhivery, Bluedart, and DTDC.",
  },
  {
    keys: ["payment", "advance", "terms", "pay", "transfer", "upi", "neft"],
    answer:
      "Our terms are 50% advance on confirmation + 50% before dispatch. We accept NEFT/RTGS/IMPS and UPI.",
  },
  {
    keys: ["quality", "check", "defect", "return", "guarantee", "assurance"],
    answer:
      "Every piece is double quality-checked before dispatch. Any defective items are replaced in the next order. Your reputation is our guarantee.",
  },
  {
    keys: ["contact", "phone", "whatsapp", "email", "reach", "speak", "talk", "call"],
    answer:
      "Reach us on WhatsApp: +91 79766 67197 or email: connect.tajattire@gmail.com. We respond within 2 business hours, Mon–Sat.",
  },
  {
    keys: ["location", "address", "jaipur", "visit", "factory", "showroom", "where"],
    answer:
      "We're in Jaipur, India. Our factory welcomes retail buyers — browse 500+ designs live. Book a slot via WhatsApp or the visit form on our site.",
  },
  {
    keys: ["fabric", "material", "cloth", "textile"],
    answer:
      "We work with cotton, rayon, georgette, crepe, linen, and blended fabrics. Custom fabric sourcing is available for larger orders.",
  },
  {
    keys: ["packaging", "pack", "box", "bag", "hang tag"],
    answer:
      "Standard: biodegradable polybag + carton. For private label orders — custom woven labels, hang tags, and branded cartons at an additional cost.",
  },
  {
    keys: ["about", "history", "established", "since", "founded", "tajattire", "who are you"],
    answer:
      "TajAttire is a Jaipur-based wholesale fashion manufacturer established in 2004 — two decades of supplying retailers across India with kurtis, gowns, and tops.",
  },
  {
    keys: ["process", "start", "begin", "how", "step", "order process"],
    answer:
      "Simple 3 steps: 1) Fill the enquiry form or WhatsApp your requirements. 2) We quote within 2 hours. 3) Confirm, pay advance, we dispatch on schedule.",
  },
];

const CHIPS = [
  "What's your MOQ?",
  "Starting price?",
  "Custom orders?",
  "Samples available?",
  "Delivery time?",
  "Visit factory?",
];

const GREETING =
  "Hello — I'm here to help with anything about TajAttire. Pick a question below or type your own.";
const FALLBACK =
  "I don't have a specific answer for that, but our team would love to help! WhatsApp us at +91 79766 67197 or email connect.tajattire@gmail.com — we respond within 2 business hours.";

function getAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const item of KB) {
    if (item.keys.some((k) => lower.includes(k))) {
      return item.answer;
    }
  }
  return FALLBACK;
}

type Message = { from: "user" | "bot"; text: string };

export function AiHelpAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [iconPhase, setIconPhase] = useState(0); // 0=leaf, 1="ASK"
  const endRef = useRef<HTMLDivElement>(null);

  /* Morph button every 2 s */
  useEffect(() => {
    const t = setInterval(() => setIconPhase((p) => (p + 1) % 2), 2000);
    return () => clearInterval(t);
  }, []);

  /* Scroll to latest message */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Android back-button support */
  useEffect(() => {
    if (open) {
      window.history.pushState({ chatOpen: true }, "");
    }
    const handler = (e: PopStateEvent) => {
      if (open && (e.state as Record<string, unknown>)?.chatOpen) {
        setOpen(false);
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { from: "user", text }]);
    setInput("");
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        setMessages((p) => [...p, { from: "bot", text: getAnswer(text) }]);
      },
      700 + Math.random() * 400,
    );
  };

  return (
    <>
      {/* ── Morphing trigger button ── */}
      <motion.button
        id="ai-help-trigger"
        onClick={() => setOpen((p) => !p)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="fixed z-[7999] bottom-[80px] left-[20px] md:bottom-[28px] md:left-[28px] w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-full bg-[var(--emerald-deep)] shadow-[0_4px_20px_rgba(26,92,56,0.5)] flex items-center justify-center border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all duration-300"
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait">
          {iconPhase === 0 ? (
            <motion.svg
              key="hanger"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Clothes hanger */}
              <path d="M12 3a2 2 0 0 1 0 4" />
              <path d="M12 7L3.5 17h17L12 7z" />
              <line x1="12" y1="3" x2="12" y2="7" />
            </motion.svg>
          ) : (
            <motion.span
              key="rupee"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
              className="text-[var(--gold)] text-[13px] font-bold"
            >
              ₹
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="ai-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[7998] bg-[#0A0A0A] border border-[var(--gold)]/20 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.7)]
                       bottom-0 left-0 right-0 rounded-t-[20px] flex flex-col
                       md:bottom-[96px] md:left-[28px] md:right-auto md:w-[340px] md:rounded-[16px]"
            style={{ maxHeight: "72vh", minHeight: "360px" }}
          >
            {/* Mobile drag handle */}
            <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Gold top accent line */}
            <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--gold)]/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--emerald-deep)] border border-[var(--gold)]/40 flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c2.8 0 8-1.5 10-8C18 3.5 14 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[var(--cloud)] text-[13px] font-medium leading-none mb-1">
                    TajAttire Assistant
                  </div>
                  <div className="text-[var(--gold)] text-[10px] uppercase tracking-wider">
                    Online · Instant answers
                  </div>
                </div>
              </div>
              <button
                id="ai-chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                      msg.from === "user"
                        ? "bg-[var(--emerald-deep)] text-[var(--cloud)] rounded-tr-sm"
                        : "bg-[#1a1a1a] text-[var(--cloud)]/90 border border-white/5 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion chips — show only on first message */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      className="px-3 py-1.5 rounded-full border border-[var(--gold)]/30 text-[var(--gold)] text-[11px] hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all duration-200"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 pb-5 pt-3 border-t border-[var(--gold)]/10 flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  id="ai-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-4 py-2.5 text-[13px] text-[var(--cloud)] placeholder:text-white/30 focus:outline-none focus:border-[var(--gold)]/40 transition-colors"
                />
                <button
                  id="ai-chat-send"
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="w-10 h-10 rounded-full bg-[var(--gold)] text-[var(--deep-black)] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12L12 7 2 2M12 7H2" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

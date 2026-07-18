import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackToClose } from "@/hooks/useBackToClose";

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
      "Reach us on WhatsApp: +91 79766 67197 or email: info@tajattire.in. We respond within 2 business hours, Mon–Sat.",
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

/* ── Smalltalk: word-boundary matched so short words like "hi" never
   collide with substrings inside real answers (e.g. "shipping"). Checked
   only after the business KB above finds no match. ── */
const SMALLTALK: { pattern: RegExp; answer: string }[] = [
  {
    pattern: /\b(good\s?morning|good\s?afternoon|good\s?evening|good\s?night)\b/,
    answer:
      "Good day to you too! 🙌 Looking for wholesale kurtis, gowns, or tops? I can get you pricing and MOQ in seconds — or tap 'WhatsApp Us' to talk to our team right now.",
  },
  {
    pattern: /\b(hi+|hii|hiya|hello+|hey+|heya|yo|namaste|greetings)\b/,
    answer:
      "Hey there! 👋 Welcome to TajAttire — India's wholesale home for kurtis, gowns & tops since 2004. Ask me about pricing, MOQ, or samples, or tap 'WhatsApp Us' below to talk to our team right now.",
  },
  {
    pattern: /\b(bye|goodbye|good\s?bye|see\s?ya|see\s?you|cya|take\s?care|gtg|got\s?to\s?go)\b/,
    answer:
      "Thanks for stopping by! Whenever you're ready, WhatsApp us at +91 79766 67197 or tap 'Request Catalogue' — we'll have your wholesale quote ready within hours. 👋",
  },
  {
    pattern: /\b(thanks|thank\s?you|thx|thnx|appreciate\s?it|much\s?appreciated)\b/,
    answer:
      "You're most welcome! If you're ready to move forward, tap 'Enquire Now' or WhatsApp us — we'll get your wholesale quote started right away.",
  },
  {
    pattern: /\bhow\s?(are|r)\s?(you|u)\b|\bhow'?s\s?it\s?going\b|\bwhat'?s\s?up\b|\bwassup\b|\bsup\b/,
    answer:
      "Doing great, thanks for asking! More importantly — what can I help you with today? Pricing, MOQ, or samples?",
  },
  {
    pattern: /\bwho\s?are\s?you\b|\bwhat\s?are\s?you\b|\bare\s?you\s?(a\s?)?(bot|human|real|ai)\b/,
    answer:
      "I'm the TajAttire Assistant — here for instant answers on pricing, MOQ, and orders, any time of day. For anything more detailed, our real team is one WhatsApp message away at +91 79766 67197.",
  },
  {
    pattern: /\bwhat\s?can\s?you\s?do\b|\bcan\s?you\s?help\b|\bwhat\s?do\s?you\s?do\b|\bhelp\s?me\b/,
    answer:
      "I can help with pricing, MOQ, samples, delivery timelines, and custom/private label orders — try a quick question below, or type what you need. For anything urgent, WhatsApp us directly.",
  },
  {
    pattern: /\b(ok|okay|k|cool|nice|great|alright|sure|awesome|perfect)\b/,
    answer:
      "Glad to hear it! Want pricing or MOQ details next — or would you rather WhatsApp our team directly to get moving?",
  },
  {
    pattern: /\b(sorry|apologi[sz]e|my\s?bad)\b/,
    answer:
      "No worries at all! Let's get you sorted — ask me about pricing, MOQ, or samples, or WhatsApp us at +91 79766 67197 anytime.",
  },
];

const GREETING =
  "Hello — I'm here to help with anything about TajAttire. Pick a question below or type your own.";
const FALLBACK =
  "I don't have a specific answer for that, but our team would love to help! WhatsApp us at +91 79766 67197 or email info@tajattire.in — we respond within 2 business hours.";

function getAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const item of KB) {
    if (item.keys.some((k) => lower.includes(k))) {
      return item.answer;
    }
  }
  for (const item of SMALLTALK) {
    if (item.pattern.test(lower)) {
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
  const endRef = useRef<HTMLDivElement>(null);

  /* Scroll to latest message */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Android/browser back-button support — closes the chat instead of leaving the site */
  useBackToClose(open, () => setOpen(false));

  /* Lets the mobile bottom action bar trigger this chat without prop-drilling shared state */
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("tajattire:open-ai-chat", handler);
    return () => window.removeEventListener("tajattire:open-ai-chat", handler);
  }, []);

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
      {/* ── Trigger button — desktop only; mobile uses the "Instant Help" segment in the bottom action bar ── */}
      <motion.button
        id="ai-help-trigger"
        onClick={() => setOpen((p) => !p)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-cursor="Chat"
        className="hidden md:flex fixed z-[7999] md:bottom-[168px] md:right-[28px] items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-[var(--emerald-deep)] shadow-[0_4px_20px_rgba(26,92,56,0.5)] border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all duration-300"
        aria-label="Get instant help from our team"
      >
        <span className="relative flex-shrink-0 w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-[var(--gold)] pointer-events-none"
               style={{ animation: 'pulse-ring-ai 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
          <motion.svg
            animate={{ scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="z-10"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <circle cx="8.5" cy="11.5" r="0.9" fill="var(--gold)" stroke="none" />
            <circle cx="12" cy="11.5" r="0.9" fill="var(--gold)" stroke="none" />
            <circle cx="15.5" cy="11.5" r="0.9" fill="var(--gold)" stroke="none" />
          </motion.svg>
          {/* Online indicator */}
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[var(--emerald-deep)] z-10"
          />
        </span>
        <span className="text-[var(--gold)] text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap">Instant Help</span>
        <style>{`
          @keyframes pulse-ring-ai {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.7); opacity: 0; }
          }
        `}</style>
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
            className="fixed z-[8600] bg-[#0A0A0A] border border-[var(--gold)]/20 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.7)]
                       bottom-0 left-0 right-0 rounded-t-[20px] flex flex-col
                       md:bottom-[28px] md:right-[28px] md:left-auto md:w-[340px] md:rounded-[16px]"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3" data-lenis-prevent>
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

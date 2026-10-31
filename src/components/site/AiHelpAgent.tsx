import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackToClose } from "@/hooks/useBackToClose";
import terms from "@/data/terms.json";
import { waLink, mailLink, PHONE_DISPLAY, EMAIL, FOUNDED_YEAR } from "@/lib/contact";
import { OPEN_CHAT_EVENT, CHAT_STATE_EVENT } from "./Dock";
import { IconClose, IconWhatsApp, IconMail } from "./icons";

const cats = terms.categories
  .map((c) => c.name.toLowerCase())
  .join(", ")
  .replace(/, ([^,]*)$/, " and $1");

/* ── Knowledge base, in the owner's own terms (src/data/terms.json + FAQ) ── */
const KB: { keys: string[]; answer: string }[] = [
  {
    keys: ["moq", "minimum", "min order", "quantity", "how many pieces", "pieces"],
    answer: `Our minimum is ${terms.defaultCategory.moq} per style for catalogue designs. For custom and private-label orders it's ${terms.custom.moq} per design.`,
  },
  {
    keys: ["price", "pricing", "cost", "rate", "rupee", "₹", "cheap", "afford", "how much"],
    answer: `Wholesale prices start from ${terms.startingPrice} per piece for kurtis. Gowns and tops vary with fabric and design. Ask on WhatsApp and we'll send the current rate card.`,
  },
  {
    keys: ["kurti", "kurtis", "cotton", "rayon", "printed", "embroidered"],
    answer:
      "We make kurtis in cotton, rayon, georgette and linen — printed, embroidered and solid. Every style is available for wholesale from 100 pieces.",
  },
  {
    keys: ["gown", "gowns", "floor", "anarkali", "evening"],
    answer:
      "Our gowns include floor-length and anarkali silhouettes for occasion wear. They follow the same 100-piece minimum per style.",
  },
  {
    keys: ["top", "tops", "contemporary", "blouse", "tunic"],
    answer:
      "We make contemporary everyday tops and tunics in a range of fabrics. The minimum is 100 pieces per style.",
  },
  {
    keys: [
      "custom",
      "private",
      "label",
      "white label",
      "oem",
      "bespoke",
      "own brand",
      "branding",
      "logo",
    ],
    answer: `Yes, we do private label: your design, labels, hang tags and packaging. The minimum is ${terms.custom.moq} per design and production takes ${terms.custom.leadTime}. Share references on WhatsApp for a quote within 24 hours.`,
  },
  {
    keys: ["sample", "samples", "trial", "test piece"],
    answer:
      "Samples are available at a nominal charge, which is adjusted against your first bulk order. WhatsApp us the design you'd like to see.",
  },
  {
    keys: [
      "deliver",
      "delivery",
      "shipping",
      "ship",
      "dispatch",
      "lead time",
      "days",
      "how long",
      "courier",
    ],
    answer: `Catalogue orders take ${terms.defaultCategory.leadTime}. Custom orders take ${terms.custom.leadTime}. We ship across India with ${terms.couriers}.`,
  },
  {
    keys: ["payment", "advance", "terms", "pay", "transfer", "upi", "neft", "rtgs", "imps"],
    answer: `Our terms are ${terms.payment}.`,
  },
  {
    keys: ["quality", "check", "defect", "damaged", "return", "replace", "guarantee"],
    answer:
      "Every dispatch is quality-checked twice before it leaves us. If a piece is defective, we replace it in your next order.",
  },
  {
    keys: ["contact", "phone", "number", "whatsapp", "email", "reach", "speak", "talk", "call"],
    answer: `WhatsApp or call us on ${PHONE_DISPLAY}, or email ${EMAIL}. We reply ${terms.responseTime}.`,
  },
  {
    keys: ["hours", "timing", "open", "sunday", "saturday", "working"],
    answer: `Our team replies ${terms.responseTime}. Messages sent outside those hours are answered the next working day.`,
  },
  {
    keys: ["location", "address", "jaipur", "visit", "factory", "showroom", "where"],
    answer:
      "We're in Jaipur, Rajasthan. Buyers are welcome to visit our production unit by appointment — book a slot on WhatsApp.",
  },
  {
    keys: ["fabric", "material", "cloth", "textile", "georgette", "crepe", "linen"],
    answer:
      "We work with cotton, rayon, georgette, crepe, linen and blends. For larger orders we can source fabric to your specification.",
  },
  {
    keys: ["packaging", "pack", "box", "polybag", "hang tag"],
    answer:
      "Standard orders ship in polybags and cartons. Private-label orders can have woven labels, hang tags, printed polybags and branded cartons.",
  },
  {
    keys: ["about", "history", "established", "since", "founded", "who are you", "company"],
    answer: `TajAttire is a wholesale manufacturer in Jaipur, established in ${FOUNDED_YEAR}. We make ${cats} for retailers and boutiques across India.`,
  },
  {
    keys: [
      "process",
      "start",
      "begin",
      "how do i order",
      "order process",
      "place an order",
      "first order",
    ],
    answer:
      "It's three steps. Send your requirements by WhatsApp or the enquiry form. We reply with pricing within 2 business hours. Then you confirm, pay the advance and we dispatch on schedule.",
  },
  {
    keys: ["catalogue", "catalog", "lookbook", "pdf", "designs", "collection"],
    answer: `We have ${terms.designCount} designs. Browse the catalogue page, or ask on WhatsApp for the latest lookbook.`,
  },
];

const SMALLTALK: { pattern: RegExp; answer: string }[] = [
  {
    pattern: /\b(good\s?(morning|afternoon|evening))\b/,
    answer: "Good day to you too! Ask me about minimums, prices, samples or delivery times.",
  },
  {
    pattern: /\b(hi+|hello+|hey+|namaste|greetings)\b/,
    answer:
      "Hello! I can help with minimum orders, prices, samples, custom orders and delivery. What would you like to know?",
  },
  {
    pattern: /\b(thanks|thank\s?you|thx|appreciate)\b/,
    answer:
      "You're welcome! When you're ready, tap WhatsApp below and our team will take it from there.",
  },
  {
    pattern: /\b(bye|goodbye|see\s?you|take\s?care)\b/,
    answer: `Thanks for stopping by. You can always reach us on ${PHONE_DISPLAY}.`,
  },
  {
    pattern: /\b(are\s?you\s?(a\s?)?(bot|human|real|ai))\b|\bwho\s?are\s?you\b/,
    answer:
      "I'm TajAttire's quick-answer assistant. For anything detailed, our team is one WhatsApp message away.",
  },
];

const CHIPS = [
  "Minimum order?",
  "Starting price?",
  "Custom orders?",
  "Samples?",
  "Delivery time?",
  "Payment terms?",
];

const GREETING = "Hi! Ask me anything about ordering from TajAttire — or pick a question below.";
const HANDOFF =
  "That's a good one for our team. Tap WhatsApp or email below and your question goes straight to them.";

type Reply = { text: string; handoff: boolean };
/** Short words match whole words only, so "top" doesn't fire on "stop". */
const matches = (text: string, key: string) =>
  key.length <= 4 && /^[a-z]+$/.test(key)
    ? new RegExp(`\\b${key}s?\\b`).test(text)
    : text.includes(key);
function answerFor(input: string): Reply {
  const lower = input.toLowerCase();
  for (const item of KB)
    if (item.keys.some((k) => matches(lower, k))) return { text: item.answer, handoff: false };
  for (const item of SMALLTALK)
    if (item.pattern.test(lower)) return { text: item.answer, handoff: false };
  return { text: HANDOFF, handoff: true };
}

const splitSentences = (t: string) =>
  t.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)?.map((s) => s.trim()) ?? [t];

type Message = { id: number; from: "user" | "bot"; text: string; handoffFor?: string };

const THINK_MS = 2800; // "writing…" pause
const SENTENCE_MS = 650;

export function AiHelpAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextId = useRef(1);

  useBackToClose(open, () => setOpen(false));

  useEffect(() => {
    const onOpen = () => setOpen((v) => !v);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(CHAT_STATE_EVENT, { detail: open }));
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Keep the newest message in view (scrolls the panel only, never the page)
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, 300);
      if (!text || typing) return;
      setMessages((p) => [...p, { id: nextId.current++, from: "user", text }]);
      setInput("");
      setTyping(true);
      const reply = answerFor(text);
      const parts = splitSentences(reply.text);
      const id = nextId.current++;
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          parts.forEach((_, i) => {
            timers.current.push(
              setTimeout(() => {
                const shown = parts.slice(0, i + 1).join(" ");
                setMessages((p) => {
                  const rest = p.filter((m) => m.id !== id);
                  const done = i === parts.length - 1;
                  return [
                    ...rest,
                    {
                      id,
                      from: "bot",
                      text: shown,
                      handoffFor: done && reply.handoff ? text : undefined,
                    },
                  ];
                });
              }, i * SENTENCE_MS),
            );
          });
        }, THINK_MS),
      );
    },
    [typing],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          id="ai-chat-panel"
          role="dialog"
          aria-label="TajAttire quick answers"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => open && inputRef.current?.focus({ preventScroll: true })}
          style={{
            bottom: "calc(var(--dock-h) + 10px)",
            transformOrigin: "bottom center",
            willChange: "transform, opacity",
          }}
          className="fixed z-[75] left-3 right-3 sm:left-auto sm:right-6 sm:w-[360px] flex flex-col overflow-hidden rounded-[20px] bg-[#0C0E0D] border border-[var(--gold)]/20 shadow-[0_24px_64px_rgba(0,0,0,0.55)] max-h-[min(70vh,560px)]"
        >
          <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.07] shrink-0">
            <div className="flex items-center gap-3">
              <span className="dock-orb" aria-hidden="true">
                <span className="dock-orb-core" />
              </span>
              <div>
                <p className="text-cloud text-[13px] font-medium leading-tight">Quick answers</p>
                <p className="text-cloud/45 text-[11px] leading-tight">
                  From TajAttire's own terms · team on WhatsApp
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="w-9 h-9 rounded-full grid place-items-center text-cloud/60 hover:text-cloud active:scale-95"
            >
              <IconClose size={16} />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 min-h-[180px] overflow-y-auto overscroll-contain px-4 py-4 space-y-3"
            data-lenis-prevent
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.from === "user"
                      ? "bg-[var(--emerald-deep)] text-cloud rounded-br-md"
                      : "bg-white/[0.06] text-cloud/90 rounded-bl-md"
                  }`}
                >
                  {m.text}
                  {m.handoffFor && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <a
                        href={waLink(`Hi TajAttire, a question from your website: ${m.handoffFor}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-white px-3 py-1.5 text-[11px] font-semibold"
                      >
                        <IconWhatsApp size={13} /> WhatsApp
                      </a>
                      <a
                        href={mailLink("Question from the website", m.handoffFor)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 text-cloud px-3 py-1.5 text-[11px] font-semibold"
                      >
                        <IconMail size={13} /> Email
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-white/[0.06] px-3.5 py-2.5 text-[12px] text-cloud/55 flex items-center gap-2">
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/70 animate-pulse"
                        style={{ animationDelay: `${i * 160}ms` }}
                      />
                    ))}
                  </span>
                  writing…
                </div>
              </div>
            )}
            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => send(c)}
                    className="rounded-full border border-[var(--gold)]/30 text-[var(--gold)] px-3 py-1.5 text-[11px] active:scale-95 transition-transform"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 px-3 pt-2.5 border-t border-white/[0.07] shrink-0"
            style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
          >
            <label htmlFor="ai-chat-input" className="sr-only">
              Your question
            </label>
            <input
              id="ai-chat-input"
              ref={inputRef}
              value={input}
              maxLength={300}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              autoComplete="off"
              enterKeyHint="send"
              className="flex-1 min-w-0 rounded-full bg-white/[0.06] border border-white/10 px-4 py-2.5 text-[16px] sm:text-[13px] text-cloud placeholder:text-white/35 focus:outline-none focus:border-[var(--gold)]/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send"
              className="w-11 h-11 shrink-0 rounded-full bg-[var(--gold)] text-[var(--deep-black)] grid place-items-center disabled:opacity-40"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M2 12L12 7 2 2M12 7H2" />
              </svg>
            </button>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

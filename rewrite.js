const fs = require('fs');

const file = 'src/components/site/Sections.tsx';
const content = fs.readFileSync(file, 'utf8');

const newCode = `
/* ─────────── INQUIRY FORM ─────────── */
export function Inquiry() {
  const [interests, setInterests] = useState<string[]>([]);
  const toggle = (v: string) => setInterests((p) => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const [formData, setFormData] = useState({ name: "", business: "", city: "", whatsapp: "", quantity: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          subject: "New Bulk Order Enquiry — TajAttire",
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
  };

  const resetForm = () => {
    setFormData({ name: "", business: "", city: "", whatsapp: "", quantity: "" });
    setInterests([]);
    setStatus("idle");
  };

  return (
    <section id="order" className="relative bg-[#F8F6F1] flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/2 relative min-h-[500px] md:min-h-screen bg-[#1A5C38] flex items-center justify-center">
        <img src="/hero.jpg" alt="Indian Fashion Editorial" className="absolute inset-0 w-full h-full object-cover" />
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
                    <button key={o} type="button" onClick={() => toggle(o)} className={`px-5 py-2 text-xs border transition-all ${interests.includes(o) ? "bg-[#C9A84C] text-black border-[#C9A84C]" : "border-[#C9A84C] text-charcoal"}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="text-[11px] uppercase tracking-[0.1em] text-charcoal/70 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Approximate Quantity</label>
                <input required value={formData.quantity} onChange={handleChange("quantity")} placeholder="e.g. 100 pieces" className="w-full bg-transparent border-b-[1.5px] border-[var(--gold)]/30 py-2.5 text-[14px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-[#C9A84C] transition-colors" />
              </div>

              <div className="pt-4">
                <button disabled={status === "loading"} type="submit" className="w-full bg-[#1A5C38] text-white h-[52px] font-semibold text-[12px] tracking-widest hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-400">
                  {status === "loading" ? "PROCESSING..." : "SEND ENQUIRY →"}
                </button>
                {status === "error" && (
                  <div className="mt-4 border border-red-500 p-3 text-[12px] text-red-600">
                    Something went wrong. Please email us directly at orders@tajattire.com
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
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [formData, setFormData] = useState({
    name: "", businessType: "Retailer", date: "", people: "1", whatsapp: ""
  });

  useEffect(() => {
    if (sessionStorage.getItem("factoryVisitShown")) return;
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
          className="fixed z-[9000] bottom-0 left-0 right-0 md:bottom-8 md:right-8 md:left-auto md:w-[380px] bg-[#0A0A0A] rounded-t-[16px] md:rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          
          <div className="p-7 relative">
            <button onClick={() => { setVisible(false); sessionStorage.setItem("factoryVisitShown", "true"); }} className="absolute top-6 right-6 text-[var(--gold)] hover:text-white transition-colors">
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
                  <label className="text-[10px] uppercase text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Your Name</label>
                  <input required value={formData.name} onChange={handleChange("name")} className="w-full bg-transparent border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors text-[13px]" />
                </div>
                
                <div className="group">
                  <label className="text-[10px] uppercase text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Business Type</label>
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
                    <label className="text-[10px] uppercase text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Preferred Visit Date</label>
                    <input required type="date" min={new Date().toISOString().split("T")[0]} value={formData.date} onChange={handleChange("date")} className="w-full bg-[#0A0A0A] border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors text-[13px] [color-scheme:dark]" />
                  </div>
                  <div className="group w-[40%]">
                    <label className="text-[10px] uppercase text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">People</label>
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
                  <label className="text-[10px] uppercase text-white/50 block mb-1 group-focus-within:text-[#C9A84C] transition-colors">Your WhatsApp Number</label>
                  <input required type="tel" value={formData.whatsapp} onChange={handleChange("whatsapp")} className="w-full bg-transparent border-b border-[var(--gold)]/25 text-white py-2 focus:outline-none focus:border-[#C9A84C] transition-colors text-[13px]" />
                </div>

                <div className="mt-4">
                  <button disabled={status === "loading"} type="submit" className="w-full bg-[#C9A84C] text-[#0A0A0A] h-[44px] font-semibold text-[11px] tracking-widest hover:bg-white hover:text-[#0A0A0A] transition-colors">
                    {status === "loading" ? "PROCESSING..." : "REQUEST FACTORY VISIT →"}
                  </button>
                  {status === "error" && (
                    <div className="mt-3 border border-red-500 p-2 text-[11px] text-red-500 text-center">
                      Something went wrong. Please email us directly at orders@tajattire.com
                    </div>
                  )}
                  <div className="text-center text-[#C9A84C]/40 text-[10px] mt-3">
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

/* ─────────── FLOATING WHATSAPP ─────────── */
export function FloatingWhatsApp() {
  return (
    <a 
      href="https://wa.me/917976667197" 
      target="_blank" 
      rel="noreferrer"
      className="fixed z-[8000] bottom-[80px] right-[20px] md:bottom-[28px] md:right-[28px] w-[50px] h-[50px] md:w-[56px] md:h-[56px] rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)]"
    >
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366] pointer-events-none" 
           style={{ animation: 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
      <svg viewBox='0 0 24 24' fill='white' className="w-[24px] h-[24px] md:w-[26px] md:h-[26px] z-10"><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z'/><path d='M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.874L0 24l6.304-1.653A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.001-1.371l-.36-.214-3.722.976.995-3.63-.234-.373A9.778 9.778 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z'/></svg>
      <style>{\`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      \`}</style>
    </a>
  );
}
`;

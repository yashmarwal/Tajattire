/** Single source of truth for TajAttire's public identity data. Every page,
 * schema block, footer, form and chat answer reads from here so they can
 * never disagree. */
export const SITE_URL = "https://tajattire.in";
export const BRAND = "TajAttire";
export const PHONE_E164 = "+917976667197";
export const PHONE_DISPLAY = "+91 79766 67197";
export const WHATSAPP_NUMBER = "917976667197";
export const EMAIL = "info@tajattire.in";
export const INSTAGRAM_URL = "https://www.instagram.com/tajattire";
export const INSTAGRAM_HANDLE = "@tajattire";
export const CITY = "Jaipur, Rajasthan, India";
export const GSTIN = "08EZDPA6047K1Z9";
export const FOUNDED_YEAR = 2004;

/** Footer developer credit. Left empty until the owner supplies the exact
 * text and WhatsApp number — the footer renders nothing while either is blank. */
export const DEV_CREDIT = {
  text: "",
  whatsapp: "", // digits only, with country code, e.g. "919999999999"
  message: "",
};

export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const mailLink = (subject?: string, body?: string) => {
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const qs = q.toString().replace(/\+/g, "%20");
  return `mailto:${EMAIL}${qs ? `?${qs}` : ""}`;
};

export const telLink = `tel:${PHONE_E164}`;

/** Pre-filled product enquiry asking for pricing and minimum order. */
export const productEnquiryText = (product: string, moq?: string) =>
  `Hi ${BRAND}! I'd like a wholesale quote for:\n\nProduct: ${product}${
    moq ? `\nMinimum order: ${moq}` : ""
  }\n\nPlease share current pricing, minimum order quantity and dispatch time. Thank you!`;

# TajAttire — Wholesale Fashion Website

## Project Overview

TajAttire is a luxury wholesale fashion website for a Jaipur-based kurti and gown brand (Est. 2004). It targets boutique owners and fashion retailers across India looking to stock kurtis, gowns, and contemporary tops at wholesale prices. The site is a single-page React application with cinematic scroll animations, a horizontal collections showcase, an inquiry form, and a factory visit popup.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Smooth Scroll | Lenis 1.3 (desktop only) |
| Form Submission | Web3Forms API |
| Deployment | Vercel |

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

To build for production:

```bash
npm run build
npm run preview
```

## How to Deploy to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Vercel auto-detects Vite. Leave all settings at default.
4. Click **Deploy**.

For subsequent deployments, every push to `main` triggers an automatic redeploy.

## Environment Variables

This project currently has **no environment variables**. The Web3Forms access key is embedded directly in the source code. Before going live with the real key, move it to an environment variable:

```env
VITE_WEB3FORMS_KEY=your_real_key_here
```

Then update the two form submissions in `src/components/site/Sections.tsx` to use `import.meta.env.VITE_WEB3FORMS_KEY`.

## TODO Before Going Live

- [ ] **Replace Web3Forms key** — the current key (`eac902e8-cb07-44ff-b8d0-6fb0785f6ba0`) is a placeholder. Register at [web3forms.com](https://web3forms.com) and replace with the real account key. Both form handlers in `Sections.tsx` are marked with `// TODO: Replace with real Web3Forms key before going live`.
- [ ] **Replace placeholder images** — all catalogue product images use `placehold.co` URLs. Replace with real product photos from TajAttire's catalogue.
- [ ] **Verify WhatsApp number** — the number `917976667197` (+91 79766 67197) is used in WhatsApp links throughout the site. Confirm this is the correct and active business number before launch.
- [ ] **Replace fake GST number** — the footer shows `GST: 07XXXXX1234X1Z5`. Replace with the real GSTIN.
- [ ] **Replace placeholder email** — `connect.tajattire@gmail.com` is used as the contact and error-fallback email. Confirm this is the real monitored inbox, or update to the correct address.

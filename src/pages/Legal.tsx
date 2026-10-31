import type { ReactNode } from "react";
import { PageMeta } from "@/components/site/PageMeta";
import { EMAIL, PHONE_DISPLAY, CITY, GSTIN, mailLink } from "@/lib/contact";
import terms from "@/data/terms.json";

export const LEGAL_UPDATED = "31 October 2026";

export function LegalLayout({
  path,
  eyebrow,
  title,
  intro,
  children,
}: {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageMeta path={path} />
      <article data-bg="light" className="bg-cloud pt-36 md:pt-44 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-5">
            {eyebrow}
          </p>
          <h1 className="font-display text-charcoal font-light leading-[1.05] text-[clamp(2.4rem,6vw,4.5rem)]">
            {title}
          </h1>
          <p className="mt-5 text-charcoal/65 leading-relaxed">{intro}</p>
          <p className="mt-3 text-[12px] text-charcoal/45">Last updated {LEGAL_UPDATED}</p>
          <div className="legal mt-12 space-y-10 text-charcoal/80 leading-relaxed">{children}</div>
        </div>
      </article>
    </>
  );
}

export const H = ({ children }: { children: ReactNode }) => (
  <h2 className="font-display text-charcoal text-2xl md:text-3xl mb-3">{children}</h2>
);

export function PrivacyContent() {
  return (
    <LegalLayout
      path="/privacy"
      eyebrow="Privacy"
      title="Privacy policy"
      intro="TajAttire is a wholesale business. This page explains, in plain words, what happens to the details you share with us through this website."
    >
      <section>
        <H>What we collect</H>
        <p>Only what you choose to send us:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            Enquiry forms: your name, business name, city, WhatsApp number, the products and
            quantities you're interested in, and an optional reference photo.
          </li>
          <li>
            Factory-visit requests: your name, business type, preferred date, number of visitors and
            WhatsApp number.
          </li>
          <li>
            Questions you type into the quick-answer assistant stay in your browser; they are only
            sent to us if you tap WhatsApp or email.
          </li>
        </ul>
      </section>
      <section>
        <H>How we use it</H>
        <p>
          To reply to your enquiry, send prices and catalogues, arrange samples, visits and orders,
          and keep a record of business conversations. We don't sell your details or use them for
          unrelated marketing.
        </p>
      </section>
      <section>
        <H>Services that handle your details</H>
        <ul className="list-disc pl-5 space-y-1">
          <li>Web3Forms — delivers form submissions to our inbox by email.</li>
          <li>
            Supabase — stores a copy of enquiries for our team, and the site's product content.
          </li>
          <li>Vercel — hosts this website.</li>
          <li>WhatsApp, phone and email — only when you choose to contact us that way.</li>
        </ul>
      </section>
      <section>
        <H>Cookies and storage</H>
        <p>
          We don't use advertising or tracking cookies. Your browser stores a few small items for
          the site itself: a cached copy of the site's photo list so pages load faster, and notes
          that you've already seen the intro animation and the visit pop-up this session.
        </p>
      </section>
      <section>
        <H>Keeping and deleting your details</H>
        <p>
          We keep enquiries for as long as we need them to serve you and keep business records. To
          see, correct or delete what we hold about you, email{" "}
          <a
            className="underline underline-offset-4 text-[var(--emerald-deep)]"
            href={mailLink("Privacy request")}
          >
            {EMAIL}
          </a>
          .
        </p>
      </section>
      <section>
        <H>Contact</H>
        <p>
          TajAttire, {CITY} · {PHONE_DISPLAY} · {EMAIL} · GSTIN {GSTIN}
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsContent() {
  return (
    <LegalLayout
      path="/terms"
      eyebrow="Terms"
      title="Terms of trade"
      intro="How we usually work with retail and wholesale buyers. Your written order confirmation sets out the final terms for each order and takes priority over this summary."
    >
      <section>
        <H>Who we sell to</H>
        <p>
          We sell wholesale (business-to-business) to retailers, boutiques and wholesalers. We don't
          sell single pieces to consumers.
        </p>
      </section>
      <section>
        <H>Minimum orders</H>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[420px] text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-charcoal/15 text-[11px] uppercase tracking-[0.14em] text-charcoal/55">
                <th className="py-2 pr-4 font-medium">Range</th>
                <th className="py-2 pr-4 font-medium">Minimum</th>
                <th className="py-2 font-medium">Dispatch</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {terms.categories.map((c) => (
                <tr key={c.slug} className="border-b border-charcoal/10">
                  <td className="py-2.5 pr-4">{c.name} (catalogue)</td>
                  <td className="py-2.5 pr-4">{c.moq} per style</td>
                  <td className="py-2.5">{c.leadTime}</td>
                </tr>
              ))}
              <tr className="border-b border-charcoal/10">
                <td className="py-2.5 pr-4">Custom / private label</td>
                <td className="py-2.5 pr-4">{terms.custom.moq} per design</td>
                <td className="py-2.5">{terms.custom.leadTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <H>Prices</H>
        <p>
          Wholesale prices start from {terms.startingPrice} {terms.startingPriceNote}. Every order
          is quoted individually; the price in your order confirmation is the one that applies.
        </p>
      </section>
      <section>
        <H>Payment</H>
        <p>{terms.payment}. Bank details are shared once your order is confirmed.</p>
      </section>
      <section>
        <H>Samples</H>
        <p>
          Samples are available at a nominal charge, which is adjusted against your first bulk
          order.
        </p>
      </section>
      <section>
        <H>Delivery</H>
        <p>
          We dispatch across India through {terms.couriers}. Production and dispatch times above are
          typical and are confirmed for each order.
        </p>
      </section>
      <section>
        <H>Quality and defects</H>
        <p>
          Every dispatch is quality-checked twice before it leaves us. If you receive a defective
          piece, tell us with photos and we'll replace it in your next order.
        </p>
      </section>
      <section>
        <H>Custom designs</H>
        <p>
          For private-label orders you confirm the sample before bulk production starts. Please only
          send designs, logos and labels you have the right to use.
        </p>
      </section>
      <section>
        <H>Questions</H>
        <p>
          WhatsApp or call {PHONE_DISPLAY}, or email {EMAIL}. We reply {terms.responseTime}.
        </p>
      </section>
    </LegalLayout>
  );
}

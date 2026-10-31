import { PageMeta } from "@/components/site/PageMeta";
import { Pill, PillRow } from "@/components/site/Pill";

export default function NotFound() {
  return (
    <>
      <PageMeta
        path="/404"
        title="Page not found | TajAttire"
        description="This page doesn't exist."
        noindex
      />
      <section data-bg="dark" className="bg-deep-black min-h-[80svh] flex items-center pt-28 pb-20">
        <div className="max-w-[1500px] w-full mx-auto px-6 lg:px-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-5">404</p>
          <h1 className="font-display text-cloud font-light leading-[1.02] text-[clamp(2.5rem,7vw,5.5rem)]">
            This page has <span className="italic text-[var(--gold)]">moved on.</span>
          </h1>
          <p className="mt-5 text-cloud/60 max-w-md">
            The link may be old or mistyped. Here's where most visitors are headed:
          </p>
          <div className="mt-10">
            <PillRow>
              <Pill to="/catalogue">Browse catalogue</Pill>
              <Pill to="/" variant="secondary">
                Home
              </Pill>
            </PillRow>
          </div>
        </div>
      </section>
    </>
  );
}

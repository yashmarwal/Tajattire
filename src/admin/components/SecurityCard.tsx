import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import securitySql from "../../../supabase/security.sql?raw";
import { runSecurityProbe, type ProbeResult } from "../lib/securityProbe";

const tone: Record<ProbeResult["status"], string> = {
  locked: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  open: "text-red-300 border-red-500/40 bg-red-500/10",
  unknown: "text-amber-300 border-amber-500/30 bg-amber-500/5",
};
const word: Record<ProbeResult["status"], string> = {
  locked: "Protected",
  open: "Open to anyone",
  unknown: "Couldn't check",
};

export function SecurityCard() {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["security-probe"],
    queryFn: runSecurityProbe,
    staleTime: 60_000,
  });
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState<"idle" | "done" | "fail">("idle");

  const results = data ?? [];
  const openCount = results.filter((r) => r.status === "open").length;
  const allLocked = results.length > 0 && results.every((r) => r.status === "locked");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(securitySql);
      setCopied("done");
    } catch {
      setCopied("fail");
    }
    setTimeout(() => setCopied("idle"), 2500);
  };

  return (
    <section
      aria-labelledby="security-heading"
      className={`border p-6 ${openCount ? "border-red-500/40 bg-[#1a0f0f]" : "border-[rgba(201,168,76,0.12)] bg-[#141414]"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] mb-1">
            Protect your website
          </p>
          <h3 id="security-heading" className="text-[#F8F6F1] text-lg font-medium">
            {isFetching && !data
              ? "Checking who can change your website…"
              : allLocked
                ? "Your website is locked down."
                : openCount
                  ? `${openCount} area${openCount > 1 ? "s" : ""} can be changed by strangers.`
                  : "Some areas couldn't be checked."}
          </h3>
          <p className="text-[rgba(248,246,241,0.5)] text-xs mt-1 max-w-xl">
            This test pretends to be a visitor who is not signed in and tries to change your data.
            It never actually saves anything.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 text-[11px] uppercase tracking-[0.15em] border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-50"
        >
          {isFetching ? "Checking…" : "Check again"}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {results.map((r) => (
            <li
              key={r.table}
              className={`border px-3 py-2 text-xs ${tone[r.status]}`}
              title={r.detail}
            >
              <span className="block font-semibold">{r.label}</span>
              <span className="opacity-80">{word[r.status]}</span>
            </li>
          ))}
        </ul>
      )}

      {!allLocked && (
        <div className="mt-6 border-t border-white/5 pt-5">
          <p className="text-[rgba(248,246,241,0.75)] text-sm font-medium mb-2">
            How to fix it (about 1 minute)
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-[rgba(248,246,241,0.6)] text-xs leading-relaxed">
            <li>
              Copy the lock-down script below and change the e-mail in STEP 1 to the one you sign in
              with.
            </li>
            <li>Open Supabase → SQL Editor → New query, paste it and press Run.</li>
            <li>
              In Supabase → Authentication → Sign In / Providers, switch off “Allow new users to
              sign up”.
            </li>
            <li>Come back here and press “Check again”.</li>
          </ol>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={copy}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] bg-[#C9A84C] text-[#0A0A0A]"
            >
              {copied === "done"
                ? "Copied ✓"
                : copied === "fail"
                  ? "Copy failed — select below"
                  : "Copy lock-down script"}
            </button>
            <button
              type="button"
              onClick={() => setShowSql((v) => !v)}
              className="px-4 py-2 text-[11px] uppercase tracking-[0.12em] border border-white/15 text-[rgba(248,246,241,0.7)]"
            >
              {showSql ? "Hide script" : "Show script"}
            </button>
          </div>
          {showSql && (
            <pre className="mt-3 max-h-80 overflow-auto bg-[#0A0A0A] border border-white/10 p-3 text-[10px] leading-relaxed text-[rgba(248,246,241,0.7)] whitespace-pre-wrap">
              {securitySql}
            </pre>
          )}
        </div>
      )}
    </section>
  );
}

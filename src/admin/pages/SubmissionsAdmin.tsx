import { useState } from "react";
import { useEnquirySubmissions, useFactoryVisitRequests } from "@/hooks/useSiteData";

type Tab = "enquiries" | "visits";

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return <span className="ml-2 bg-[#C9A84C] text-[#0A0A0A] text-[9px] font-bold px-2 py-0.5 rounded-full">{count}</span>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center text-[rgba(248,246,241,0.3)] text-sm border border-dashed border-[rgba(201,168,76,0.1)]">
      {message}
    </div>
  );
}

export function SubmissionsAdmin() {
  const [tab, setTab] = useState<Tab>("enquiries");
  const { data: enquiries = [], isLoading: loadingE } = useEnquirySubmissions();
  const { data: visits = [], isLoading: loadingV } = useFactoryVisitRequests();

  const tabCls = (t: Tab) =>
    `px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] transition-colors ${
      tab === t ? "bg-[#C9A84C] text-[#0A0A0A] font-bold" : "border border-[rgba(201,168,76,0.2)] text-[rgba(248,246,241,0.5)] hover:border-[#C9A84C] hover:text-[#F8F6F1]"
    }`;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[#F8F6F1] font-medium">Form Submissions</h2>
        <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">Read-only view of all contact form submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button className={tabCls("enquiries")} onClick={() => setTab("enquiries")}>
          Enquiries <Badge count={enquiries.length} />
        </button>
        <button className={tabCls("visits")} onClick={() => setTab("visits")}>
          Factory Visits <Badge count={visits.length} />
        </button>
      </div>

      {/* Enquiries */}
      {tab === "enquiries" && (
        loadingE ? <div className="py-12 text-center text-[rgba(248,246,241,0.3)]">Loading…</div> :
        enquiries.length === 0 ? <EmptyState message="No enquiry submissions yet." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-[rgba(201,168,76,0.08)]">
                  {["Date", "Name", "Email", "Phone", "City", "Product", "Message"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.35)] font-normal whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e, i) => (
                  <tr key={e.id} className={`border-b border-[rgba(201,168,76,0.03)] hover:bg-[rgba(201,168,76,0.02)] transition-colors ${i % 2 === 1 ? "bg-[rgba(255,255,255,0.01)]" : ""}`}>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.35)] whitespace-nowrap">{fmtDate(e.created_at)}</td>
                    <td className="px-4 py-3 text-[#F8F6F1] font-medium">{e.name ?? "—"}</td>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.55)]">{e.email ?? "—"}</td>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.55)]">{e.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.55)]">{e.city ?? "—"}</td>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.55)] whitespace-nowrap">{e.product ?? "—"}</td>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.45)] max-w-[200px]">
                      <span className="line-clamp-2">{e.message ?? "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Factory visits */}
      {tab === "visits" && (
        loadingV ? <div className="py-12 text-center text-[rgba(248,246,241,0.3)]">Loading…</div> :
        visits.length === 0 ? <EmptyState message="No factory visit requests yet." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-[rgba(201,168,76,0.08)]">
                  {["Date Submitted", "Name", "Email", "Business", "Requested Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.35)] font-normal whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visits.map((v, i) => (
                  <tr key={v.id} className={`border-b border-[rgba(201,168,76,0.03)] hover:bg-[rgba(201,168,76,0.02)] transition-colors ${i % 2 === 1 ? "bg-[rgba(255,255,255,0.01)]" : ""}`}>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.35)] whitespace-nowrap">{fmtDate(v.created_at)}</td>
                    <td className="px-4 py-3 text-[#F8F6F1] font-medium">{v.name ?? "—"}</td>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.55)]">{v.email ?? "—"}</td>
                    <td className="px-4 py-3 text-[rgba(248,246,241,0.55)]">{v.business ?? "—"}</td>
                    <td className="px-4 py-3 text-[#C9A84C]">{v.visit_date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

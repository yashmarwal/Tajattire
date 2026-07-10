import { useQuery } from "@tanstack/react-query";
import { getCatalogueItems, getTestimonials, getFaqItems, getEnquirySubmissions } from "@/lib/adminApi";

type AdminPage = "dashboard" | "catalogue" | "testimonials" | "faq" | "content" | "settings" | "submissions";

interface DashboardProps {
  onNavigate: (page: AdminPage) => void;
}

function StatCard({ label, value, icon, onClick }: { label: string; value: number; icon: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#141414] border border-[rgba(201,168,76,0.1)] p-6 text-left hover:border-[rgba(201,168,76,0.3)] transition-colors group w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-[#C9A84C] text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
      </div>
      <div className="font-display text-[#C9A84C] font-light mb-1" style={{ fontSize: "2.2rem" }}>{value}</div>
      <div className="text-[rgba(248,246,241,0.4)] text-xs uppercase tracking-[0.15em]">{label}</div>
    </button>
  );
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { data: catalogue = [] } = useQuery({ queryKey: ["admin-catalogue"], queryFn: () => getCatalogueItems(undefined, true) });
  const { data: testimonials = [] } = useQuery({ queryKey: ["admin-testimonials"], queryFn: () => getTestimonials(true) });
  const { data: faq = [] } = useQuery({ queryKey: ["admin-faq"], queryFn: () => getFaqItems(true) });
  const { data: submissions = [] } = useQuery({ queryKey: ["enquiries"], queryFn: () => getEnquirySubmissions() });

  const recent = submissions.slice(0, 5);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-[#0D1F13] border border-[rgba(201,168,76,0.1)] px-8 py-6 flex items-center justify-between">
        <div>
          <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] mb-1">Welcome back</p>
          <h2 className="text-[#F8F6F1] font-display text-2xl font-light">TajAttire Admin</h2>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[rgba(248,246,241,0.3)] text-xs">{dateStr}</p>
          <p className="text-[#C9A84C] text-[10px] mt-1 uppercase tracking-wider">
            {submissions.length} total enquiries
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products" value={catalogue.length} icon="◉" onClick={() => onNavigate("catalogue")} />
        <StatCard label="Testimonials" value={testimonials.length} icon="❝" onClick={() => onNavigate("testimonials")} />
        <StatCard label="FAQ Items" value={faq.length} icon="?" onClick={() => onNavigate("faq")} />
        <StatCard label="Submissions" value={submissions.length} icon="◎" onClick={() => onNavigate("submissions")} />
      </div>

      {/* Recent submissions */}
      <div className="bg-[#141414] border border-[rgba(201,168,76,0.1)]">
        <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.08)] flex items-center justify-between">
          <h3 className="text-[#F8F6F1] text-sm font-medium">Recent Enquiries</h3>
          <button
            onClick={() => onNavigate("submissions")}
            className="text-[#C9A84C] text-[10px] uppercase tracking-wider hover:opacity-80"
          >
            View All →
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="px-6 py-10 text-center text-[rgba(248,246,241,0.3)] text-sm">
            No submissions yet. Your enquiry form will populate this.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(201,168,76,0.05)]">
                  {["Name", "Email", "City", "Date"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.35)] font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((sub, i) => (
                  <tr
                    key={sub.id}
                    className={`border-b border-[rgba(201,168,76,0.04)] hover:bg-[rgba(201,168,76,0.03)] transition-colors ${
                      i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.015)]"
                    }`}
                  >
                    <td className="px-6 py-3 text-[#F8F6F1] text-xs">{sub.name ?? "—"}</td>
                    <td className="px-6 py-3 text-[rgba(248,246,241,0.5)] text-xs">{sub.email ?? "—"}</td>
                    <td className="px-6 py-3 text-[rgba(248,246,241,0.5)] text-xs">{sub.city ?? "—"}</td>
                    <td className="px-6 py-3 text-[rgba(248,246,241,0.35)] text-xs">
                      {new Date(sub.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Add Product", desc: "Upload a new design", page: "catalogue" as AdminPage },
          { label: "Edit FAQ", desc: "Manage Q&A items", page: "faq" as AdminPage },
          { label: "Site Settings", desc: "Update contact info", page: "settings" as AdminPage },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            className="bg-[#141414] border border-[rgba(201,168,76,0.08)] px-5 py-4 text-left hover:border-[rgba(201,168,76,0.25)] transition-colors group"
          >
            <p className="text-[#C9A84C] text-xs font-medium mb-1 group-hover:text-[#D4B55A]">{item.label} →</p>
            <p className="text-[rgba(248,246,241,0.35)] text-[11px]">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

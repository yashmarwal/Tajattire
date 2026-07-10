import { useState } from "react";
import { Toaster } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Dashboard } from "./pages/Dashboard";
import { CatalogueAdmin } from "./pages/CatalogueAdmin";
import { TestimonialsAdmin } from "./pages/TestimonialsAdmin";
import { FaqAdmin } from "./pages/FaqAdmin";
import { SettingsAdmin } from "./pages/SettingsAdmin";
import { SubmissionsAdmin } from "./pages/SubmissionsAdmin";
import { ContentAdmin } from "./pages/ContentAdmin";

type AdminPage = "dashboard" | "catalogue" | "testimonials" | "faq" | "content" | "settings" | "submissions";

const NAV: { id: AdminPage; label: string; icon: string }[] = [
  { id: "dashboard",    label: "Dashboard",       icon: "◈" },
  { id: "catalogue",    label: "Catalogue",        icon: "◉" },
  { id: "testimonials", label: "Testimonials",     icon: "❝" },
  { id: "faq",          label: "FAQ",              icon: "?" },
  { id: "content",      label: "Content & Media",  icon: "✦" },
  { id: "settings",     label: "Settings",         icon: "⚙" },
  { id: "submissions",  label: "Submissions",      icon: "◎" },
];

export function AdminLayout({ session }: { session: Session }) {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => supabase.auth.signOut();

  const renderPage = () => {
    switch (page) {
      case "dashboard":    return <Dashboard onNavigate={setPage} />;
      case "catalogue":    return <CatalogueAdmin />;
      case "testimonials": return <TestimonialsAdmin />;
      case "faq":          return <FaqAdmin />;
      case "content":      return <ContentAdmin />;
      case "settings":     return <SettingsAdmin />;
      case "submissions":  return <SubmissionsAdmin />;
    }
  };

  const NavItem = ({ item }: { item: (typeof NAV)[0] }) => (
    <button
      key={item.id}
      onClick={() => { setPage(item.id); setMobileSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-all duration-150 ${
        page === item.id
          ? "bg-[rgba(201,168,76,0.12)] text-[#C9A84C] border-r-2 border-[#C9A84C]"
          : "text-[rgba(248,246,241,0.45)] hover:text-[#F8F6F1] hover:bg-[rgba(255,255,255,0.03)]"
      }`}
    >
      <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
      <span className="tracking-wide">{item.label}</span>
    </button>
  );

  const Sidebar = () => (
    <aside className="w-[240px] flex-shrink-0 bg-[#0D1F13] border-r border-[rgba(201,168,76,0.08)] flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[rgba(201,168,76,0.08)]">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 border border-[#C9A84C]/50 flex items-center justify-center flex-shrink-0">
            <span className="text-[#C9A84C] text-xs">✦</span>
          </div>
          <span className="text-[#F8F6F1] font-display text-xl font-light">TajAttire</span>
        </div>
        <p className="text-[#C9A84C] text-[9px] uppercase tracking-[0.3em] pl-[37px]">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map(item => <NavItem key={item.id} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="border-t border-[rgba(201,168,76,0.08)] px-3 py-4 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[rgba(248,246,241,0.4)] hover:text-[#F8F6F1] transition-colors"
        >
          <span>→</span> View Live Site
        </a>
        <div className="text-[9px] text-[rgba(248,246,241,0.25)] px-3 truncate">
          {session.user.email}
        </div>
        <button
          id="admin-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-red-400/70 hover:text-red-400 transition-colors"
        >
          <span>⏻</span> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden font-body">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1A1A1A", border: "1px solid rgba(201,168,76,0.2)", color: "#F8F6F1" },
        }}
      />

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative z-10 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex-shrink-0 bg-[#0A0A0A] border-b border-[rgba(201,168,76,0.08)] px-6 py-4 flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-[rgba(248,246,241,0.5)] hover:text-[#F8F6F1] mr-2"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <h1 className="text-[#F8F6F1] text-sm font-medium flex-1">
            {NAV.find(n => n.id === page)?.label ?? "Admin"}
          </h1>

          <div className="text-[#C9A84C] text-[10px] uppercase tracking-[0.25em] hidden sm:block">
            TajAttire CMS
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

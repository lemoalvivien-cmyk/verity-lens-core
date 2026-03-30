import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  Activity, LayoutDashboard, Radio, Eye, Rss, FileSearch, GitCompare,
  Search, Bell, Settings, Webhook, LogOut, Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const sections = [
  {
    label: "Intelligence",
    items: [
      { to: "/app", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/app/ai-monitors", icon: Radio, label: "AI Monitors" },
      { to: "/app/web-monitors", icon: Eye, label: "Web Monitors" },
      { to: "/app/results", icon: Rss, label: "Results Feed" },
    ],
  },
  {
    label: "Analyse",
    items: [
      { to: "/app/evidence", icon: FileSearch, label: "Evidence" },
      { to: "/app/diffs", icon: GitCompare, label: "Diffs" },
      { to: "/app/compare", icon: GitCompare, label: "Compare" },
      { to: "/app/search", icon: Search, label: "Search" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/app/alerts", icon: Bell, label: "Alerts" },
      { to: "/app/settings", icon: Settings, label: "Settings" },
      { to: "/app/destinations", icon: Webhook, label: "API & Destinations" },
    ],
  },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-56 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-mono text-xs font-bold text-foreground tracking-tight">TruthOS</h1>
            <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">Intelligence</p>
          </div>
        </div>
      </div>

      {/* Create Monitor CTA */}
      <div className="px-3 pt-3">
        <RouterNavLink to="/app/monitors/new" onClick={onNavigate}>
          <Button size="sm" className="w-full bg-primary text-primary-foreground font-mono text-xs h-8 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            New Monitor
          </Button>
        </RouterNavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pt-3 pb-2" aria-label="Main navigation">
        {sections.map((section) => (
          <div key={section.label} className="mb-3">
            <p className="px-3 mb-1 font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <RouterNavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-signal-green" : ""}`} />
                    <span className="truncate">{item.label}</span>
                  </RouterNavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-mono text-[9px] text-foreground uppercase">
              {user?.email?.[0] || "?"}
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground truncate flex-1">
            {user?.email}
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;

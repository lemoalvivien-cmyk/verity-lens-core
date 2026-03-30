import { LayoutDashboard, Users, MapPin, FolderOpen, Download, Tag, Search, LogOut, Activity } from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const sections = [
  {
    label: "Vue d'ensemble",
    items: [
      { to: "/app", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/app/leads", icon: Users, label: "Leads" },
    ],
  },
  {
    label: "Segmentation",
    items: [
      { to: "/app/cities", icon: MapPin, label: "Villes" },
      { to: "/app/categories", icon: FolderOpen, label: "Catégories" },
      { to: "/app/tags", icon: Tag, label: "Tags" },
    ],
  },
  {
    label: "Outils",
    items: [
      { to: "/app/search", icon: Search, label: "Recherche" },
      { to: "/app/export", icon: Download, label: "Export" },
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
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-mono text-xs font-bold text-foreground tracking-tight">LeadOS</h1>
            <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pt-3 pb-2">
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
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-100 ${
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

      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-mono text-[9px] text-foreground uppercase">{user?.email?.[0] || "?"}</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground truncate flex-1">{user?.email}</span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;

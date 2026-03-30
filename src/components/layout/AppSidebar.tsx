import { NavLink, useLocation } from "react-router-dom";
import { Activity, Eye, GitCompare, LayoutDashboard, Radio, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Command Center" },
  { to: "/ai-pulse", icon: Radio, label: "AI Pulse" },
  { to: "/web-watch", icon: Eye, label: "Web Watch" },
  { to: "/compare", icon: GitCompare, label: "Compare" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-60 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold text-foreground tracking-tight">TruthOS</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Web Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "text-signal-green" : ""}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse-slow" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Status bar */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse-slow" />
          <span className="font-mono text-xs text-muted-foreground">System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;

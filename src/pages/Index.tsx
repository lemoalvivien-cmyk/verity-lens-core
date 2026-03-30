import { LayoutDashboard, Radio, Eye, Bell, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";

const stats = [
  { label: "Active Monitors", value: "6", sub: "3 AI · 3 Web" },
  { label: "Changes (24h)", value: "4", sub: "2 critical", signal: "amber" as const },
  { label: "Evidence Collected", value: "284", sub: "Last: 3 min ago" },
  { label: "Unread Alerts", value: "2", sub: "1 critical", signal: "red" as const },
];

const recentActivity = [
  { id: "1", type: "ai" as const, name: "ChatGPT changed response", monitor: "Brand mentions", time: "3m", severity: "warning" as const },
  { id: "2", type: "web" as const, name: "Pricing page updated", monitor: "Competitor Watch", time: "18m", severity: "critical" as const },
  { id: "3", type: "ai" as const, name: "New Perplexity citation", monitor: "Product queries", time: "1h", severity: "info" as const },
  { id: "4", type: "web" as const, name: "Docs structure changed", monitor: "API Docs tracker", time: "2h", severity: "info" as const },
];

const monitors = [
  { id: "1", name: "Brand mentions — ChatGPT", type: "ai_query" as const, status: "active" as const, lastRun: "3m ago", changes: 2 },
  { id: "2", name: "Competitor pricing pages", type: "web_watch" as const, status: "changed" as const, lastRun: "18m ago", changes: 3 },
  { id: "3", name: "Product query — Perplexity", type: "ai_query" as const, status: "active" as const, lastRun: "1h ago", changes: 0 },
  { id: "4", name: "API documentation tracker", type: "web_watch" as const, status: "active" as const, lastRun: "2h ago", changes: 0 },
];

const signalColor = {
  amber: "border-signal-amber/20 glow-amber",
  red: "border-signal-red/20 glow-red",
  undefined: "border-border",
};

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Truth at a glance — what changed, what matters, what to act on"
        icon={<LayoutDashboard className="w-4 h-4 text-signal-green" />}
        actions={
          <Link to="/monitors/new">
            <Button size="sm" className="bg-primary text-primary-foreground font-mono text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> New Monitor
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-card border rounded-lg p-4 ${signalColor[s.signal as keyof typeof signalColor] || signalColor.undefined}`}
          >
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-mono text-xl font-bold text-foreground">{s.value}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Recent Activity */}
        <div className="xl:col-span-3 bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold text-foreground">Recent Activity</h3>
            <Link to="/results" className="font-mono text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/20 transition-colors cursor-pointer"
              >
                {item.type === "ai" ? (
                  <Radio className="w-3.5 h-3.5 text-signal-green shrink-0" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-signal-blue shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{item.monitor}</p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{item.time}</span>
                <Bell className={`w-3 h-3 shrink-0 ${
                  item.severity === "critical" ? "text-signal-red" :
                  item.severity === "warning" ? "text-signal-amber" : "text-muted-foreground"
                }`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Monitors */}
        <div className="xl:col-span-2 bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold text-foreground">Monitors</h3>
            <span className="font-mono text-[10px] text-muted-foreground">{monitors.length} active</span>
          </div>
          <div className="divide-y divide-border">
            {monitors.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-3 hover:bg-secondary/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-foreground truncate flex-1">{m.name}</p>
                  <StatusBadge status={m.status} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {m.type === "ai_query" ? "AI" : "Web"}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">Last: {m.lastRun}</span>
                  {m.changes > 0 && (
                    <span className="font-mono text-[10px] text-signal-amber">{m.changes} changes</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Promise */}
      <div className="bg-card border border-border rounded-lg px-5 py-4 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Every result is linked to evidence. Every change is tracked. Every insight is provable.
        </p>
      </div>
    </div>
  );
};

export default Index;

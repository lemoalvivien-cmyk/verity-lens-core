import { motion } from "framer-motion";
import { Radio, Eye, GitCompare } from "lucide-react";

interface Monitor {
  id: string;
  name: string;
  type: "ai-pulse" | "web-watch" | "compare";
  status: "active" | "paused" | "alert";
  lastCheck: string;
  itemCount: number;
}

const monitors: Monitor[] = [
  { id: "1", name: "Brand mentions — ChatGPT", type: "ai-pulse", status: "active", lastCheck: "2m ago", itemCount: 24 },
  { id: "2", name: "Competitor pricing pages", type: "web-watch", status: "alert", lastCheck: "14m ago", itemCount: 8 },
  { id: "3", name: "CRM query comparison", type: "compare", status: "active", lastCheck: "1h ago", itemCount: 5 },
  { id: "4", name: "Product reviews — Perplexity", type: "ai-pulse", status: "active", lastCheck: "32m ago", itemCount: 12 },
  { id: "5", name: "Docs site — changelog", type: "web-watch", status: "paused", lastCheck: "3h ago", itemCount: 42 },
  { id: "6", name: "AI vs Reality — features", type: "compare", status: "active", lastCheck: "45m ago", itemCount: 3 },
];

const iconMap = { "ai-pulse": Radio, "web-watch": Eye, compare: GitCompare };
const statusColor = {
  active: "bg-signal-green",
  paused: "bg-muted-foreground",
  alert: "bg-signal-amber animate-pulse-slow",
};

const MonitorGrid = () => (
  <div className="bg-card border border-border rounded-lg">
    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
      <h3 className="font-mono text-sm font-semibold text-foreground">Active Monitors</h3>
      <span className="font-mono text-xs text-muted-foreground">{monitors.length} total</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
      {monitors.map((m, i) => {
        const Icon = iconMap[m.type];
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                {m.type.replace("-", " ")}
              </span>
              <span className={`ml-auto w-2 h-2 rounded-full ${statusColor[m.status]}`} />
            </div>
            <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-[10px] text-muted-foreground">{m.itemCount} items</span>
              <span className="font-mono text-[10px] text-muted-foreground">Last: {m.lastCheck}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default MonitorGrid;

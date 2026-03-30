import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Alert {
  id: string;
  type: "change" | "drift" | "info";
  message: string;
  source: string;
  time: string;
}

const mockAlerts: Alert[] = [
  { id: "1", type: "change", message: "ChatGPT changed response for 'best CRM software'", source: "AI Pulse", time: "2m ago" },
  { id: "2", type: "drift", message: "Competitor pricing page updated — 3 changes detected", source: "Web Watch", time: "14m ago" },
  { id: "3", type: "info", message: "New Gemini response indexed for 'project management tools'", source: "AI Pulse", time: "28m ago" },
  { id: "4", type: "change", message: "Perplexity now cites your competitor for 'email marketing'", source: "AI Pulse", time: "1h ago" },
  { id: "5", type: "drift", message: "Documentation site structure changed — 12 new pages", source: "Web Watch", time: "2h ago" },
];

const iconMap = {
  change: AlertTriangle,
  drift: Info,
  info: CheckCircle,
};

const colorMap = {
  change: "text-signal-amber",
  drift: "text-signal-blue",
  info: "text-signal-green",
};

const AlertFeed = () => {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-mono text-sm font-semibold text-foreground">Live Alert Feed</h3>
      </div>
      <div className="divide-y divide-border">
        {mockAlerts.map((alert, i) => {
          const Icon = iconMap[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="px-5 py-3.5 flex items-start gap-3 hover:bg-secondary/30 transition-colors cursor-pointer"
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorMap[alert.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">{alert.source}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{alert.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertFeed;

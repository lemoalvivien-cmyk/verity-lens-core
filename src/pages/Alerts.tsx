import { Bell, Check, Radio, Eye, GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  monitor: string;
  type: "ai_query" | "web_watch";
  time: string;
  read: boolean;
}

const mockAlerts: Alert[] = [
  { id: "1", severity: "critical", title: "Competitor pricing increased", message: "Enterprise plan price changed from $299/mo to $399/mo on competitor.com/pricing", monitor: "Competitor Pricing", type: "web_watch", time: "18m ago", read: false },
  { id: "2", severity: "warning", title: "AI response ranking shift", message: "ChatGPT moved your product from position 1 to position 3 in 'best CRM' query", monitor: "Brand mentions", type: "ai_query", time: "3h ago", read: false },
  { id: "3", severity: "info", title: "New citation detected", message: "Perplexity now cites TechCrunch March 2026 article as a primary source", monitor: "Product queries", type: "ai_query", time: "5h ago", read: true },
  { id: "4", severity: "info", title: "Documentation updated", message: "12 new pages added to API documentation site", monitor: "API Docs", type: "web_watch", time: "8h ago", read: true },
];

const severityStyle = {
  critical: "border-signal-red/30 bg-signal-red/5",
  warning: "border-signal-amber/30 bg-signal-amber/5",
  info: "border-border",
};

const severityDot = {
  critical: "bg-signal-red",
  warning: "bg-signal-amber animate-pulse-slow",
  info: "bg-muted-foreground",
};

const Alerts = () => {
  const unread = mockAlerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Alerts"
        subtitle={unread > 0 ? `${unread} unread alerts requiring attention` : "All caught up"}
        icon={<Bell className="w-4 h-4 text-signal-amber" />}
        actions={
          unread > 0 ? (
            <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5 bg-card border-border text-muted-foreground">
              <Check className="w-3.5 h-3.5" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      {mockAlerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alerts"
          description="Alerts will appear here when monitors detect significant changes."
        />
      ) : (
        <div className="space-y-2">
          {mockAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-card border rounded-lg p-4 transition-colors cursor-pointer ${severityStyle[alert.severity]} ${
                !alert.read ? "" : "opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityDot[alert.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground">{alert.title}</h3>
                    {!alert.read && (
                      <span className="font-mono text-[9px] bg-signal-amber/20 text-signal-amber px-1.5 py-0.5 rounded">NEW</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                  <div className="flex items-center gap-3">
                    {alert.type === "ai_query" ? (
                      <Radio className="w-3 h-3 text-signal-green" />
                    ) : (
                      <Eye className="w-3 h-3 text-signal-blue" />
                    )}
                    <span className="font-mono text-[10px] text-muted-foreground">{alert.monitor}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{alert.time}</span>
                    <span className="ml-auto font-mono text-[10px] text-signal-green hover:underline flex items-center gap-1">
                      <GitCompare className="w-3 h-3" /> View diff
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;

import { Eye, Plus, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

const monitors = [
  { id: "1", name: "Competitor Pricing", url: "https://competitor.com/pricing", status: "changed" as const, lastCheck: "14m ago", changes: 3, lastChange: "Enterprise plan price increased" },
  { id: "2", name: "Product Features Page", url: "https://competitor.com/features", status: "stable" as const, lastCheck: "30m ago", changes: 0 },
  { id: "3", name: "API Documentation", url: "https://docs.example.com/api", status: "changed" as const, lastCheck: "1h ago", changes: 12, lastChange: "New webhook endpoint documented" },
  { id: "4", name: "Release Notes", url: "https://blog.rival.io/releases", status: "stable" as const, lastCheck: "2h ago", changes: 0 },
];

const WebMonitors = () => (
  <div className="space-y-5 animate-fade-in">
    <PageHeader
      title="Web Page Monitors"
      subtitle="Track changes on any public web page"
      icon={<Eye className="w-4 h-4 text-signal-blue" />}
      actions={
        <Link to="/monitors/new">
          <Button size="sm" className="bg-primary text-primary-foreground font-mono text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Web Monitor
          </Button>
        </Link>
      }
    />

    {monitors.length === 0 ? (
      <EmptyState
        icon={Eye}
        title="No web monitors yet"
        description="Start tracking public web pages to detect content changes, pricing updates, and feature releases."
        action={<Link to="/monitors/new"><Button size="sm" className="font-mono text-xs">Create Monitor</Button></Link>}
      />
    ) : (
      <div className="space-y-2">
        {monitors.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
              <StatusBadge status={m.status} />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground truncate">{m.url}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {m.lastCheck}
              </span>
              {m.changes > 0 && (
                <span className="font-mono text-[10px] text-signal-amber">{m.changes} changes</span>
              )}
              {m.lastChange && (
                <span className="text-[11px] text-foreground truncate">{m.lastChange}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

export default WebMonitors;

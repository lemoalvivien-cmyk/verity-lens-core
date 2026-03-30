import { Radio, Plus, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

const monitors = [
  { id: "1", name: "Brand mentions — best CRM", status: "active" as const, lastRun: "3m ago", results: 24, changes: 2, engines: ["ChatGPT", "Gemini", "Perplexity"] },
  { id: "2", name: "Product comparison queries", status: "active" as const, lastRun: "32m ago", results: 12, changes: 0, engines: ["ChatGPT", "Perplexity"] },
  { id: "3", name: "Industry trend analysis", status: "paused" as const, lastRun: "3h ago", results: 8, changes: 0, engines: ["Gemini"] },
];

const engineColor: Record<string, string> = {
  ChatGPT: "text-signal-green",
  Gemini: "text-signal-blue",
  Perplexity: "text-signal-amber",
};

const AiMonitors = () => (
  <div className="space-y-5 animate-fade-in">
    <PageHeader
      title="AI Search Monitors"
      subtitle="Track what AI engines say about your queries"
      icon={<Radio className="w-4 h-4 text-signal-green" />}
      actions={
        <Link to="/monitors/new">
          <Button size="sm" className="bg-primary text-primary-foreground font-mono text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New AI Monitor
          </Button>
        </Link>
      }
    />

    {monitors.length === 0 ? (
      <EmptyState
        icon={Radio}
        title="No AI monitors yet"
        description="Create your first AI search monitor to start tracking what ChatGPT, Gemini, and Perplexity say."
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
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                {m.engines.map((eng) => (
                  <span key={eng} className={`font-mono text-[10px] font-semibold ${engineColor[eng] || "text-foreground"}`}>
                    {eng}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {m.lastRun}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{m.results} results</span>
              {m.changes > 0 && (
                <span className="font-mono text-[10px] text-signal-amber">{m.changes} changes detected</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

export default AiMonitors;

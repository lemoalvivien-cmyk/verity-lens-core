import { Radio, Plus, Clock, Loader2, Pause, Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useMonitors, useUpdateMonitorStatus, useDeleteMonitor } from "@/hooks/useMonitors";
import { isAiQueryConfig } from "@/types/models";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const engineColor: Record<string, string> = {
  chatgpt: "text-signal-green",
  gemini: "text-signal-blue",
  perplexity: "text-signal-amber",
};

const AiMonitors = () => {
  const { data: monitors = [], isLoading } = useMonitors("ai_query");
  const updateStatus = useUpdateMonitorStatus();
  const deleteMonitor = useDeleteMonitor();
  const { toast } = useToast();

  const handleToggle = async (id: string, current: string) => {
    const next = current === "active" ? "paused" : "active";
    try {
      await updateStatus.mutateAsync({ id, status: next as any });
      toast({ title: `Monitor ${next}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMonitor.mutateAsync(id);
      toast({ title: "Monitor deleted", description: `"${name}" has been removed.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
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
          {monitors.map((m, i) => {
            const config = isAiQueryConfig(m.config) ? m.config : null;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={m.status === "active" ? "active" : m.status === "paused" ? "paused" : "error"} />
                    <button onClick={() => handleToggle(m.id, m.status)} className="text-muted-foreground hover:text-foreground p-1" title={m.status === "active" ? "Pause" : "Resume"}>
                      {m.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(m.id, m.name)} className="text-muted-foreground hover:text-signal-red p-1" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {config && (
                  <p className="font-mono text-[11px] text-muted-foreground mb-2 truncate">Q: {config.query}</p>
                )}
                <div className="flex items-center gap-4 flex-wrap">
                  {config?.engines?.map((eng) => (
                    <span key={eng} className={`font-mono text-[10px] font-semibold ${engineColor[eng] || "text-foreground"}`}>
                      {eng}
                    </span>
                  ))}
                  {m.last_run_at && (
                    <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(m.last_run_at), { addSuffix: true })}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Every {m.interval_minutes < 60 ? `${m.interval_minutes}m` : `${m.interval_minutes / 60}h`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AiMonitors;

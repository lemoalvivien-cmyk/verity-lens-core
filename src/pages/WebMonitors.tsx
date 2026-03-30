import { Eye, Plus, ExternalLink, Clock, Loader2, Pause, Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useMonitors, useUpdateMonitorStatus, useDeleteMonitor } from "@/hooks/useMonitors";
import { isWebWatchConfig } from "@/types/models";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const WebMonitors = () => {
  const { data: monitors = [], isLoading } = useMonitors("web_watch");
  const updateStatus = useUpdateMonitorStatus();
  const deleteMonitor = useDeleteMonitor();
  const { toast } = useToast();

  const handleToggle = async (id: string, current: string) => {
    const next = current === "active" ? "paused" : "active";
    await updateStatus.mutateAsync({ id, status: next as any });
  };

  const handleDelete = async (id: string, name: string) => {
    await deleteMonitor.mutateAsync(id);
    toast({ title: "Monitor deleted", description: `"${name}" has been removed.` });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
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
          {monitors.map((m, i) => {
            const config = isWebWatchConfig(m.config) ? m.config : null;
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
                    <button onClick={() => handleToggle(m.id, m.status)} className="text-muted-foreground hover:text-foreground p-1">
                      {m.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(m.id, m.name)} className="text-muted-foreground hover:text-signal-red p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {config?.urls && (
                  <div className="space-y-1 mb-2">
                    {config.urls.slice(0, 3).map((url) => (
                      <div key={url} className="flex items-center gap-1.5">
                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="font-mono text-[10px] text-muted-foreground truncate">{url}</span>
                      </div>
                    ))}
                    {config.urls.length > 3 && (
                      <span className="font-mono text-[10px] text-muted-foreground">+{config.urls.length - 3} more</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-4">
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

export default WebMonitors;

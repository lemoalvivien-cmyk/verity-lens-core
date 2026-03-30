import { LayoutDashboard, Radio, Eye, Bell, Plus, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useMonitors } from "@/hooks/useMonitors";
import { useAlerts } from "@/hooks/useAlerts";
import { useEvidence } from "@/hooks/useData";
import { formatDistanceToNow } from "date-fns";

const Index = () => {
  const { data: monitors = [], isLoading: monitorsLoading } = useMonitors();
  const { data: alerts = [], isLoading: alertsLoading } = useAlerts();
  const { data: evidence = [] } = useEvidence();

  const loading = monitorsLoading || alertsLoading;

  const aiCount = monitors.filter((m) => m.type === "ai_query").length;
  const webCount = monitors.filter((m) => m.type === "web_watch").length;
  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && !a.read).length;

  const stats = [
    { label: "Active Monitors", value: String(monitors.filter((m) => m.status === "active").length), sub: `${aiCount} AI · ${webCount} Web` },
    { label: "Evidence Collected", value: String(evidence.length), sub: evidence.length > 0 ? `Last: ${formatDistanceToNow(new Date(evidence[0].captured_at), { addSuffix: true })}` : "None yet" },
    { label: "Unread Alerts", value: String(unreadAlerts), sub: criticalAlerts > 0 ? `${criticalAlerts} critical` : "All clear", signal: unreadAlerts > 0 ? "amber" as const : undefined },
    { label: "Total Monitors", value: String(monitors.length), sub: `${monitors.filter((m) => m.status === "paused").length} paused` },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Truth at a glance — what changed, what matters, what to act on"
        icon={<LayoutDashboard className="w-4 h-4 text-signal-green" />}
        actions={
          <Link to="/app/monitors/new">
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
            className={`bg-card border rounded-lg p-4 ${
              s.signal === "amber" ? "border-signal-amber/20" : "border-border"
            }`}
          >
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-mono text-xl font-bold text-foreground">{s.value}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Monitors */}
        <div className="xl:col-span-3 bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold text-foreground">Monitors</h3>
            <span className="font-mono text-[10px] text-muted-foreground">{monitors.length} total</span>
          </div>
          {monitors.length === 0 ? (
            <EmptyState
              icon={Radio}
              title="No monitors yet"
              description="Create your first monitor to start collecting intelligence."
              action={<Link to="/app/monitors/new"><Button size="sm" className="font-mono text-xs">Create Monitor</Button></Link>}
            />
          ) : (
            <div className="divide-y divide-border">
              {monitors.slice(0, 6).map((m, i) => (
                <Link
                  key={m.id}
                  to={m.type === "ai_query" ? "/app/ai-monitors" : "/app/web-monitors"}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="px-4 py-3 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {m.type === "ai_query" ? (
                          <Radio className="w-3.5 h-3.5 text-signal-green shrink-0" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-signal-blue shrink-0" />
                        )}
                        <p className="text-sm text-foreground truncate">{m.name}</p>
                      </div>
                      <StatusBadge status={m.status === "active" ? "active" : m.status === "paused" ? "paused" : "error"} />
                    </div>
                    <div className="flex items-center gap-3 ml-5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {m.type === "ai_query" ? "AI" : "Web"}
                      </span>
                      {m.last_run_at && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Last: {formatDistanceToNow(new Date(m.last_run_at), { addSuffix: true })}
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Every {m.interval_minutes < 60 ? `${m.interval_minutes}m` : `${m.interval_minutes / 60}h`}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="xl:col-span-2 bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold text-foreground">Recent Alerts</h3>
            <Link to="/app/alerts" className="font-mono text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {alerts.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No alerts yet"
              description="Alerts appear when monitors detect changes."
            />
          ) : (
            <div className="divide-y divide-border">
              {alerts.slice(0, 5).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`px-4 py-3 ${!a.read ? "" : "opacity-60"}`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      a.severity === "critical" ? "bg-signal-red" :
                      a.severity === "warning" ? "bg-signal-amber" : "bg-muted-foreground"
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{a.title}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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

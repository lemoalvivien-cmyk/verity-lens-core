import { Bell, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useAlerts, useMarkAlertRead, useMarkAllAlertsRead } from "@/hooks/useAlerts";
import { formatDistanceToNow } from "date-fns";

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
  const { data: alerts = [], isLoading } = useAlerts();
  const markRead = useMarkAlertRead();
  const markAllRead = useMarkAllAlertsRead();

  const unread = alerts.filter((a) => !a.read).length;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Alerts"
        subtitle={unread > 0 ? `${unread} unread alerts requiring attention` : "All caught up"}
        icon={<Bell className="w-4 h-4 text-signal-amber" />}
        actions={
          unread > 0 ? (
            <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="font-mono text-xs gap-1.5 bg-card border-border text-muted-foreground">
              <Check className="w-3.5 h-3.5" /> Mark all read
            </Button>
          ) : undefined
        }
      />

      {alerts.length === 0 ? (
        <EmptyState icon={Bell} title="No alerts" description="Alerts will appear here when monitors detect significant changes." />
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => !alert.read && markRead.mutate(alert.id)}
              className={`bg-card border rounded-lg p-4 transition-colors cursor-pointer ${severityStyle[alert.severity]} ${!alert.read ? "" : "opacity-60"}`}
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
                  {alert.message && <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">{alert.severity}</span>
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

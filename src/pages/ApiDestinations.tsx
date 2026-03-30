import { Webhook, Copy, Key, Plus, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useToast } from "@/hooks/use-toast";

const mockApiKey = "tos_live_a3f8c2d1e9b74f6a...";
const mockWebhooks = [
  { id: "1", url: "https://hooks.slack.com/services/T00.../B00.../xxx", events: ["alert.created"], status: "active" },
];

const ApiDestinations = () => {
  const { toast } = useToast();

  const copyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    toast({ title: "Copied", description: "API key copied to clipboard" });
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <PageHeader
        title="API & Destinations"
        subtitle="Export data, configure webhooks, access the API"
        icon={<Webhook className="w-4 h-4 text-muted-foreground" />}
      />

      {/* API Key */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">API Key</h3>
        </div>
        <div className="flex gap-2">
          <Input
            value={mockApiKey}
            readOnly
            className="bg-background border-border font-mono text-sm flex-1"
          />
          <Button variant="outline" size="sm" onClick={copyKey} className="bg-card border-border text-muted-foreground shrink-0">
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground mt-2">
          Use this key to access the TruthOS API. Keep it secret.
        </p>
      </motion.div>

      {/* API Endpoints */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Endpoints</h3>
        <div className="space-y-2">
          {[
            { method: "GET", path: "/api/monitors", desc: "List all monitors" },
            { method: "GET", path: "/api/evidence/:id", desc: "Get snapshot" },
            { method: "GET", path: "/api/diffs/:monitor_id", desc: "List diffs" },
            { method: "GET", path: "/api/search?q=...", desc: "Full-text search" },
            { method: "GET", path: "/api/alerts", desc: "List alerts" },
            { method: "POST", path: "/api/export", desc: "Export data (JSON/CSV)" },
          ].map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 py-1.5">
              <span className={`font-mono text-[10px] font-bold w-10 ${
                ep.method === "GET" ? "text-signal-green" : "text-signal-amber"
              }`}>{ep.method}</span>
              <span className="font-mono text-xs text-foreground flex-1">{ep.path}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{ep.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Webhooks */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">Webhooks</h3>
          <Button size="sm" variant="outline" className="font-mono text-xs gap-1.5 bg-card border-border text-muted-foreground">
            <Plus className="w-3.5 h-3.5" /> Add Webhook
          </Button>
        </div>
        {mockWebhooks.length === 0 ? (
          <EmptyState
            icon={Webhook}
            title="No webhooks configured"
            description="Send alerts and results to external services via webhooks."
          />
        ) : (
          <div className="space-y-2">
            {mockWebhooks.map((wh) => (
              <div key={wh.id} className="flex items-center gap-3 bg-background border border-border rounded-md p-3">
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs text-foreground truncate flex-1">{wh.url}</span>
                <span className="font-mono text-[10px] text-signal-green">{wh.status}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ApiDestinations;

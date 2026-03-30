import { Webhook, Key, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

const ApiDestinations = () => {
  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <PageHeader
        title="API & Destinations"
        subtitle="Export data, configure webhooks, access the API"
        icon={<Webhook className="w-4 h-4 text-muted-foreground" />}
      />

      {/* API Access */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">API Access</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          API keys and programmatic access to your workspace data will be available in a future release. 
          All monitors, evidence, and diffs will be queryable via REST endpoints.
        </p>
      </motion.div>

      {/* Webhooks */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">Webhooks</h3>
        </div>
        <EmptyState
          icon={Webhook}
          title="Coming soon"
          description="Send alerts and results to Slack, email, or any HTTP endpoint automatically when changes are detected."
        />
      </motion.div>
    </div>
  );
};

export default ApiDestinations;

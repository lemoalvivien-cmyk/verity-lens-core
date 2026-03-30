import { GitCompare, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useEvidence } from "@/hooks/useData";
import { formatDistanceToNow } from "date-fns";

const engineColors: Record<string, string> = {
  chatgpt: "text-signal-green border-signal-green/30 bg-signal-green/5",
  gemini: "text-signal-blue border-signal-blue/30 bg-signal-blue/5",
  perplexity: "text-signal-amber border-signal-amber/30 bg-signal-amber/5",
};

const Compare = () => {
  const { data: evidence = [], isLoading } = useEvidence();

  const grouped = evidence.reduce((acc, e) => {
    if (!acc[e.run_id]) acc[e.run_id] = [];
    acc[e.run_id].push(e);
    return acc;
  }, {} as Record<string, typeof evidence>);

  const comparisons = Object.entries(grouped)
    .filter(([_, items]) => items.length > 1)
    .slice(0, 10);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Compare"
        subtitle="Side-by-side AI responses from the same query run"
        icon={<GitCompare className="w-4 h-4 text-signal-amber" />}
      />

      {comparisons.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="No comparisons available"
          description="Comparisons appear when a single monitor run produces multiple results (e.g. querying ChatGPT and Gemini on the same topic). Create an AI monitor with multiple engines to start comparing."
        />
      ) : (
        comparisons.map(([runId, items], ci) => (
          <motion.div
            key={runId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.06 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="font-mono text-[10px] text-muted-foreground">
                Run {runId.substring(0, 8)} · {formatDistanceToNow(new Date(items[0].captured_at), { addSuffix: true })}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {items.map((e) => {
                const engine = (e.source_engine || "").toLowerCase();
                return (
                  <div key={e.id} className={`p-4 ${engineColors[engine] || "bg-card"}`}>
                    <p className="font-mono text-xs font-bold mb-2">{e.source_engine || "Unknown"}</p>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-6">
                      {e.raw_content?.substring(0, 400) || "No content"}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Compare;

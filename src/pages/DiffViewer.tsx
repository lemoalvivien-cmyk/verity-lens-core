import { GitCompare, ArrowLeft, Clock, Minus, Plus, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useDiffs } from "@/hooks/useData";
import { formatDistanceToNow } from "date-fns";

const DiffViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: diffs = [], isLoading } = useDiffs();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Diffs"
        subtitle="What changed between snapshots"
        icon={<GitCompare className="w-4 h-4 text-signal-amber" />}
        actions={<Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-mono text-xs gap-1.5 text-muted-foreground"><ArrowLeft className="w-3.5 h-3.5" /> Back</Button>}
      />

      {diffs.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="No diffs detected yet"
          description="Diffs appear when monitors detect changes between consecutive snapshots. Run monitors to start collecting data."
        />
      ) : (
        <div className="space-y-3">
          {diffs.map((diff, i) => {
            const monitor = diff.monitors as any;
            const diffData = diff.diff_data as any;
            return (
              <motion.div
                key={diff.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{monitor?.name || "Unknown monitor"}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(diff.created_at), { addSuffix: true })} · {diff.diff_type} · {Math.round(diff.significance * 100)}% change
                    </p>
                  </div>
                  <span className={`font-mono text-xs font-bold ${
                    diff.significance > 0.5 ? "text-signal-red" : diff.significance > 0.2 ? "text-signal-amber" : "text-signal-green"
                  }`}>
                    {Math.round(diff.significance * 100)}%
                  </span>
                </div>
                {diffData?.summary && (
                  <div className="px-4 py-3">
                    <p className="text-sm text-foreground">{diffData.summary}</p>
                  </div>
                )}
                {diffData?.lines && (
                  <div className="font-mono text-xs divide-y divide-border/50">
                    {(diffData.lines as any[]).map((line: any, li: number) => (
                      <div key={li} className={`px-4 py-1.5 ${
                        line.type === "removed" ? "bg-signal-red/10 text-signal-red" :
                        line.type === "added" ? "bg-signal-green/10 text-signal-green" : "text-muted-foreground"
                      }`}>
                        <span className="flex items-center gap-2">
                          {line.type === "removed" && <Minus className="w-3 h-3 shrink-0" />}
                          {line.type === "added" && <Plus className="w-3 h-3 shrink-0" />}
                          <span>{line.text}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiffViewer;

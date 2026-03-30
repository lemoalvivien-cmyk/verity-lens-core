import { FileSearch, ExternalLink, Clock, Hash, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useEvidenceById } from "@/hooks/useData";
import { format } from "date-fns";

const EvidenceViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: evidence, isLoading } = useEvidenceById(id);

  if (!id) {
    return (
      <div className="space-y-5 animate-fade-in">
        <PageHeader title="Evidence Viewer" subtitle="Select evidence from Results Feed to view" icon={<FileSearch className="w-4 h-4 text-signal-green" />} />
        <EmptyState icon={FileSearch} title="No evidence selected" description="Navigate from the Results Feed or a monitor to view specific evidence." />
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  if (!evidence) {
    return (
      <div className="space-y-5 animate-fade-in">
        <PageHeader title="Evidence Not Found" icon={<FileSearch className="w-4 h-4 text-signal-red" />}
          actions={<Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-mono text-xs"><ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back</Button>} />
        <EmptyState icon={FileSearch} title="Evidence not found" description="This snapshot may have been deleted or you don't have access." />
      </div>
    );
  }

  const monitor = evidence.monitors as any;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Evidence Viewer"
        subtitle="Immutable snapshot — cryptographically hashed, never modified"
        icon={<FileSearch className="w-4 h-4 text-signal-green" />}
        actions={<Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-mono text-xs gap-1.5 text-muted-foreground"><ArrowLeft className="w-3.5 h-3.5" /> Back</Button>}
      />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Monitor</p>
            <p className="text-sm text-foreground">{monitor?.name || "Unknown"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Captured</p>
            <p className="text-sm text-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {format(new Date(evidence.captured_at), "MMM d, yyyy · HH:mm")} UTC
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Source</p>
            <p className="text-sm text-foreground flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> {evidence.source_engine || evidence.source_url || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Content Hash</p>
            <p className="font-mono text-[10px] text-foreground flex items-center gap-1">
              <Hash className="w-3 h-3" /> {evidence.content_hash}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card border border-signal-green/20 rounded-lg p-4 glow-green">
        <p className="font-mono text-[10px] text-signal-green uppercase tracking-wider mb-3">Captured Response — Immutable</p>
        <div className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {evidence.raw_content || "No content captured"}
        </div>
      </motion.div>

      {evidence.structured_data && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-4">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Structured Data</p>
          <pre className="font-mono text-xs text-foreground overflow-auto max-h-60 bg-background rounded p-3">
            {JSON.stringify(evidence.structured_data, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  );
};

export default EvidenceViewer;

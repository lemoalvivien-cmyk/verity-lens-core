import { FileSearch, ExternalLink, Clock, Hash, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

const evidence = {
  id: "snap-001",
  monitorName: "Brand mentions — ChatGPT",
  engine: "ChatGPT",
  query: "What is the best CRM software for startups?",
  capturedAt: "Mar 30, 2026 · 14:23 UTC",
  contentHash: "a3f8c2d1e9b7...4f6a",
  sourceUrl: "https://chatgpt.com",
  rawContent: `Based on current reviews and feature comparisons, the top CRM solutions for startups in 2026 are:

1. **HubSpot CRM** — Best for startups needing a free, all-in-one solution. Excellent marketing automation integration.

2. **Pipedrive** — Best for sales-focused teams. Clean pipeline management and affordable pricing.

3. **Salesforce Essentials** — Best for startups planning rapid scaling. Most powerful but steepest learning curve.

4. **Freshsales** — Best value option. AI-powered lead scoring included in free tier.

Key factors to consider:
- Team size and growth trajectory
- Integration needs (email, marketing, support)
- Budget constraints
- Technical expertise available`,
  sources: ["g2.com/crm-software", "capterra.com/crm", "hubspot.com/products/crm"],
  metadata: {
    responseTime: "2.3s",
    tokenCount: 847,
    model: "GPT-4o",
  },
};

const EvidenceViewer = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Evidence Viewer"
        subtitle="Immutable snapshot — cryptographically hashed, never modified"
        icon={<FileSearch className="w-4 h-4 text-signal-green" />}
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-mono text-xs gap-1.5 text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
        }
      />

      {/* Metadata */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Monitor</p>
            <p className="text-sm text-foreground">{evidence.monitorName}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Captured</p>
            <p className="text-sm text-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {evidence.capturedAt}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Source</p>
            <p className="text-sm text-foreground flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> {evidence.engine}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Content Hash</p>
            <p className="font-mono text-[10px] text-foreground flex items-center gap-1">
              <Hash className="w-3 h-3" /> {evidence.contentHash}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Query */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-lg p-4"
      >
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Query</p>
        <p className="text-sm text-foreground font-medium">{evidence.query}</p>
      </motion.div>

      {/* Raw Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-signal-green/20 rounded-lg p-4 glow-green"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] text-signal-green uppercase tracking-wider">Captured Response — Immutable</p>
          <span className="font-mono text-[9px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            {evidence.metadata.model} · {evidence.metadata.tokenCount} tokens · {evidence.metadata.responseTime}
          </span>
        </div>
        <div className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {evidence.rawContent}
        </div>
      </motion.div>

      {/* Sources */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-lg p-4"
      >
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Cited Sources</p>
        <div className="space-y-1.5">
          {evidence.sources.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
              <span className="font-mono text-xs text-foreground">{s}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EvidenceViewer;

import { GitCompare, ArrowLeft, Clock, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

const diff = {
  monitorName: "Brand mentions — ChatGPT",
  snapshotA: { date: "Mar 29, 2026 · 10:15 UTC", hash: "b2e4f1..." },
  snapshotB: { date: "Mar 30, 2026 · 14:23 UTC", hash: "a3f8c2..." },
  significance: 0.72,
  changes: [
    { type: "removed" as const, text: "1. **Salesforce Essentials** — Best for startups. Most powerful ecosystem with Einstein AI." },
    { type: "added" as const, text: "1. **HubSpot CRM** — Best for startups needing a free, all-in-one solution. Excellent marketing automation integration." },
    { type: "unchanged" as const, text: "2. **Pipedrive** — Best for sales-focused teams. Clean pipeline management and affordable pricing." },
    { type: "removed" as const, text: "3. **HubSpot CRM** — Great free tier. Good for teams prioritizing marketing." },
    { type: "added" as const, text: "3. **Salesforce Essentials** — Best for startups planning rapid scaling. Most powerful but steepest learning curve." },
    { type: "added" as const, text: "4. **Freshsales** — Best value option. AI-powered lead scoring included in free tier." },
    { type: "unchanged" as const, text: "Key factors to consider:" },
  ],
};

const lineStyle = {
  removed: "bg-signal-red/10 border-l-2 border-signal-red/40 text-signal-red",
  added: "bg-signal-green/10 border-l-2 border-signal-green/40 text-signal-green",
  unchanged: "text-muted-foreground",
};

const DiffViewer = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Diff Viewer"
        subtitle="What changed between two snapshots"
        icon={<GitCompare className="w-4 h-4 text-signal-amber" />}
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-mono text-xs gap-1.5 text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
        }
      />

      {/* Diff Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-4"
      >
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">{diff.monitorName}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-signal-red/5 border border-signal-red/20 rounded-md p-3">
            <p className="font-mono text-[9px] text-signal-red uppercase mb-1">Before</p>
            <p className="font-mono text-[10px] text-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {diff.snapshotA.date}
            </p>
            <p className="font-mono text-[9px] text-muted-foreground mt-0.5">Hash: {diff.snapshotA.hash}</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-signal-amber" />
              <div className="text-center">
                <p className="font-mono text-lg font-bold text-signal-amber">{Math.round(diff.significance * 100)}%</p>
                <p className="font-mono text-[9px] text-muted-foreground">change</p>
              </div>
            </div>
          </div>
          <div className="bg-signal-green/5 border border-signal-green/20 rounded-md p-3">
            <p className="font-mono text-[9px] text-signal-green uppercase mb-1">After</p>
            <p className="font-mono text-[10px] text-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {diff.snapshotB.date}
            </p>
            <p className="font-mono text-[9px] text-muted-foreground mt-0.5">Hash: {diff.snapshotB.hash}</p>
          </div>
        </div>
      </motion.div>

      {/* Diff Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-border">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Line-by-line diff</p>
        </div>
        <div className="font-mono text-sm divide-y divide-border/50">
          {diff.changes.map((line, i) => (
            <div key={i} className={`px-4 py-2 ${lineStyle[line.type]}`}>
              <span className="inline-flex items-center gap-2">
                {line.type === "removed" && <Minus className="w-3 h-3 shrink-0" />}
                {line.type === "added" && <Plus className="w-3 h-3 shrink-0" />}
                {line.type === "unchanged" && <span className="w-3" />}
                <span className="text-[13px]">{line.text}</span>
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DiffViewer;

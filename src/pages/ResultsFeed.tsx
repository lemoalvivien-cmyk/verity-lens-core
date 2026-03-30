import { Rss, Radio, Eye, FileSearch, GitCompare, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

interface ResultItem {
  id: string;
  type: "ai_query" | "web_watch";
  monitorName: string;
  title: string;
  snippet: string;
  source: string;
  engine?: string;
  time: string;
  hasChange: boolean;
}

const results: ResultItem[] = [
  { id: "1", type: "ai_query", monitorName: "Brand mentions", title: "ChatGPT response changed", snippet: "Previously recommended competitor X first. Now recommends your product alongside competitor X.", source: "chatgpt.com", engine: "ChatGPT", time: "3m ago", hasChange: true },
  { id: "2", type: "web_watch", monitorName: "Competitor Pricing", title: "Enterprise plan price updated", snippet: "Enterprise plan changed from $299/mo to $399/mo. New 'Scale' tier added at $199/mo.", source: "competitor.com/pricing", time: "18m ago", hasChange: true },
  { id: "3", type: "ai_query", monitorName: "Product queries", title: "Perplexity now cites new source", snippet: "New citation: TechCrunch article from March 2026 reviewing top CRM tools.", source: "perplexity.ai", engine: "Perplexity", time: "1h ago", hasChange: true },
  { id: "4", type: "ai_query", monitorName: "Brand mentions", title: "Gemini response stable", snippet: "No changes detected in Gemini's response to 'best CRM for startups' query.", source: "gemini.google.com", engine: "Gemini", time: "1h ago", hasChange: false },
  { id: "5", type: "web_watch", monitorName: "API Docs", title: "New endpoint documented", snippet: "/v2/webhooks endpoint added with POST method. Includes event types and payload examples.", source: "docs.example.com/api", time: "2h ago", hasChange: true },
];

const engineColors: Record<string, string> = {
  ChatGPT: "text-signal-green",
  Gemini: "text-signal-blue",
  Perplexity: "text-signal-amber",
};

const ResultsFeed = () => (
  <div className="space-y-5 animate-fade-in">
    <PageHeader
      title="Results Feed"
      subtitle="Chronological stream of all collected intelligence"
      icon={<Rss className="w-4 h-4 text-signal-green" />}
      actions={
        <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5 bg-card border-border text-muted-foreground">
          <Filter className="w-3.5 h-3.5" /> Filter
        </Button>
      }
    />

    <div className="space-y-2">
      {results.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            {r.type === "ai_query" ? (
              <Radio className="w-3.5 h-3.5 text-signal-green shrink-0" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-signal-blue shrink-0" />
            )}
            <span className="font-mono text-[10px] text-muted-foreground uppercase">{r.monitorName}</span>
            {r.engine && (
              <span className={`font-mono text-[10px] font-semibold ${engineColors[r.engine] || ""}`}>{r.engine}</span>
            )}
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">{r.time}</span>
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">{r.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{r.snippet}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="font-mono text-[10px] text-muted-foreground">{r.source}</span>
            <Link to={`/evidence/${r.id}`} className="font-mono text-[10px] text-signal-green hover:underline flex items-center gap-1">
              <FileSearch className="w-3 h-3" /> View evidence
            </Link>
            {r.hasChange && (
              <Link to={`/diffs/${r.id}`} className="font-mono text-[10px] text-signal-amber hover:underline flex items-center gap-1">
                <GitCompare className="w-3 h-3" /> View diff
              </Link>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ResultsFeed;

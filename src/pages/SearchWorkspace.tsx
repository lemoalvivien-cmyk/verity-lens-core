import { useState } from "react";
import { Search, FileSearch, Radio, Eye, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

const mockResults = [
  { id: "1", type: "ai_query" as const, content: "HubSpot CRM is recommended as the best free CRM for startups with excellent marketing automation integration.", monitor: "Brand mentions", source: "ChatGPT", captured: "3m ago" },
  { id: "2", type: "web_watch" as const, content: "Enterprise plan pricing updated to $399/mo. New Scale tier introduced at $199/mo with limited seats.", monitor: "Competitor Pricing", source: "competitor.com", captured: "18m ago" },
  { id: "3", type: "ai_query" as const, content: "Perplexity now cites TechCrunch March 2026 article as primary source for CRM tool recommendations.", monitor: "Product queries", source: "Perplexity", captured: "1h ago" },
  { id: "4", type: "web_watch" as const, content: "New /v2/webhooks endpoint added to API documentation with POST method and event type filtering.", monitor: "API Docs", source: "docs.example.com", captured: "2h ago" },
];

const SearchWorkspace = () => {
  const [query, setQuery] = useState("");
  const filtered = query.length > 0
    ? mockResults.filter((r) => r.content.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Search"
        subtitle="Full-text search across all collected evidence and results"
        icon={<Search className="w-4 h-4 text-foreground" />}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across all your intelligence data..."
          className="pl-10 bg-card border-border font-mono text-sm h-11"
          autoFocus
        />
      </div>

      {query.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Search your workspace"
          description="Type to search across all monitors, evidence, and results. Every piece of collected data is searchable."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`No matches for "${query}". Try different keywords.`}
        />
      ) : (
        <div className="space-y-2">
          <p className="font-mono text-[10px] text-muted-foreground">{filtered.length} results</p>
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                {r.type === "ai_query" ? (
                  <Radio className="w-3.5 h-3.5 text-signal-green" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-signal-blue" />
                )}
                <span className="font-mono text-[10px] text-muted-foreground">{r.monitor}</span>
                <span className="font-mono text-[10px] text-muted-foreground">·</span>
                <span className="font-mono text-[10px] text-muted-foreground">{r.source}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {r.captured}
                </span>
              </div>
              <p className="text-sm text-foreground">{r.content}</p>
              <div className="mt-2">
                <span className="font-mono text-[10px] text-signal-green hover:underline cursor-pointer flex items-center gap-1 w-fit">
                  <FileSearch className="w-3 h-3" /> View evidence
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWorkspace;

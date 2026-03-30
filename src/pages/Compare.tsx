import { motion } from "framer-motion";
import { GitCompare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ComparisonEntry {
  engine: string;
  response: string;
  sources: string[];
  confidence: "high" | "medium" | "low";
}

interface ComparisonSet {
  id: string;
  query: string;
  date: string;
  entries: ComparisonEntry[];
}

const mockComparisons: ComparisonSet[] = [
  {
    id: "1",
    query: "What is the best project management tool for startups?",
    date: "Mar 30, 2026",
    entries: [
      { engine: "ChatGPT", response: "For startups, Linear stands out for its speed and developer-centric design. Notion is great for all-in-one workspace needs, while Asana offers robust project tracking.", sources: ["linear.app", "notion.so"], confidence: "high" },
      { engine: "Gemini", response: "Monday.com and ClickUp are the most versatile options for startups. Both offer free tiers and scale well. Jira remains strong for engineering-focused teams.", sources: ["monday.com", "clickup.com"], confidence: "medium" },
      { engine: "Perplexity", response: "Based on 2026 reviews, the top picks are: 1) Linear for dev teams, 2) Notion for hybrid workflows, 3) Asana for structured project management. Linear has gained significant market share.", sources: ["g2.com", "producthunt.com", "techcrunch.com"], confidence: "high" },
    ],
  },
  {
    id: "2",
    query: "Is HubSpot better than Salesforce for small businesses?",
    date: "Mar 29, 2026",
    entries: [
      { engine: "ChatGPT", response: "HubSpot is generally better for small businesses due to its free CRM, intuitive interface, and lower total cost of ownership. Salesforce excels at enterprise scale.", sources: ["hubspot.com", "salesforce.com"], confidence: "high" },
      { engine: "Gemini", response: "For small businesses, HubSpot is typically the better choice. It offers a generous free tier and requires less technical setup. Salesforce is more powerful but has a steeper learning curve.", sources: ["pcmag.com"], confidence: "high" },
      { engine: "Perplexity", response: "HubSpot wins for small businesses in most categories: ease of use, pricing, and onboarding. However, Salesforce is superior for businesses planning rapid scaling and needing deep customization.", sources: ["capterra.com", "g2.com", "forbes.com"], confidence: "high" },
    ],
  },
];

const engineColors: Record<string, string> = {
  ChatGPT: "border-signal-green/30 bg-signal-green/5",
  Gemini: "border-signal-blue/30 bg-signal-blue/5",
  Perplexity: "border-signal-amber/30 bg-signal-amber/5",
};

const engineTextColors: Record<string, string> = {
  ChatGPT: "text-signal-green",
  Gemini: "text-signal-blue",
  Perplexity: "text-signal-amber",
};

const confidenceBadge = {
  high: "bg-signal-green/10 text-signal-green",
  medium: "bg-signal-amber/10 text-signal-amber",
  low: "bg-signal-red/10 text-signal-red",
};

const Compare = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-mono text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-signal-amber" />
          Truth Compare
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Compare AI responses side-by-side and track drift</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a query to compare across AI engines..."
            className="pl-10 bg-card border-border font-mono text-sm"
          />
        </div>
        <Button className="bg-primary text-primary-foreground font-mono text-sm hover:bg-primary/90">
          <GitCompare className="w-4 h-4 mr-2" />
          Compare
        </Button>
      </div>

      {mockComparisons.map((comp, ci) => (
        <motion.div
          key={comp.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ci * 0.1 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{comp.date}</p>
            <p className="text-sm font-medium text-foreground mt-1">{comp.query}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
            {comp.entries.map((entry) => (
              <div key={entry.engine} className={`p-4 ${engineColors[entry.engine] || "bg-card"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-xs font-bold ${engineTextColors[entry.engine]}`}>
                    {entry.engine}
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${confidenceBadge[entry.confidence]}`}>
                    {entry.confidence}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{entry.response}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {entry.sources.map((s) => (
                    <span key={s} className="font-mono text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Compare;

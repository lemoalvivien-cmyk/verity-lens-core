import { motion } from "framer-motion";
import { Radio, Search, Clock, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AiResult {
  id: string;
  query: string;
  engine: string;
  snippet: string;
  sources: string[];
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
}

const mockResults: AiResult[] = [
  {
    id: "1", query: "best CRM software 2026", engine: "ChatGPT",
    snippet: "Based on current reviews and feature comparisons, HubSpot, Salesforce, and Pipedrive remain the top CRM solutions. HubSpot is particularly noted for its free tier and ease of use...",
    sources: ["g2.com", "capterra.com", "hubspot.com"], timestamp: "2 min ago", sentiment: "neutral",
  },
  {
    id: "2", query: "best CRM software 2026", engine: "Gemini",
    snippet: "For 2026, the leading CRM platforms include Salesforce for enterprise, HubSpot for SMBs, and Zoho for value. Salesforce has maintained its dominant position with Einstein AI...",
    sources: ["salesforce.com", "pcmag.com"], timestamp: "2 min ago", sentiment: "neutral",
  },
  {
    id: "3", query: "best CRM software 2026", engine: "Perplexity",
    snippet: "The best CRM software in 2026 depends on your business size. For large enterprises: Salesforce. For growing businesses: HubSpot. For startups on a budget: Freshsales or Zoho CRM...",
    sources: ["techradar.com", "forbes.com", "zapier.com"], timestamp: "2 min ago", sentiment: "positive",
  },
  {
    id: "4", query: "email marketing platform comparison", engine: "ChatGPT",
    snippet: "Mailchimp, Klaviyo, and ConvertKit are the most recommended email marketing platforms. Klaviyo excels for e-commerce while ConvertKit is preferred by creators...",
    sources: ["emailtooltester.com", "shopify.com"], timestamp: "1h ago", sentiment: "neutral",
  },
];

const engineColors: Record<string, string> = {
  ChatGPT: "text-signal-green",
  Gemini: "text-signal-blue",
  Perplexity: "text-signal-amber",
};

const sentimentBadge = {
  positive: "bg-signal-green/10 text-signal-green",
  neutral: "bg-secondary text-muted-foreground",
  negative: "bg-signal-red/10 text-signal-red",
};

const AiPulse = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-mono text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Radio className="w-5 h-5 text-signal-green" />
          AI Pulse
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor what AI engines say about any topic</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a query to monitor across AI engines..."
            className="pl-10 bg-card border-border font-mono text-sm"
          />
        </div>
        <Button className="bg-primary text-primary-foreground font-mono text-sm hover:bg-primary/90">
          <Radio className="w-4 h-4 mr-2" />
          Pulse
        </Button>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {mockResults.map((result, i) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-lg p-5 hover:border-border/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`font-mono text-xs font-semibold ${engineColors[result.engine] || "text-foreground"}`}>
                {result.engine}
              </span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${sentimentBadge[result.sentiment]}`}>
                {result.sentiment}
              </span>
              <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" /> {result.timestamp}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-2 uppercase tracking-wider">
              Q: {result.query}
            </p>
            <p className="text-sm text-foreground leading-relaxed">{result.snippet}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {result.sources.map((s) => (
                <span key={s} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded">
                  <ExternalLink className="w-2.5 h-2.5" /> {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AiPulse;

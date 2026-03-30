import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Radio, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/shared/PageHeader";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useCreateMonitor } from "@/hooks/useMonitors";
import type { MonitorType, AiQueryConfig, WebWatchConfig } from "@/types/models";

const CreateMonitor = () => {
  const [type, setType] = useState<MonitorType | null>(null);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [urls, setUrls] = useState("");
  const [engines, setEngines] = useState<string[]>(["chatgpt"]);
  const [interval, setInterval] = useState(60);
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMonitor = useCreateMonitor();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    const config = type === "ai_query"
      ? { query, engines } as AiQueryConfig
      : { urls: urls.split("\n").map((u) => u.trim()).filter(Boolean) } as WebWatchConfig;

    try {
      await createMonitor.mutateAsync({
        name,
        type,
        config,
        interval_minutes: interval,
      });
      toast({ title: "Monitor created", description: `"${name}" is now active and will start collecting data.` });
      navigate(type === "ai_query" ? "/ai-monitors" : "/web-monitors");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader
        title="Create Monitor"
        subtitle="Set up a new intelligence source"
        icon={<Plus className="w-4 h-4 text-signal-green" />}
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="font-mono text-xs gap-1.5 text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
        }
      />

      {!type ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setType("ai_query")}
            className="bg-card border border-border rounded-lg p-6 text-left hover:border-signal-green/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-signal-green/10 flex items-center justify-center mb-4">
              <Radio className="w-5 h-5 text-signal-green" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-foreground mb-1">AI Search Monitor</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track what ChatGPT, Gemini, and Perplexity say about a query. Detect drift and citation changes.
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onClick={() => setType("web_watch")}
            className="bg-card border border-border rounded-lg p-6 text-left hover:border-signal-blue/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-signal-blue/10 flex items-center justify-center mb-4">
              <Eye className="w-5 h-5 text-signal-blue" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-foreground mb-1">Web Page Monitor</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track changes on any public web page. Detect content updates, pricing shifts, feature changes.
            </p>
          </motion.button>
        </div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="bg-card border border-border rounded-lg p-6 space-y-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={() => setType(null)} className="font-mono text-[10px] text-muted-foreground hover:text-foreground">
              ← Change type
            </button>
            <span className="font-mono text-[10px] text-muted-foreground">·</span>
            <span className="font-mono text-[10px] text-signal-green uppercase">
              {type === "ai_query" ? "AI Search Monitor" : "Web Page Monitor"}
            </span>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Monitor Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)}
              placeholder={type === "ai_query" ? "e.g. Brand mentions — ChatGPT" : "e.g. Competitor pricing page"}
              className="bg-background border-border font-mono text-sm" required />
          </div>

          {type === "ai_query" ? (
            <>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">Query to monitor</Label>
                <Textarea value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. What is the best CRM software for startups?"
                  className="bg-background border-border font-mono text-sm min-h-[80px]" required />
                <p className="font-mono text-[10px] text-muted-foreground">This exact query will be sent to AI engines at each check.</p>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-muted-foreground">AI Engines</Label>
                <div className="flex gap-2">
                  {["chatgpt", "gemini", "perplexity"].map((eng) => (
                    <button key={eng} type="button"
                      onClick={() => setEngines((prev) => prev.includes(eng) ? prev.filter((e) => e !== eng) : [...prev, eng])}
                      className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors ${
                        engines.includes(eng) ? "bg-secondary text-foreground border-border" : "text-muted-foreground border-transparent hover:border-border"
                      }`}>{eng}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label className="font-mono text-xs text-muted-foreground">URLs to monitor (one per line)</Label>
              <Textarea value={urls} onChange={(e) => setUrls(e.target.value)}
                placeholder={"https://competitor.com/pricing\nhttps://competitor.com/features"}
                className="bg-background border-border font-mono text-sm min-h-[100px]" required />
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Check Frequency</Label>
            <div className="flex gap-2">
              {[{ label: "1h", value: 60 }, { label: "6h", value: 360 }, { label: "24h", value: 1440 }].map((freq) => (
                <button key={freq.value} type="button"
                  onClick={() => setInterval(freq.value)}
                  className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors ${
                    interval === freq.value ? "bg-secondary text-foreground border-border" : "text-muted-foreground border-border hover:bg-secondary/50"
                  }`}>Every {freq.label}</button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="font-mono text-xs">Cancel</Button>
            <Button type="submit" disabled={createMonitor.isPending} className="bg-primary text-primary-foreground font-mono text-xs gap-1.5">
              {createMonitor.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create Monitor
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default CreateMonitor;

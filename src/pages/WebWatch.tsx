import { motion } from "framer-motion";
import { Eye, Plus, Clock, ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackedUrl {
  id: string;
  url: string;
  name: string;
  status: "stable" | "changed" | "error";
  lastChecked: string;
  changeCount: number;
  lastChange?: string;
}

const mockUrls: TrackedUrl[] = [
  { id: "1", url: "https://competitor.com/pricing", name: "Competitor Pricing", status: "changed", lastChecked: "14m ago", changeCount: 3, lastChange: "Price tier renamed, new enterprise plan added" },
  { id: "2", url: "https://competitor.com/features", name: "Competitor Features", status: "stable", lastChecked: "30m ago", changeCount: 0 },
  { id: "3", url: "https://docs.example.com/api", name: "API Documentation", status: "changed", lastChecked: "1h ago", changeCount: 12, lastChange: "New endpoint added: /v2/webhooks" },
  { id: "4", url: "https://blog.rival.io/releases", name: "Rival Release Notes", status: "stable", lastChecked: "2h ago", changeCount: 0 },
  { id: "5", url: "https://competitor.com/about", name: "Competitor About Page", status: "error", lastChecked: "3h ago", changeCount: 0 },
];

const statusConfig = {
  stable: { label: "Stable", color: "bg-signal-green", textColor: "text-signal-green" },
  changed: { label: "Changed", color: "bg-signal-amber animate-pulse-slow", textColor: "text-signal-amber" },
  error: { label: "Error", color: "bg-signal-red", textColor: "text-signal-red" },
};

const WebWatch = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-mono text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Eye className="w-5 h-5 text-signal-blue" />
          Web Watch
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track web pages and detect changes in real-time</p>
      </div>
      <Button className="bg-primary text-primary-foreground font-mono text-sm">
        <Plus className="w-4 h-4 mr-2" /> Add URL
      </Button>
    </div>

    {/* Table */}
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
        <span className="col-span-4 font-mono text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3" /> Target
        </span>
        <span className="col-span-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Status</span>
        <span className="col-span-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Changes</span>
        <span className="col-span-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Last Check</span>
        <span className="col-span-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Details</span>
      </div>
      {mockUrls.map((item, i) => {
        const sc = statusConfig[item.status];
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-secondary/20 transition-colors cursor-pointer"
          >
            <div className="col-span-4">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                <ExternalLink className="w-2.5 h-2.5 shrink-0" /> {item.url}
              </p>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${sc.color}`} />
              <span className={`font-mono text-xs ${sc.textColor}`}>{sc.label}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="font-mono text-sm text-foreground">{item.changeCount}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {item.lastChecked}
              </span>
            </div>
            <div className="col-span-2 flex items-center">
              {item.lastChange ? (
                <span className="text-xs text-muted-foreground line-clamp-2">{item.lastChange}</span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default WebWatch;

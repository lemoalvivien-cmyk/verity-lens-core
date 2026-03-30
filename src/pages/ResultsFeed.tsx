import { Rss, Radio, Eye, FileSearch, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useEvidence } from "@/hooks/useData";
import { formatDistanceToNow } from "date-fns";

const ResultsFeed = () => {
  const { data: evidence = [], isLoading } = useEvidence();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Results Feed"
        subtitle="Chronological stream of all collected intelligence"
        icon={<Rss className="w-4 h-4 text-signal-green" />}
      />

      {evidence.length === 0 ? (
        <EmptyState
          icon={Rss}
          title="No results yet"
          description="Results will appear here as monitors collect data. Create a monitor and run it to start."
        />
      ) : (
        <div className="space-y-2">
          {evidence.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                {e.source_engine ? (
                  <Radio className="w-3.5 h-3.5 text-signal-green shrink-0" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-signal-blue shrink-0" />
                )}
                {e.source_engine && (
                  <span className="font-mono text-[10px] font-semibold text-signal-green">{e.source_engine}</span>
                )}
                {e.source_url && (
                  <span className="font-mono text-[10px] text-muted-foreground truncate">{e.source_url}</span>
                )}
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(e.captured_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground line-clamp-3">
                {e.raw_content?.substring(0, 200) || "No content captured"}
                {(e.raw_content?.length || 0) > 200 ? "..." : ""}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link to={`/evidence/${e.id}`} className="font-mono text-[10px] text-signal-green hover:underline flex items-center gap-1">
                  <FileSearch className="w-3 h-3" /> View evidence
                </Link>
                <span className="font-mono text-[9px] text-muted-foreground">Hash: {e.content_hash.substring(0, 12)}...</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsFeed;

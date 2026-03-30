import { useState } from "react";
import { Search, FileSearch, Radio, Eye, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { useEvidence } from "@/hooks/useData";
import { formatDistanceToNow } from "date-fns";

const SearchWorkspace = () => {
  const [query, setQuery] = useState("");
  const { data: evidence = [], isLoading } = useEvidence();

  // Client-side search over evidence content
  const filtered = query.length > 1
    ? evidence.filter((e) =>
        (e.raw_content?.toLowerCase().includes(query.toLowerCase())) ||
        (e.source_engine?.toLowerCase().includes(query.toLowerCase())) ||
        (e.source_url?.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Search"
        subtitle="Full-text search across all collected evidence"
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

      {isLoading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : query.length <= 1 ? (
        <EmptyState
          icon={Search}
          title="Search your workspace"
          description={evidence.length > 0
            ? `Type at least 2 characters to search across ${evidence.length} evidence snapshots.`
            : "No data to search yet. Create monitors and run them to start collecting intelligence."}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results found" description={`No matches for "${query}". Try different keywords.`} />
      ) : (
        <div className="space-y-2">
          <p className="font-mono text-[10px] text-muted-foreground">{filtered.length} results</p>
          {filtered.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                {e.source_engine ? <Radio className="w-3.5 h-3.5 text-signal-green" /> : <Eye className="w-3.5 h-3.5 text-signal-blue" />}
                <span className="font-mono text-[10px] text-muted-foreground">{e.source_engine || e.source_url || "Unknown"}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(e.captured_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground line-clamp-3">{e.raw_content?.substring(0, 300)}</p>
              <div className="mt-2">
                <Link to={`/evidence/${e.id}`} className="font-mono text-[10px] text-signal-green hover:underline flex items-center gap-1 w-fit">
                  <FileSearch className="w-3 h-3" /> View evidence
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWorkspace;

import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeads } from "@/hooks/useLeads";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Mail, Loader2, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const AdminSearch = () => {
  const [query, setQuery] = useState("");
  const { data: leads = [], isLoading } = useLeads({ search: query || undefined });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Recherche</h1>
        <p className="text-sm text-muted-foreground">Cherchez dans tous vos leads</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher par email, nom ou téléphone..." value={query} onChange={e => setQuery(e.target.value)}
          className="pl-9 bg-card border-border text-base h-12" autoFocus />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : query && leads.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <p className="text-muted-foreground text-sm">Aucun résultat pour « {query} »</p>
        </div>
      ) : query ? (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {leads.map(lead => (
            <div key={lead.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{lead.full_name || lead.email}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Mail className="w-3 h-3" /> {lead.email}
                    </span>
                    {lead.city_name && (
                      <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {lead.city_name}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: fr })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Tapez pour rechercher dans vos leads
        </div>
      )}
    </div>
  );
};

export default AdminSearch;

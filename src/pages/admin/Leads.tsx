import { useState } from "react";
import { useLeads, useCities, useCategories, useUpdateLead, useDeleteLead } from "@/hooks/useLeads";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2, MapPin, Loader2, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const STATUSES = [
  { value: "new", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "qualified", label: "Qualifié" },
  { value: "converted", label: "Converti" },
  { value: "archived", label: "Archivé" },
];

const AdminLeads = () => {
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { toast } = useToast();

  const { data: leads = [], isLoading } = useLeads({
    search: search || undefined,
    city_id: filterCity || undefined,
    category_id: filterCategory || undefined,
    status: filterStatus || undefined,
  });
  const { data: cities = [] } = useCities();
  const { data: categories = [] } = useCategories();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const handleStatusChange = (id: string, status: string) => {
    updateLead.mutate({ id, updates: { status } }, {
      onError: () => toast({ title: "Erreur", variant: "destructive" }),
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer ce lead ?")) return;
    deleteLead.mutate(id, {
      onError: () => toast({ title: "Erreur", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground">{leads.length} contacts collectés</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border" />
        </div>
        <Select value={filterCity} onValueChange={v => setFilterCity(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Ville" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={v => setFilterCategory(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => setFilterStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <p className="text-muted-foreground text-sm">Aucun lead trouvé</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase">Contact</th>
                <th className="px-4 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase">Ville</th>
                <th className="px-4 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase">Catégorie</th>
                <th className="px-4 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase">Statut</th>
                <th className="px-4 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase">Date</th>
                <th className="px-4 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{lead.full_name || "—"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {lead.city_name || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">{lead.category_name || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Select value={lead.status} onValueChange={v => handleStatusChange(lead.id, v)}>
                      <SelectTrigger className="h-7 w-[120px] text-[11px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: fr })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(lead.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;

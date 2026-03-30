import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLeads, useCities, useCategories, useTags, useUpdateLead, useDeleteLead, useLeadTags, useAddLeadTag, useRemoveLeadTag, useLogLeadEvent, useLeadEvents } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Trash2, MapPin, Loader2, Mail, Phone, X, Tag, MessageSquare, Clock, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

const STATUSES = [
  { value: "new", label: "Nouveau", color: "bg-signal-green/10 text-signal-green" },
  { value: "contacted", label: "Contacté", color: "bg-signal-blue/10 text-signal-blue" },
  { value: "qualified", label: "Qualifié", color: "bg-signal-amber/10 text-signal-amber" },
  { value: "converted", label: "Converti", color: "bg-primary/10 text-primary" },
  { value: "archived", label: "Archivé", color: "bg-muted text-muted-foreground" },
];

const PAGE_SIZE = 50;

const AdminLeads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filterCity, setFilterCity] = useState(searchParams.get("city") || "");
  const [filterCategory, setFilterCategory] = useState(searchParams.get("category") || "");
  const [filterStatus, setFilterStatus] = useState(searchParams.get("status") || "");
  const [filterDateFrom, setFilterDateFrom] = useState(searchParams.get("from") || "");
  const [filterDateTo, setFilterDateTo] = useState(searchParams.get("to") || "");
  const [page, setPage] = useState(0);
  const detailId = searchParams.get("detail");

  // Debounce search
  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  });
  const { toast } = useToast();

  const { data: leads = [], isLoading } = useLeads({
    search: search || undefined,
    city_id: filterCity || undefined,
    category_id: filterCategory || undefined,
    status: filterStatus || undefined,
    date_from: filterDateFrom || undefined,
    date_to: filterDateTo || undefined,
  });
  const { data: cities = [] } = useCities();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const logEvent = useLogLeadEvent();

  const selectedLead = useMemo(() => leads.find(l => l.id === detailId), [leads, detailId]);

  const handleStatusChange = (id: string, status: string, oldStatus: string) => {
    updateLead.mutate({ id, updates: { status } }, {
      onSuccess: () => {
        logEvent.mutate({ lead_id: id, event_type: "status_change", metadata: { from: oldStatus, to: status } });
      },
      onError: () => toast({ title: "Erreur", variant: "destructive" }),
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer ce lead ?")) return;
    deleteLead.mutate(id, {
      onError: () => toast({ title: "Erreur", variant: "destructive" }),
    });
    if (detailId === id) setSearchParams({});
  };

  const openDetail = (id: string) => setSearchParams({ detail: id });
  const closeDetail = () => setSearchParams({});

  const clearFilters = () => {
    setSearch(""); setFilterCity(""); setFilterCategory(""); setFilterStatus(""); setFilterDateFrom(""); setFilterDateTo("");
  };

  const hasFilters = search || filterCity || filterCategory || filterStatus || filterDateFrom || filterDateTo;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads.length} contacts {hasFilters ? "(filtré)" : ""}</p>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="font-mono text-xs gap-1">
            <X className="w-3 h-3" /> Réinitialiser
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher email, nom, téléphone, ville..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border" />
        </div>
        <Select value={filterCity} onValueChange={v => setFilterCity(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[150px] bg-card"><SelectValue placeholder="Ville" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={v => setFilterCategory(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[150px] bg-card"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => setFilterStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
          className="w-[140px] bg-card border-border font-mono text-xs" placeholder="Du" />
        <Input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
          className="w-[140px] bg-card border-border font-mono text-xs" placeholder="Au" />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : leads.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <p className="text-muted-foreground text-sm">Aucun lead trouvé</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] text-muted-foreground uppercase">Contact</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] text-muted-foreground uppercase hidden md:table-cell">Ville</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] text-muted-foreground uppercase hidden lg:table-cell">Catégorie</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] text-muted-foreground uppercase">Statut</th>
                <th className="px-4 py-2.5 text-left font-mono text-[10px] text-muted-foreground uppercase hidden md:table-cell">Date</th>
                <th className="px-4 py-2.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => openDetail(lead.id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{lead.full_name || "—"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-0.5 hidden sm:flex">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                      {lead.city_name ? <><MapPin className="w-3 h-3" /> {lead.city_name}</> : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-mono text-xs text-muted-foreground">{lead.category_name || "—"}</span>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <Select value={lead.status} onValueChange={v => handleStatusChange(lead.id, v, lead.status)}>
                      <SelectTrigger className="h-7 w-[110px] text-[11px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap hidden md:table-cell">
                    {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(lead.id)} className="text-muted-foreground hover:text-foreground transition-colors" title="Détail">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(lead.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={open => { if (!open) closeDetail(); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <LeadDetail lead={selectedLead} tags={tags} onClose={closeDetail} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function LeadDetail({ lead, tags, onClose, onStatusChange, onDelete }: {
  lead: any; tags: any[]; onClose: () => void;
  onStatusChange: (id: string, status: string, old: string) => void;
  onDelete: (id: string) => void;
}) {
  const { toast } = useToast();
  const updateLead = useUpdateLead();
  const { data: leadTags = [] } = useLeadTags(lead.id);
  const { data: events = [] } = useLeadEvents(lead.id);
  const addTag = useAddLeadTag();
  const removeTag = useRemoveLeadTag();
  const [notes, setNotes] = useState(lead.notes_admin || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const assignedTagIds = leadTags.map((lt: any) => lt.tag_id);
  const availableTags = tags.filter(t => !assignedTagIds.includes(t.id));

  const saveNotes = async () => {
    setSavingNotes(true);
    updateLead.mutate({ id: lead.id, updates: { notes_admin: notes } }, {
      onSuccess: () => { setSavingNotes(false); toast({ title: "Notes enregistrées" }); },
      onError: () => { setSavingNotes(false); toast({ title: "Erreur", variant: "destructive" }); },
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">{lead.full_name || lead.email}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-2">
        {/* Contact info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-0.5">Email</p>
            <p>{lead.email}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-0.5">Téléphone</p>
            <p>{lead.phone || "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-0.5">Ville</p>
            <p className="flex items-center gap-1">{lead.city_name ? <><MapPin className="w-3 h-3 text-signal-green" /> {lead.city_name}</> : "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-0.5">Code postal</p>
            <p>{lead.postal_code || "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-0.5">Catégorie</p>
            <p>{lead.category_name || "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-0.5">Statut</p>
            <Select value={lead.status} onValueChange={v => onStatusChange(lead.id, v, lead.status)}>
              <SelectTrigger className="h-7 w-full text-[11px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Message */}
        {lead.message && (
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Message</p>
            <p className="text-sm bg-secondary/30 rounded-md p-3 whitespace-pre-wrap">{lead.message}</p>
          </div>
        )}

        {/* Tags */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1.5 flex items-center gap-1"><Tag className="w-3 h-3" /> Tags</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {leadTags.map((lt: any) => (
              <span key={lt.id} className="inline-flex items-center gap-1 bg-secondary rounded-full px-2.5 py-0.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lt.tags?.color || "#6366f1" }} />
                {lt.tags?.name}
                <button onClick={() => removeTag.mutate({ lead_id: lead.id, tag_id: lt.tag_id })} className="text-muted-foreground hover:text-destructive ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {leadTags.length === 0 && <span className="text-xs text-muted-foreground">Aucun tag</span>}
          </div>
          {availableTags.length > 0 && (
            <Select onValueChange={v => addTag.mutate({ lead_id: lead.id, tag_id: v })}>
              <SelectTrigger className="h-7 w-[160px] text-[11px]"><SelectValue placeholder="+ Ajouter tag" /></SelectTrigger>
              <SelectContent>
                {availableTags.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color || "#6366f1" }} />
                      {t.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Notes admin */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">Notes admin</p>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes internes..."
            className="bg-card border-border min-h-[80px] text-sm" />
          <Button size="sm" onClick={saveNotes} disabled={savingNotes} className="mt-2 font-mono text-xs">
            {savingNotes ? "..." : "Enregistrer"}
          </Button>
        </div>

        {/* Events history */}
        {events.length > 0 && (
          <div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Historique</p>
            <div className="space-y-1">
              {events.slice(0, 10).map((ev: any) => (
                <div key={ev.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono text-[10px]">{format(new Date(ev.created_at), "dd/MM HH:mm")}</span>
                  <span>
                    {ev.event_type === "status_change" ? `Statut: ${ev.metadata?.from} → ${ev.metadata?.to}` : ev.event_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="border-t border-border pt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <div>
            <span>Source: {lead.source_page}</span>
            {lead.source_campaign && <span> · {lead.source_campaign}</span>}
          </div>
          <span>Créé le {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm")}</span>
        </div>

        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={() => { onDelete(lead.id); onClose(); }} className="font-mono text-xs gap-1">
            <Trash2 className="w-3 h-3" /> Supprimer
          </Button>
        </div>
      </div>
    </>
  );
}

export default AdminLeads;

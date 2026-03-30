import { useMemo, useState } from "react";
import { useLeadsForQuality, useDeleteLeads, findDuplicateEmails } from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2, Users, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const PAGE_SIZE = 200;

const AdminQuality = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useLeadsForQuality(page);
  const leads = data?.leads ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const deleteLeads = useDeleteLeads();
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string | null>(null);

  const duplicates = useMemo(() => {
    return findDuplicateEmails(leads.map(l => ({
      id: l.id, email: l.email, full_name: l.full_name, created_at: l.created_at, city_name: l.city_name,
    })));
  }, [leads]);

  const totalDuplicateLeads = duplicates.reduce((sum, d) => sum + d.leads.length - 1, 0);

  const handleDeleteDuplicates = (email: string, keepId: string, deleteIds: string[]) => {
    if (!window.confirm(`Supprimer ${deleteIds.length} doublon(s) pour ${email} ? Le plus ancien sera conservé.`)) return;
    setProcessing(email);
    deleteLeads.mutate(deleteIds, {
      onSuccess: () => { setProcessing(null); toast({ title: "Doublons supprimés" }); },
      onError: () => { setProcessing(null); toast({ title: "Erreur", variant: "destructive" }); },
    });
  };

  const handleDeleteAllDuplicates = () => {
    const allDeleteIds = duplicates.flatMap(d => d.leads.slice(1).map(l => l.id));
    if (allDeleteIds.length === 0) return;
    if (!window.confirm(`Supprimer ${allDeleteIds.length} doublons au total ? Le plus ancien de chaque groupe sera conservé.`)) return;
    setProcessing("all");
    deleteLeads.mutate(allDeleteIds, {
      onSuccess: () => { setProcessing(null); toast({ title: `${allDeleteIds.length} doublons supprimés` }); },
      onError: () => { setProcessing(null); toast({ title: "Erreur", variant: "destructive" }); },
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Qualité des données</h1>
        <p className="text-sm text-muted-foreground">Détection des doublons et nettoyage</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] text-muted-foreground uppercase">Total leads</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="font-mono text-2xl font-bold">{total}</p>
        </div>
        <div className={`bg-card border rounded-lg p-4 ${duplicates.length > 0 ? "border-signal-amber/30" : "border-border"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] text-muted-foreground uppercase">Doublons (page)</p>
            <AlertTriangle className={`w-4 h-4 ${duplicates.length > 0 ? "text-signal-amber" : "text-muted-foreground"}`} />
          </div>
          <p className="font-mono text-2xl font-bold">{duplicates.length}</p>
          <p className="font-mono text-[10px] text-muted-foreground">{totalDuplicateLeads} leads supprimables</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] text-muted-foreground uppercase">Taux unique</p>
            <Shield className="w-4 h-4 text-signal-green" />
          </div>
          <p className="font-mono text-2xl font-bold">
            {leads.length > 0 ? Math.round(((leads.length - totalDuplicateLeads) / leads.length) * 100) : 100}%
          </p>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          Page {page + 1} / {totalPages} — {total} leads
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="h-7 w-7 p-0">
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="h-7 w-7 p-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Duplicates */}
      {duplicates.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <Shield className="w-10 h-10 text-signal-green mx-auto mb-3" />
          <p className="text-sm font-medium">Aucun doublon détecté sur cette page</p>
          <p className="text-xs text-muted-foreground mt-1">Naviguez entre les pages pour vérifier</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              {duplicates.length} groupe{duplicates.length > 1 ? "s" : ""} de doublons
            </h2>
            <Button variant="destructive" size="sm" onClick={handleDeleteAllDuplicates}
              disabled={processing === "all"} className="font-mono text-xs gap-1.5">
              {processing === "all" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              Supprimer tous les doublons
            </Button>
          </div>

          <div className="space-y-3">
            {duplicates.map(({ email, leads: group }) => (
              <div key={email} className="bg-card border border-border rounded-lg">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-signal-amber" />
                    <span className="text-sm font-medium">{email}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">({group.length} entrées)</span>
                  </div>
                  <Button variant="outline" size="sm" className="font-mono text-xs gap-1"
                    disabled={processing === email}
                    onClick={() => handleDeleteDuplicates(email, group[0].id, group.slice(1).map(l => l.id))}>
                    {processing === email ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    Garder le plus ancien
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {group.map((l, i) => (
                    <div key={l.id} className={`px-4 py-2.5 flex items-center justify-between text-sm ${i === 0 ? "bg-signal-green/5" : ""}`}>
                      <div className="flex items-center gap-3">
                        {i === 0 && <span className="font-mono text-[9px] bg-signal-green/10 text-signal-green px-1.5 py-0.5 rounded">GARDER</span>}
                        {i > 0 && <span className="font-mono text-[9px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">SUPPR.</span>}
                        <span className="text-muted-foreground">{l.full_name || "—"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        {l.city_name && <span className="font-mono text-[10px]">{l.city_name}</span>}
                        <span className="font-mono text-[10px]">{format(new Date(l.created_at), "dd/MM/yyyy HH:mm")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminQuality;

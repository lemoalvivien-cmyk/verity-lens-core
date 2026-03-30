import { useState } from "react";
import { useLeads, useCities, useCategories } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminExport = () => {
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const { data: leads = [], isLoading } = useLeads({
    city_id: filterCity || undefined,
    category_id: filterCategory || undefined,
    status: filterStatus || undefined,
  });
  const { data: cities = [] } = useCities();
  const { data: categories = [] } = useCategories();

  const exportCSV = () => {
    if (leads.length === 0) return;
    setExporting(true);

    const headers = ["Email", "Nom", "Téléphone", "Ville", "Code postal", "Catégorie", "Statut", "Message", "Source", "Consentement", "Date"];
    const rows = leads.map(l => [
      l.email, l.full_name || "", l.phone || "", l.city_name || "", l.postal_code || "",
      l.category_name || "", l.status, l.message || "", l.source_page || "",
      l.consent ? "Oui" : "Non", new Date(l.created_at).toLocaleString("fr-FR"),
    ]);

    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Log export
    supabase.from("exports_log").insert({
      user_id: (supabase.auth as any).currentUser?.id || "unknown",
      export_type: "csv",
      filters: { city_id: filterCity, category_id: filterCategory, status: filterStatus },
      row_count: leads.length,
    }).then(() => {});

    setExporting(false);
    toast({ title: "Export réussi", description: `${leads.length} leads exportés en CSV.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Export</h1>
        <p className="text-sm text-muted-foreground">Exportez vos leads filtrés en CSV</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={filterCity} onValueChange={v => setFilterCity(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Ville" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
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
            <SelectItem value="new">Nouveau</SelectItem>
            <SelectItem value="contacted">Contacté</SelectItem>
            <SelectItem value="qualified">Qualifié</SelectItem>
            <SelectItem value="converted">Converti</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 text-center">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <>
            <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-bold">{leads.length} leads</p>
            <p className="text-sm text-muted-foreground mb-4">correspondent aux filtres sélectionnés</p>
            <Button onClick={exportCSV} disabled={exporting || leads.length === 0} className="font-mono text-sm gap-2">
              <Download className="w-4 h-4" /> Exporter en CSV
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminExport;

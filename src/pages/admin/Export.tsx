import { useState } from "react";
import { useLeads, useCities, useCategories, useExportsLog, useLogExport, generateCSV, downloadBlob } from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, Loader2, FileSpreadsheet, Clock, Table2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const STATUSES = [
  { value: "new", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "qualified", label: "Qualifié" },
  { value: "converted", label: "Converti" },
  { value: "archived", label: "Archivé" },
];

const AdminExport = () => {
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const { toast } = useToast();
  const logExport = useLogExport();

  const { data, isLoading } = useLeads({
    city_id: filterCity || undefined,
    category_id: filterCategory || undefined,
    status: filterStatus || undefined,
    date_from: filterDateFrom || undefined,
    date_to: filterDateTo || undefined,
  });
  const leads = data?.leads ?? [];
  const leadsCount = data?.total ?? 0;
  const { data: cities = [] } = useCities();
  const { data: categories = [] } = useCategories();
  const { data: exportLogs = [] } = useExportsLog();

  const filters = { city_id: filterCity, category_id: filterCategory, status: filterStatus, date_from: filterDateFrom, date_to: filterDateTo };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const csv = generateCSV(leads);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `leads_export_${format(new Date(), "yyyy-MM-dd_HHmm")}.csv`);
    logExport.mutate({ export_type: "csv", filters, row_count: leads.length });
    toast({ title: "Export CSV", description: `${leads.length} leads exportés.` });
  };

  const exportXLSX = () => {
    if (leads.length === 0) return;
    // Build a simple XLSX-compatible XML (SpreadsheetML)
    const headers = ["Email", "Nom", "Téléphone", "Ville", "Code postal", "Catégorie", "Statut", "Message", "Source", "Consentement", "Date"];
    const rows = leads.map(l => [
      l.email, l.full_name || "", l.phone || "", l.city_name || "", l.postal_code || "",
      l.category_name || "", l.status, (l.message || "").replace(/\n/g, " "), l.source_page || "",
      l.consent ? "Oui" : "Non", new Date(l.created_at).toLocaleString("fr-FR"),
    ]);

    let xml = '<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n';
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
    xml += '<Worksheet ss:Name="Leads"><Table>\n';
    xml += '<Row>' + headers.map(h => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join("") + '</Row>\n';
    rows.forEach(row => {
      xml += '<Row>' + row.map(c => `<Cell><Data ss:Type="String">${escapeXml(String(c))}</Data></Cell>`).join("") + '</Row>\n';
    });
    xml += '</Table></Worksheet></Workbook>';

    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    downloadBlob(blob, `leads_export_${format(new Date(), "yyyy-MM-dd_HHmm")}.xls`);
    logExport.mutate({ export_type: "xlsx", filters, row_count: leads.length });
    toast({ title: "Export Excel", description: `${leads.length} leads exportés.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Export</h1>
        <p className="text-sm text-muted-foreground">Exportez vos leads filtrés en CSV ou Excel</p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Filtres d'export</p>
        <div className="flex flex-wrap gap-2">
          <Select value={filterCity} onValueChange={v => setFilterCity(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Ville" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={v => setFilterCategory(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Catégorie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => setFilterStatus(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
            className="w-[140px] bg-background border-border font-mono text-xs" />
          <Input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
            className="w-[140px] bg-background border-border font-mono text-xs" />
        </div>
      </div>

      {/* Export actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        {isLoading ? (
          <div className="flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="text-center">
            <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-2xl font-bold font-mono">{leads.length}</p>
            <p className="text-sm text-muted-foreground mb-5">leads correspondent aux filtres</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={exportCSV} disabled={leads.length === 0} variant="outline" className="font-mono text-sm gap-2">
                <Table2 className="w-4 h-4" /> Export CSV
              </Button>
              <Button onClick={exportXLSX} disabled={leads.length === 0} className="font-mono text-sm gap-2">
                <Download className="w-4 h-4" /> Export Excel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Export logs */}
      {exportLogs.length > 0 && (
        <div className="bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-mono text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Historique des exports</h3>
          </div>
          <div className="divide-y divide-border">
            {exportLogs.slice(0, 10).map(log => (
              <div key={log.id} className="px-4 py-2.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground uppercase">{log.export_type}</span>
                  <span className="font-mono text-xs font-semibold">{log.row_count} leads</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function escapeXml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export default AdminExport;

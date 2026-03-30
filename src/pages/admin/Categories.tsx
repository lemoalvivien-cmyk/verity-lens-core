import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCategories, useAllLeads } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Trash2, Loader2, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subDays } from "date-fns";

const AdminCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { data: leads = [] } = useAllLeads();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const catStats = useMemo(() => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const map = new Map<string, { total: number; recent: number }>();
    leads.forEach(l => {
      if (!l.category_id) return;
      if (!map.has(l.category_id)) map.set(l.category_id, { total: 0, recent: 0 });
      const entry = map.get(l.category_id)!;
      entry.total++;
      if (new Date(l.created_at) >= sevenDaysAgo) entry.recent++;
    });
    return map;
  }, [leads]);

  const sortedCats = useMemo(() => {
    return [...categories].sort((a, b) => (catStats.get(b.id)?.total || 0) - (catStats.get(a.id)?.total || 0));
  }, [categories, catStats]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüç]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("categories").insert({
      name: name.trim(), slug, description: description.trim() || null,
    });
    setAdding(false);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { setName(""); setDescription(""); qc.invalidateQueries({ queryKey: ["categories"] }); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else qc.invalidateQueries({ queryKey: ["categories"] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Catégories</h1>
        <p className="text-sm text-muted-foreground">{categories.length} catégories · {leads.filter(l => l.category_id).length} leads catégorisés</p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
        <Input placeholder="Nom de la catégorie" value={name} onChange={e => setName(e.target.value)}
          className="bg-card border-border flex-1 min-w-[150px]" required />
        <Input placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)}
          className="bg-card border-border flex-1 min-w-[150px]" />
        <Button type="submit" disabled={adding} className="font-mono text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </Button>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : sortedCats.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <FolderOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Aucune catégorie configurée</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] text-muted-foreground uppercase">Catégorie</th>
                <th className="px-4 py-2.5 text-right font-mono text-[10px] text-muted-foreground uppercase">Leads</th>
                <th className="px-4 py-2.5 text-right font-mono text-[10px] text-muted-foreground uppercase hidden sm:table-cell">7 derniers jours</th>
                <th className="px-4 py-2.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedCats.map(cat => {
                const stats = catStats.get(cat.id) || { total: 0, recent: 0 };
                return (
                  <tr key={cat.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <FolderOpen className="w-3.5 h-3.5 text-signal-blue shrink-0" />
                          {cat.name}
                        </p>
                        {cat.description && <p className="font-mono text-[10px] text-muted-foreground ml-5">{cat.description}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/app/leads?category=${cat.id}`} className="font-mono text-sm font-semibold hover:text-signal-blue transition-colors flex items-center justify-end gap-1">
                        <Users className="w-3 h-3" /> {stats.total}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className={`font-mono text-xs flex items-center justify-end gap-1 ${stats.recent > 0 ? "text-signal-green" : "text-muted-foreground"}`}>
                        {stats.recent > 0 && <TrendingUp className="w-3 h-3" />}
                        +{stats.recent}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(cat.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

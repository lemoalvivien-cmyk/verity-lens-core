import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCities, useLeadCountsByField, useLeadCountsByFieldRecent } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2, Loader2, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCities = () => {
  const { data: cities = [], isLoading } = useCities();
  const { data: cityTotals } = useLeadCountsByField("city_id");
  const { data: cityRecent } = useLeadCountsByFieldRecent("city_id");
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [region, setRegion] = useState("");
  const [adding, setAdding] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const totalGeoLeads = useMemo(() => {
    if (!cityTotals) return 0;
    let sum = 0;
    cityTotals.forEach(v => sum += v);
    return sum;
  }, [cityTotals]);

  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => (cityTotals?.get(b.id) || 0) - (cityTotals?.get(a.id) || 0));
  }, [cities, cityTotals]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüç]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("cities").insert({
      name: name.trim(), slug, postal_code: postalCode.trim() || null, region: region.trim() || null,
    });
    setAdding(false);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { setName(""); setPostalCode(""); setRegion(""); qc.invalidateQueries({ queryKey: ["cities"] }); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette ville ?")) return;
    const { error } = await supabase.from("cities").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else qc.invalidateQueries({ queryKey: ["cities"] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Villes</h1>
        <p className="text-sm text-muted-foreground">{cities.length} villes · {totalGeoLeads} leads géolocalisés</p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
        <Input placeholder="Nom de la ville" value={name} onChange={e => setName(e.target.value)}
          className="bg-card border-border flex-1 min-w-[150px]" required />
        <Input placeholder="Code postal" value={postalCode} onChange={e => setPostalCode(e.target.value)}
          className="bg-card border-border w-[120px]" />
        <Input placeholder="Région" value={region} onChange={e => setRegion(e.target.value)}
          className="bg-card border-border w-[140px]" />
        <Button type="submit" disabled={adding} className="font-mono text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </Button>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : sortedCities.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Aucune ville configurée</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-2.5 text-left font-mono text-[10px] text-muted-foreground uppercase">Ville</th>
                <th className="px-4 py-2.5 text-right font-mono text-[10px] text-muted-foreground uppercase">Leads</th>
                <th className="px-4 py-2.5 text-right font-mono text-[10px] text-muted-foreground uppercase hidden sm:table-cell">7 derniers jours</th>
                <th className="px-4 py-2.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedCities.map(city => {
                const total = cityTotals?.get(city.id) || 0;
                const recent = cityRecent?.get(city.id) || 0;
                return (
                  <tr key={city.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-signal-green shrink-0" />
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{[city.postal_code, city.region].filter(Boolean).join(" · ")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/app/leads?city=${city.id}`} className="font-mono text-sm font-semibold hover:text-signal-green transition-colors flex items-center justify-end gap-1">
                        <Users className="w-3 h-3" /> {total}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className={`font-mono text-xs flex items-center justify-end gap-1 ${recent > 0 ? "text-signal-green" : "text-muted-foreground"}`}>
                        {recent > 0 && <TrendingUp className="w-3 h-3" />}
                        +{recent}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(city.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
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

export default AdminCities;

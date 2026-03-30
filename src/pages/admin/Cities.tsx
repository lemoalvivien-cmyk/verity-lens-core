import { useState } from "react";
import { useCities } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCities = () => {
  const { data: cities = [], isLoading } = useCities();
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [region, setRegion] = useState("");
  const [adding, setAdding] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabase.from("cities").insert({
      name: name.trim(),
      slug,
      postal_code: postalCode.trim() || null,
      region: region.trim() || null,
    });
    setAdding(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setName(""); setPostalCode(""); setRegion("");
      qc.invalidateQueries({ queryKey: ["cities"] });
    }
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
        <p className="text-sm text-muted-foreground">{cities.length} villes enregistrées</p>
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
      ) : cities.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Aucune ville configurée</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {cities.map(city => (
            <div key={city.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-signal-green" />
                <div>
                  <p className="text-sm font-medium">{city.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {[city.postal_code, city.region].filter(Boolean).join(" · ") || city.slug}
                  </p>
                </div>
              </div>
              <button onClick={() => handleDelete(city.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCities;

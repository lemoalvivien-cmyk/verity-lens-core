import { useState } from "react";
import { useCategories } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
        <p className="text-sm text-muted-foreground">{categories.length} catégories actives</p>
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
      ) : categories.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <FolderOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Aucune catégorie configurée</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {categories.map(cat => (
            <div key={cat.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{cat.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{cat.description || cat.slug}</p>
              </div>
              <button onClick={() => handleDelete(cat.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

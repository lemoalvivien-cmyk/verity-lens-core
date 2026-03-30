import { useState } from "react";
import { useTags } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminTags = () => {
  const { data: tags = [], isLoading } = useTags();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [adding, setAdding] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const { error } = await supabase.from("tags").insert({ name: name.trim(), color });
    setAdding(false);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { setName(""); qc.invalidateQueries({ queryKey: ["tags"] }); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce tag ?")) return;
    const { error } = await supabase.from("tags").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else qc.invalidateQueries({ queryKey: ["tags"] });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Tags</h1>
        <p className="text-sm text-muted-foreground">{tags.length} tags créés</p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
        <Input placeholder="Nom du tag" value={name} onChange={e => setName(e.target.value)}
          className="bg-card border-border flex-1 min-w-[150px]" required />
        <div className="flex items-center gap-2">
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer" />
        </div>
        <Button type="submit" disabled={adding} className="font-mono text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </Button>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : tags.length === 0 ? (
        <div className="bg-card border border-border rounded-lg px-4 py-12 text-center">
          <Tag className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Aucun tag créé</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color || "#6366f1" }} />
              <span className="text-sm font-medium">{tag.name}</span>
              <button onClick={() => handleDelete(tag.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-1" title="Supprimer">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTags;

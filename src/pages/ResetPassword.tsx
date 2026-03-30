import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Mot de passe mis à jour." });
      navigate("/app");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="font-mono text-sm text-muted-foreground">Lien invalide ou expiré.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="font-mono text-lg font-bold text-foreground tracking-tight">LeadOS</h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Collecte de leads</p>
            </div>
          </div>
          <h2 className="font-mono text-sm text-muted-foreground">Nouveau mot de passe</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-xs text-muted-foreground">Nouveau mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="pl-10 bg-card border-border font-mono text-sm" required minLength={6} />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-mono text-sm">
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
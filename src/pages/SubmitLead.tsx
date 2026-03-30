import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface City { id: string; name: string; slug: string; }
interface Category { id: string; name: string; slug: string; }

const SubmitLead = () => {
  const [searchParams] = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    city_id: searchParams.get("city") || "",
    postal_code: "",
    category_id: searchParams.get("category") || "",
    message: "",
    consent: false,
  });

  useEffect(() => {
    supabase.from("cities").select("id, name, slug").order("name").then(({ data }) => setCities(data || []));
    supabase.from("categories").select("id, name, slug").order("name").then(({ data }) => setCategories(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      toast({ title: "Consentement requis", description: "Veuillez accepter les conditions.", variant: "destructive" });
      return;
    }
    if (!form.email.trim()) return;

    setLoading(true);
    const cityObj = cities.find(c => c.id === form.city_id);
    const catObj = categories.find(c => c.id === form.category_id);

    const { error } = await supabase.from("leads").insert({
      email: form.email.trim(),
      full_name: form.full_name.trim() || null,
      phone: form.phone.trim() || null,
      city_id: form.city_id || null,
      city_name: cityObj?.name || null,
      postal_code: form.postal_code.trim() || null,
      category_id: form.category_id || null,
      category_name: catObj?.name || null,
      message: form.message.trim() || null,
      source_page: window.location.pathname + window.location.search,
      source_campaign: searchParams.get("utm_campaign") || null,
      consent: form.consent,
      consent_text_version: "v1",
    });

    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le formulaire.", variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <CheckCircle className="w-12 h-12 text-signal-green mx-auto" />
          <h2 className="text-xl font-bold">Merci !</h2>
          <p className="text-muted-foreground text-sm">Votre demande a bien été enregistrée. Nous vous recontacterons rapidement.</p>
          <Link to="/">
            <Button variant="outline" className="font-mono text-xs gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight">LeadOS</span>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-mono text-xs">Connexion</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Soumettre un contact</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Remplissez le formulaire ci-dessous. Vos informations seront traitées en toute confidentialité.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs">Email *</Label>
              <Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="vous@exemple.com" className="bg-card border-border" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Nom complet</Label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Jean Dupont" className="bg-card border-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs">Téléphone</Label>
              <Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="06 12 34 56 78" className="bg-card border-border" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Code postal</Label>
              <Input value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))}
                placeholder="75001" className="bg-card border-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs">Ville</Label>
              <Select value={form.city_id} onValueChange={v => setForm(f => ({ ...f, city_id: v }))}>
                <SelectTrigger className="bg-card border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Catégorie</Label>
              <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                <SelectTrigger className="bg-card border-border"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs">Message</Label>
            <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Décrivez votre besoin..." className="bg-card border-border min-h-[100px]" />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="consent" checked={form.consent}
              onCheckedChange={(v) => setForm(f => ({ ...f, consent: v === true }))} className="mt-0.5" />
            <Label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed">
              J'accepte que mes données soient collectées et traitées conformément à la politique de confidentialité. *
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-mono text-sm">
            {loading ? "Envoi..." : "Envoyer ma demande"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SubmitLead;

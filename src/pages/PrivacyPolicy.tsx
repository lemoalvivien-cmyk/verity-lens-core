import { Link } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "1. Responsable du traitement",
    content: "VLM Consulting — Croix, 59170, France\nContact DPO : dpo@vlm-consulting.fr",
  },
  {
    title: "2. Finalité du traitement",
    content:
      "Les données collectées via nos formulaires sont utilisées exclusivement pour la mise en relation commerciale entre les utilisateurs et nos partenaires locaux.",
  },
  {
    title: "3. Base légale",
    content:
      "Le traitement est fondé sur votre consentement explicite (Article 6.1.a du Règlement Général sur la Protection des Données — RGPD).",
  },
  {
    title: "4. Données collectées",
    content:
      "Nous collectons les données suivantes :\n• Adresse email (obligatoire)\n• Nom complet\n• Numéro de téléphone\n• Code postal\n• Ville\n• Catégorie de demande\n• Message libre",
  },
  {
    title: "5. Durée de conservation",
    content:
      "Vos données personnelles sont conservées pendant une durée maximale de 24 mois à compter du dernier contact. Passé ce délai, elles sont automatiquement supprimées.",
  },
  {
    title: "6. Vos droits",
    content:
      "Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès à vos données\n• Droit de rectification\n• Droit à l'effacement (« droit à l'oubli »)\n• Droit à la portabilité des données\n• Droit d'opposition au traitement\n\nPour exercer ces droits, contactez-nous à l'adresse : dpo@vlm-consulting.fr",
  },
  {
    title: "7. Sécurité des données",
    content:
      "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction.",
  },
  {
    title: "8. Partage des données",
    content:
      "Vos données ne sont jamais vendues. Elles peuvent être partagées avec nos partenaires locaux dans le cadre strict de la mise en relation commerciale pour laquelle vous avez donné votre consentement.",
  },
  {
    title: "9. Réclamation",
    content:
      "Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) — www.cnil.fr.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight">LeadOS</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="font-mono text-xs gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-muted-foreground text-sm mb-10">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-mono text-sm font-semibold mb-2">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">LeadOS</span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} LeadOS. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;

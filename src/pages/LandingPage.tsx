import { Link } from "react-router-dom";
import { Activity, ArrowRight, MapPin, FolderOpen, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "Capture instantanée", desc: "Formulaires publics optimisés pour la conversion. Zéro friction." },
  { icon: MapPin, title: "Segmentation géo", desc: "Chaque lead est rattaché à une ville et un code postal exploitable." },
  { icon: FolderOpen, title: "Catégorisation", desc: "Classez vos leads par secteur, besoin ou type de demande." },
  { icon: BarChart3, title: "Cockpit admin", desc: "Tableau de bord privé pour filtrer, trier, taguer et exporter." },
  { icon: Shield, title: "Consentement tracé", desc: "RGPD natif. Chaque lead porte la preuve de son consentement." },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight">LeadOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-mono text-xs">Connexion</Button>
            </Link>
            <Link to="/submit">
              <Button size="sm" className="font-mono text-xs bg-primary text-primary-foreground">
                Soumettre un contact
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs text-signal-green uppercase tracking-widest mb-4">
            Machine de collecte de leads
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
            Captez, classez, exploitez
            <br />
            <span className="text-muted-foreground">vos contacts locaux.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Collectez des leads géolocalisés et catégorisés via des formulaires publics.
            Exploitez-les dans un cockpit privé ultra efficace. Export CSV/Excel en un clic.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/submit">
              <Button size="lg" className="font-mono text-sm bg-primary text-primary-foreground gap-2">
                Soumettre un contact <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="font-mono text-sm">
                Découvrir
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { stat: "Géolocalisé", label: "Chaque lead rattaché à une ville" },
            { stat: "Catégorisé", label: "Segmentation par secteur d'activité" },
            { stat: "Exportable", label: "CSV & Excel en un clic" },
          ].map((item) => (
            <div key={item.stat}>
              <p className="font-mono text-lg font-bold text-signal-green">{item.stat}</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Fonctionnalités</p>
        <h2 className="text-2xl font-bold mb-10">Tout ce qu'il faut. Rien de plus.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-lg p-5"
            >
              <f.icon className="w-5 h-5 text-signal-green mb-3" />
              <h3 className="font-mono text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-3">Prêt à collecter ?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Soumettez votre premier contact ou connectez-vous au cockpit admin.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/submit">
              <Button size="lg" className="font-mono text-sm bg-primary text-primary-foreground gap-2">
                Soumettre un contact <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="font-mono text-sm">
                Accès admin
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">LeadOS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              Politique de confidentialité
            </Link>
            <p className="font-mono text-[10px] text-muted-foreground">
              © {new Date().getFullYear()} LeadOS. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

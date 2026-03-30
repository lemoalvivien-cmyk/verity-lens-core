import { Link } from "react-router-dom";
import { Activity, Shield, Eye, Radio, ArrowRight, Search, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    icon: Radio,
    title: "AI Query Monitoring",
    desc: "Track what AI engines say about your brand, products, or competitors — with cryptographic proof.",
  },
  {
    icon: Eye,
    title: "Web Change Detection",
    desc: "Monitor any webpage for changes. Get alerted instantly with full diff history.",
  },
  {
    icon: Shield,
    title: "Evidence-Grade Snapshots",
    desc: "Every result is hashed, timestamped, and stored. Immutable proof you can audit anytime.",
  },
  {
    icon: GitCompare,
    title: "Semantic Diff Engine",
    desc: "Go beyond text diffs. Understand what actually changed in meaning, not just characters.",
  },
  {
    icon: Search,
    title: "Full-Text Intelligence Search",
    desc: "Search across all your collected intelligence — snapshots, diffs, alerts — instantly.",
  },
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
            <span className="font-mono text-sm font-bold tracking-tight">TruthOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-mono text-xs">
                Sign in
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="font-mono text-xs bg-primary text-primary-foreground">
                Get Started
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
            Web Intelligence Operating System
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
            We don't just give results.
            <br />
            <span className="text-muted-foreground">We give provable truth.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Monitor AI engines and web pages. Collect evidence-grade snapshots.
            Detect changes with semantic diffs. Every insight is traceable, comparable, and auditable.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/login">
              <Button size="lg" className="font-mono text-sm bg-primary text-primary-foreground gap-2">
                Start Monitoring <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="font-mono text-sm">
                See How It Works
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Value bar */}
      <section className="border-y border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { stat: "Provable", label: "Every result linked to evidence" },
            { stat: "Comparable", label: "Semantic diffs across time" },
            { stat: "Auditable", label: "Immutable hash chain" },
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
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Capabilities</p>
        <h2 className="text-2xl font-bold mb-10">Built for intelligence teams.</h2>
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
          <h2 className="text-2xl font-bold mb-3">Ready to see the truth?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your account and deploy your first monitor in under 2 minutes.
          </p>
          <Link to="/login">
            <Button size="lg" className="font-mono text-sm bg-primary text-primary-foreground gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">TruthOS</span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} TruthOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

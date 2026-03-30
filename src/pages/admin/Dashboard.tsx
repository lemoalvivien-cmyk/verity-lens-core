import { Users, MapPin, FolderOpen, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLeads, useCities, useCategories } from "@/hooks/useLeads";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const AdminDashboard = () => {
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: cities = [] } = useCities();
  const { data: categories = [] } = useCategories();

  if (leadsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const newLeads = leads.filter(l => l.status === "new").length;
  const todayLeads = leads.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const stats = [
    { label: "Total leads", value: String(leads.length), sub: `${newLeads} nouveaux`, icon: Users },
    { label: "Aujourd'hui", value: String(todayLeads), sub: "leads captés", icon: TrendingUp },
    { label: "Villes", value: String(cities.length), sub: "zones couvertes", icon: MapPin },
    { label: "Catégories", value: String(categories.length), sub: "segments actifs", icon: FolderOpen },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de la collecte</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="font-mono text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-card border border-border rounded-lg">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-mono text-xs font-semibold">Derniers leads</h3>
          <Link to="/app/leads" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">
            Voir tout →
          </Link>
        </div>
        {leads.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucun lead pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {leads.slice(0, 8).map((lead) => (
              <div key={lead.id} className="px-4 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{lead.full_name || lead.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {lead.city_name && (
                      <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {lead.city_name}
                      </span>
                    )}
                    {lead.category_name && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        · {lead.category_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    lead.status === "new" ? "bg-signal-green/10 text-signal-green" :
                    lead.status === "contacted" ? "bg-signal-blue/10 text-signal-blue" :
                    lead.status === "qualified" ? "bg-signal-amber/10 text-signal-amber" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {lead.status}
                  </span>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

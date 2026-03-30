import { Users, TrendingUp, MapPin, FolderOpen, Calendar, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDashboardStats, useCities, useCategories } from "@/hooks/useLeads";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: cities = [] } = useCities();
  const { data: categories = [] } = useCategories();

  if (isLoading || !stats) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  const cards = [
    { label: "Total leads", value: stats.total, sub: `${stats.newLeads} non traités`, icon: Users, color: "text-signal-green" },
    { label: "Aujourd'hui", value: stats.today, sub: `${stats.week} cette semaine`, icon: Calendar, color: "text-signal-blue" },
    { label: "Ce mois", value: stats.month, sub: `${cities.length} villes actives`, icon: TrendingUp, color: "text-signal-amber" },
    { label: "Catégories", value: categories.length, sub: `${stats.total} leads au total`, icon: FolderOpen, color: "text-primary" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de la collecte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="font-mono text-2xl font-bold">{s.value}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-xs font-semibold">Évolution (14 jours)</h3>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "monospace" }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10, fontFamily: "monospace" }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top cities */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold">Top villes</h3>
            <Link to="/app/cities" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">Tout voir →</Link>
          </div>
          {stats.topCities.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">Aucune donnée</div>
          ) : (
            <div className="divide-y divide-border">
              {stats.topCities.map(([name, count], i) => (
                <div key={name} className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground w-4">{i + 1}.</span>
                    <MapPin className="w-3.5 h-3.5 text-signal-green" />
                    <span className="text-sm">{name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top categories */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold">Top catégories</h3>
            <Link to="/app/categories" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">Tout voir →</Link>
          </div>
          {stats.topCategories.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">Aucune donnée</div>
          ) : (
            <div className="divide-y divide-border">
              {stats.topCategories.map(([name, count], i) => (
                <div key={name} className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground w-4">{i + 1}.</span>
                    <FolderOpen className="w-3.5 h-3.5 text-signal-blue" />
                    <span className="text-sm">{name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-card border border-border rounded-lg">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-mono text-xs font-semibold">Derniers leads</h3>
          <Link to="/app/leads" className="font-mono text-[10px] text-muted-foreground hover:text-foreground">Tout voir →</Link>
        </div>
        {stats.recentLeads.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucun lead pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stats.recentLeads.map((lead: any) => (
              <Link key={lead.id} to={`/app/leads?detail=${lead.id}`} className="block">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{lead.full_name || lead.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {lead.city_name && <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {lead.city_name}</span>}
                      {lead.category_name && <span className="font-mono text-[10px] text-muted-foreground">· {lead.category_name}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      lead.status === "new" ? "bg-signal-green/10 text-signal-green" :
                      lead.status === "contacted" ? "bg-signal-blue/10 text-signal-blue" :
                      lead.status === "qualified" ? "bg-signal-amber/10 text-signal-amber" :
                      lead.status === "converted" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>{lead.status}</span>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

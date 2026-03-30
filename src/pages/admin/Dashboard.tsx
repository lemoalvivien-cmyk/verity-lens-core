import { useMemo } from "react";
import { Users, TrendingUp, MapPin, FolderOpen, Calendar, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAllLeads, useCities, useCategories } from "@/hooks/useLeads";
import { formatDistanceToNow, subDays, startOfDay, startOfWeek, startOfMonth, format } from "date-fns";
import { fr } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const AdminDashboard = () => {
  const { data: leads = [], isLoading } = useAllLeads();
  const { data: cities = [] } = useCities();
  const { data: categories = [] } = useCategories();

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  const todayLeads = leads.filter(l => new Date(l.created_at) >= todayStart).length;
  const weekLeads = leads.filter(l => new Date(l.created_at) >= weekStart).length;
  const monthLeads = leads.filter(l => new Date(l.created_at) >= monthStart).length;
  const newLeads = leads.filter(l => l.status === "new").length;

  // Top cities
  const cityVolume = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach(l => { if (l.city_name) map.set(l.city_name, (map.get(l.city_name) || 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [leads]);

  // Top categories
  const catVolume = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach(l => { if (l.category_name) map.set(l.category_name, (map.get(l.category_name) || 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [leads]);

  // Last 14 days evolution
  const dailyChart = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const day = subDays(now, i);
      const dayStr = format(day, "yyyy-MM-dd");
      const label = format(day, "dd/MM");
      const count = leads.filter(l => l.created_at.startsWith(dayStr)).length;
      days.push({ date: label, count });
    }
    return days;
  }, [leads]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  const stats = [
    { label: "Total leads", value: leads.length, sub: `${newLeads} non traités`, icon: Users, color: "text-signal-green" },
    { label: "Aujourd'hui", value: todayLeads, sub: `${weekLeads} cette semaine`, icon: Calendar, color: "text-signal-blue" },
    { label: "Ce mois", value: monthLeads, sub: `${cities.length} villes actives`, icon: TrendingUp, color: "text-signal-amber" },
    { label: "Catégories", value: categories.length, sub: `${leads.filter(l => l.category_id).length} leads catégorisés`, icon: FolderOpen, color: "text-primary" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de la collecte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
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
            <BarChart data={dailyChart}>
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
          {cityVolume.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">Aucune donnée</div>
          ) : (
            <div className="divide-y divide-border">
              {cityVolume.map(([name, count], i) => (
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
          {catVolume.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">Aucune donnée</div>
          ) : (
            <div className="divide-y divide-border">
              {catVolume.map(([name, count], i) => (
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
        {leads.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucun lead pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {leads.slice(0, 6).map(lead => (
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

import { Radio, Eye, GitCompare, Activity } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AlertFeed from "@/components/dashboard/AlertFeed";
import MonitorGrid from "@/components/dashboard/MonitorGrid";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-mono text-xl font-bold text-foreground tracking-tight">Command Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time intelligence overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="AI Queries" value={142} icon={Radio} trend="+12 today" signal="green" />
        <StatCard label="URLs Tracked" value={58} icon={Eye} trend="3 alerts" signal="amber" />
        <StatCard label="Comparisons" value={23} icon={GitCompare} trend="All stable" signal="green" />
        <StatCard label="Changes 24h" value={7} icon={Activity} trend="↑ 2 vs yesterday" signal="amber" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <MonitorGrid />
        </div>
        <div className="xl:col-span-2">
          <AlertFeed />
        </div>
      </div>
    </div>
  );
};

export default Index;

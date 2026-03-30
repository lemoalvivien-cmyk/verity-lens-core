import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  signal?: "green" | "amber" | "red";
}

const StatCard = ({ label, value, icon: Icon, trend, signal = "green" }: StatCardProps) => {
  const signalClass = {
    green: "text-signal-green glow-green border-signal-green/20",
    amber: "text-signal-amber glow-amber border-signal-amber/20",
    red: "text-signal-red glow-red border-signal-red/20",
  }[signal];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border rounded-lg p-5 ${signalClass}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="font-mono text-2xl font-bold text-foreground">{value}</div>
      {trend && (
        <span className={`font-mono text-xs mt-1 inline-block ${
          signal === "green" ? "text-signal-green" : signal === "amber" ? "text-signal-amber" : "text-signal-red"
        }`}>
          {trend}
        </span>
      )}
    </motion.div>
  );
};

export default StatCard;

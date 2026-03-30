import { motion } from "framer-motion";

interface StatusBadgeProps {
  status: "active" | "paused" | "error" | "stable" | "changed" | "new";
  size?: "sm" | "md";
}

const config = {
  active: { label: "Active", dot: "bg-signal-green", text: "text-signal-green" },
  paused: { label: "Paused", dot: "bg-muted-foreground", text: "text-muted-foreground" },
  error: { label: "Error", dot: "bg-signal-red", text: "text-signal-red" },
  stable: { label: "Stable", dot: "bg-signal-green", text: "text-signal-green" },
  changed: { label: "Changed", dot: "bg-signal-amber animate-pulse-slow", text: "text-signal-amber" },
  new: { label: "New", dot: "bg-signal-blue", text: "text-signal-blue" },
};

const StatusBadge = ({ status, size = "sm" }: StatusBadgeProps) => {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === "sm" ? "text-[11px]" : "text-xs"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <span className={`font-mono ${c.text}`}>{c.label}</span>
    </span>
  );
};

export default StatusBadge;

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-muted-foreground" />
    </div>
    <h3 className="font-mono text-sm font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
    {action}
  </motion.div>
);

export default EmptyState;

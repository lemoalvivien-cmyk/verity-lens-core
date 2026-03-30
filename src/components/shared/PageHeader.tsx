import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, icon, actions }: PageHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start justify-between mb-6"
  >
    <div>
      <h1 className="font-mono text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
        {icon}
        {title}
      </h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </motion.div>
);

export default PageHeader;

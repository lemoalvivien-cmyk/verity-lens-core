import { Settings as SettingsIcon, User, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/shared/PageHeader";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <PageHeader
        title="Settings"
        subtitle="Workspace and account configuration"
        icon={<SettingsIcon className="w-4 h-4 text-muted-foreground" />}
      />

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">Profile</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Email</Label>
            <Input value={user?.email || ""} disabled className="bg-background border-border font-mono text-sm opacity-60" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Display Name</Label>
            <Input placeholder="Your display name" className="bg-background border-border font-mono text-sm" />
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground font-mono text-xs">
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Workspace */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">Workspace</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Workspace Name</Label>
            <Input placeholder="My Workspace" className="bg-background border-border font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Members</Label>
            <p className="font-mono text-xs text-muted-foreground">Member management coming soon.</p>
          </div>
        </div>
      </motion.div>

      {/* Monitor Defaults */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">Monitor Defaults</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Default Check Frequency</Label>
            <div className="flex gap-2">
              {["1h", "6h", "24h"].map((freq) => (
                <button
                  key={freq}
                  className="font-mono text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  Every {freq}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;

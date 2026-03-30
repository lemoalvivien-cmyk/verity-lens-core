import { useState } from "react";
import { Settings as SettingsIcon, User, Shield, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/shared/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useProfile } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const SettingsPage = () => {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const { data: profile, isLoading } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize from data
  const effectiveName = displayName || profile?.display_name || "";
  const effectiveWsName = workspaceName || workspace?.name || "";

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName || effectiveName }).eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Profile updated" });
    }
  };

  const saveWorkspace = async () => {
    if (!workspace) return;
    setSaving(true);
    const { error } = await supabase.from("workspaces").update({ name: workspaceName || effectiveWsName }).eq("id", workspace.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Workspace updated" });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <PageHeader title="Settings" subtitle="Workspace and account configuration" icon={<SettingsIcon className="w-4 h-4 text-muted-foreground" />} />

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-5">
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
            <Input value={displayName || effectiveName} onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name" className="bg-background border-border font-mono text-sm" />
          </div>
          <Button size="sm" onClick={saveProfile} disabled={saving} className="bg-primary text-primary-foreground font-mono text-xs">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null} Save Profile
          </Button>
        </div>
      </motion.div>

      {/* Workspace */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">Workspace</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">Workspace Name</Label>
            <Input value={workspaceName || effectiveWsName} onChange={(e) => setWorkspaceName(e.target.value)}
              className="bg-background border-border font-mono text-sm" />
          </div>
          <Button size="sm" onClick={saveWorkspace} disabled={saving} className="bg-primary text-primary-foreground font-mono text-xs">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null} Save Workspace
          </Button>
        </div>
      </motion.div>

      {/* Monitor Defaults */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">Monitor Defaults</h3>
        </div>
        <p className="font-mono text-xs text-muted-foreground">Default frequency and engine preferences are set per-monitor at creation time.</p>
      </motion.div>
    </div>
  );
};

export default SettingsPage;

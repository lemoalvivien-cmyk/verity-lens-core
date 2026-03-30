import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import type { EvidenceSnapshot, SnapshotDiff } from "@/types/models";

export function useEvidence(monitorId?: string) {
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: ["evidence", workspace?.id, monitorId],
    queryFn: async () => {
      if (!workspace) return [];
      let q = supabase
        .from("evidence_snapshots")
        .select("*, monitors!inner(workspace_id)")
        .eq("monitors.workspace_id", workspace.id)
        .order("captured_at", { ascending: false })
        .limit(100);

      if (monitorId) {
        q = q.eq("monitor_id", monitorId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as (EvidenceSnapshot & { monitors: { workspace_id: string } })[];
    },
    enabled: !!workspace,
  });
}

export function useEvidenceById(id: string | undefined) {
  return useQuery({
    queryKey: ["evidence-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("evidence_snapshots")
        .select("*, monitors(name, type, config)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useDiffs(monitorId?: string) {
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: ["diffs", workspace?.id, monitorId],
    queryFn: async () => {
      if (!workspace) return [];
      let q = supabase
        .from("snapshot_diffs")
        .select("*, monitors!inner(workspace_id, name)")
        .eq("monitors.workspace_id", workspace.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (monitorId) {
        q = q.eq("monitor_id", monitorId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as (SnapshotDiff & { monitors: { workspace_id: string; name: string } })[];
    },
    enabled: !!workspace,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Monitor, MonitorType, MonitorConfig } from "@/types/models";

export function useMonitors(typeFilter?: MonitorType) {
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: ["monitors", workspace?.id, typeFilter],
    queryFn: async () => {
      if (!workspace) return [];
      let q = supabase
        .from("monitors")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false });

      if (typeFilter) {
        q = q.eq("type", typeFilter);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as Monitor[];
    },
    enabled: !!workspace,
  });
}

export function useMonitor(id: string | undefined) {
  return useQuery({
    queryKey: ["monitor", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("monitors")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Monitor;
    },
    enabled: !!id,
  });
}

interface CreateMonitorInput {
  name: string;
  type: MonitorType;
  config: MonitorConfig;
  interval_minutes: number;
}

export function useCreateMonitor() {
  const queryClient = useQueryClient();
  const { workspace } = useWorkspace();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateMonitorInput) => {
      if (!workspace || !user) throw new Error("No workspace or user");
      const { data, error } = await supabase
        .from("monitors")
        .insert({
          name: input.name,
          type: input.type,
          config: input.config as any,
          interval_minutes: input.interval_minutes,
          workspace_id: workspace.id,
          created_by: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });
}

export function useUpdateMonitorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Monitor["status"] }) => {
      const { error } = await supabase
        .from("monitors")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });
}

export function useDeleteMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("monitors")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });
}

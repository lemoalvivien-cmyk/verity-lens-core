import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeadFilters {
  city_id?: string;
  category_id?: string;
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  tag_id?: string;
}

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: async () => {
      let q = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(1000);
      if (filters?.city_id) q = q.eq("city_id", filters.city_id);
      if (filters?.category_id) q = q.eq("category_id", filters.category_id);
      if (filters?.status) q = q.eq("status", filters.status as any);
      if (filters?.search) {
        const sanitized = filters.search.replace(/[%_\(),."']/g, '');
        if (sanitized.trim()) {
          q = q.or(`email.ilike.%${sanitized}%,full_name.ilike.%${sanitized}%,phone.ilike.%${sanitized}%,city_name.ilike.%${sanitized}%`);
        }
      }
      if (filters?.date_from) q = q.gte("created_at", filters.date_from);
      if (filters?.date_to) q = q.lte("created_at", filters.date_to + "T23:59:59");
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useAllLeads() {
  return useQuery({
    queryKey: ["leads-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("id,email,full_name,city_id,city_name,category_id,category_name,status,created_at,postal_code,phone,message,source_page,consent,notes_admin").order("created_at", { ascending: false }).limit(1000);
      if (error) throw error;
      return data;
    },
  });
}

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useLeadTags(leadId?: string) {
  return useQuery({
    queryKey: ["lead-tags", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const { data, error } = await supabase.from("lead_tags").select("*, tags(*)").eq("lead_id", leadId);
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });
}

export function useExportsLog() {
  return useQuery({
    queryKey: ["exports-log"],
    queryFn: async () => {
      const { data, error } = await supabase.from("exports_log").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
}

export function useLeadEvents(leadId?: string) {
  return useQuery({
    queryKey: ["lead-events", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const { data, error } = await supabase.from("lead_events").select("*").eq("lead_id", leadId).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("leads").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["leads-all"] });
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["leads-all"] });
    },
  });
}

export function useDeleteLeads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("leads").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["leads-all"] });
    },
  });
}

export function useAddLeadTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lead_id, tag_id }: { lead_id: string; tag_id: string }) => {
      const { error } = await supabase.from("lead_tags").insert({ lead_id, tag_id });
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["lead-tags", vars.lead_id] }),
  });
}

export function useRemoveLeadTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lead_id, tag_id }: { lead_id: string; tag_id: string }) => {
      const { error } = await supabase.from("lead_tags").delete().eq("lead_id", lead_id).eq("tag_id", tag_id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["lead-tags", vars.lead_id] }),
  });
}

export function useLogExport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { export_type: string; filters: Record<string, any>; row_count: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("exports_log").insert({
        user_id: user?.id || "",
        ...data,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exports-log"] }),
  });
}

export function useLogLeadEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { lead_id: string; event_type: string; metadata?: Record<string, any> }) => {
      const { error } = await supabase.from("lead_events").insert(data);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["lead-events", vars.lead_id] }),
  });
}

// Utility: find duplicate emails
export function findDuplicateEmails(leads: Array<{ id: string; email: string; full_name: string | null; created_at: string; city_name: string | null }>) {
  const emailMap = new Map<string, typeof leads>();
  leads.forEach(l => {
    const key = l.email.toLowerCase().trim();
    if (!emailMap.has(key)) emailMap.set(key, []);
    emailMap.get(key)!.push(l);
  });
  return Array.from(emailMap.entries())
    .filter(([, group]) => group.length > 1)
    .map(([email, group]) => ({ email, leads: group.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) }));
}

// Utility: generate CSV content
export function generateCSV(leads: any[]) {
  const headers = ["Email", "Nom", "Téléphone", "Ville", "Code postal", "Catégorie", "Statut", "Message", "Source", "Consentement", "Date"];
  const rows = leads.map(l => [
    l.email, l.full_name || "", l.phone || "", l.city_name || "", l.postal_code || "",
    l.category_name || "", l.status, (l.message || "").replace(/\n/g, " "), l.source_page || "",
    l.consent ? "Oui" : "Non", new Date(l.created_at).toLocaleString("fr-FR"),
  ]);
  return [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

// Utility: download blob
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

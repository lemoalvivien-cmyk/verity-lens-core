import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { startOfWeek, startOfMonth, subDays, format } from "date-fns";

export interface LeadFilters {
  city_id?: string;
  category_id?: string;
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  tag_id?: string;
  page?: number;
}

const PAGE_SIZE = 50;

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: async () => {
      const page = filters?.page ?? 0;
      let q = supabase.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false });
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
      const { data, error, count } = await q.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (error) throw error;
      return { leads: data ?? [], total: count ?? 0 };
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const now = new Date();
      const todayISO = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekISO = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
      const monthISO = startOfMonth(now).toISOString();

      const [total, today, week, month, newCount, recentRes, topCitiesRes, topCatsRes, dailyRes] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", weekISO),
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", monthISO),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("leads").select("id,email,full_name,city_name,category_name,status,created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("leads").select("city_name").not("city_name", "is", null).order("created_at", { ascending: false }).limit(500),
        supabase.from("leads").select("category_name").not("category_name", "is", null).order("created_at", { ascending: false }).limit(500),
        supabase.from("leads").select("created_at").gte("created_at", subDays(now, 14).toISOString()).order("created_at", { ascending: false }),
      ]);

      // Top 5 cities
      const cityMap = new Map<string, number>();
      (topCitiesRes.data ?? []).forEach((l: any) => { cityMap.set(l.city_name, (cityMap.get(l.city_name) || 0) + 1); });
      const topCities = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

      // Top 5 categories
      const catMap = new Map<string, number>();
      (topCatsRes.data ?? []).forEach((l: any) => { catMap.set(l.category_name, (catMap.get(l.category_name) || 0) + 1); });
      const topCategories = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

      // Daily chart (14 days)
      const dailyMap = new Map<string, number>();
      (dailyRes.data ?? []).forEach((l: any) => {
        const day = l.created_at.substring(0, 10);
        dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
      });
      const dailyChart: { date: string; count: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = subDays(now, i);
        const key = format(d, "yyyy-MM-dd");
        dailyChart.push({ date: format(d, "dd/MM"), count: dailyMap.get(key) || 0 });
      }

      return {
        total: total.count ?? 0,
        today: today.count ?? 0,
        week: week.count ?? 0,
        month: month.count ?? 0,
        newLeads: newCount.count ?? 0,
        recentLeads: recentRes.data ?? [],
        topCities,
        topCategories,
        dailyChart,
      };
    },
  });
}

export function useLeadCountsByField(field: "city_id" | "category_id") {
  return useQuery({
    queryKey: ["lead-counts", field],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select(field).not(field, "is", null);
      if (error) throw error;
      const map = new Map<string, number>();
      (data ?? []).forEach((row: any) => { const v = row[field]; if (v) map.set(v, (map.get(v) || 0) + 1); });
      return map;
    },
  });
}

export function useLeadCountsByFieldRecent(field: "city_id" | "category_id") {
  return useQuery({
    queryKey: ["lead-counts-recent", field],
    queryFn: async () => {
      const since = subDays(new Date(), 7).toISOString();
      const { data, error } = await supabase.from("leads").select(field).not(field, "is", null).gte("created_at", since);
      if (error) throw error;
      const map = new Map<string, number>();
      (data ?? []).forEach((row: any) => { const v = row[field]; if (v) map.set(v, (map.get(v) || 0) + 1); });
      return map;
    },
  });
}

// For Quality page - fetch only id, email, full_name, created_at, city_name for duplicate detection
export function useLeadsForQuality() {
  return useQuery({
    queryKey: ["leads-quality"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("id,email,full_name,created_at,city_name").order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
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


-- 1. Drop unused tables (respecting dependencies)
DROP TABLE IF EXISTS public.search_entries CASCADE;
DROP TABLE IF EXISTS public.snapshot_diffs CASCADE;
DROP TABLE IF EXISTS public.evidence_snapshots CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.monitors CASCADE;

-- Drop unused types
DROP TYPE IF EXISTS public.monitor_type;
DROP TYPE IF EXISTS public.monitor_status;
DROP TYPE IF EXISTS public.alert_severity;
DROP TYPE IF EXISTS public.diff_type;

-- 2. Add workspace_id to leads
ALTER TABLE public.leads ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;
CREATE INDEX idx_leads_workspace ON public.leads(workspace_id);

-- 3. Replace RLS policies on leads with workspace-scoped ones
DROP POLICY IF EXISTS "Anyone can submit lead" ON public.leads;
DROP POLICY IF EXISTS "Admins can read leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;

CREATE POLICY "Anyone can submit lead" ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Workspace members can read leads" ON public.leads
  FOR SELECT TO authenticated USING (
    workspace_id IS NOT NULL AND public.is_workspace_member(auth.uid(), workspace_id)
  );

CREATE POLICY "Workspace admins can update leads" ON public.leads
  FOR UPDATE TO authenticated USING (
    workspace_id IS NOT NULL AND public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin')
  );

CREATE POLICY "Workspace admins can delete leads" ON public.leads
  FOR DELETE TO authenticated USING (
    workspace_id IS NOT NULL AND public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin')
  );

ALTER TABLE public.exports_log ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id);

DROP POLICY IF EXISTS "Admins can manage exports_log" ON public.exports_log;

CREATE POLICY "Workspace admins exports" ON public.exports_log FOR ALL TO authenticated
USING (workspace_id IS NOT NULL AND public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin'))
WITH CHECK (workspace_id IS NOT NULL AND public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin'));
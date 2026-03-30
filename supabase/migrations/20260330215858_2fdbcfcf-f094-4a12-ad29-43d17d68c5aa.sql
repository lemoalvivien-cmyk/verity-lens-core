-- Table consent_log immuable
CREATE TABLE public.consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  consent_text_hash TEXT NOT NULL,
  consent_text_version TEXT NOT NULL DEFAULT 'v1',
  ip_hash TEXT,
  user_agent_hash TEXT,
  source_page TEXT NOT NULL DEFAULT '/',
  source_campaign TEXT,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert consent" ON public.consent_log FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Read consent" ON public.consent_log FOR SELECT TO authenticated USING (
  workspace_id IS NOT NULL AND public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin')
);
CREATE INDEX idx_consent_log_lead ON public.consent_log(lead_id);
CREATE INDEX idx_consent_log_workspace ON public.consent_log(workspace_id);

-- Fonction resolve workspace pour soumission publique
CREATE OR REPLACE FUNCTION public.resolve_workspace_for_submission(p_slug TEXT DEFAULT NULL)
RETURNS UUID LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE ws_id UUID;
BEGIN
  IF p_slug IS NOT NULL AND p_slug <> '' THEN
    SELECT id INTO ws_id FROM public.workspaces WHERE LOWER(name) = LOWER(p_slug) LIMIT 1;
    IF ws_id IS NOT NULL THEN RETURN ws_id; END IF;
  END IF;
  SELECT id INTO ws_id FROM public.workspaces ORDER BY created_at ASC LIMIT 1;
  RETURN ws_id;
END;
$$;

-- Corriger les leads orphelins
UPDATE public.leads SET workspace_id = (SELECT id FROM public.workspaces ORDER BY created_at ASC LIMIT 1) WHERE workspace_id IS NULL;

-- Tighten RLS on lead_tags
DROP POLICY IF EXISTS "Admins can manage lead_tags" ON public.lead_tags;
CREATE POLICY "Workspace admins can manage lead_tags" ON public.lead_tags FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.leads l JOIN public.workspace_members wm ON wm.workspace_id = l.workspace_id WHERE l.id = lead_tags.lead_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')))
WITH CHECK (EXISTS (SELECT 1 FROM public.leads l JOIN public.workspace_members wm ON wm.workspace_id = l.workspace_id WHERE l.id = lead_tags.lead_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')));

-- Tighten RLS on lead_events
DROP POLICY IF EXISTS "Admins can manage lead_events" ON public.lead_events;
CREATE POLICY "Workspace admins can manage lead_events" ON public.lead_events FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.leads l JOIN public.workspace_members wm ON wm.workspace_id = l.workspace_id WHERE l.id = lead_events.lead_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')))
WITH CHECK (EXISTS (SELECT 1 FROM public.leads l JOIN public.workspace_members wm ON wm.workspace_id = l.workspace_id WHERE l.id = lead_events.lead_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')));
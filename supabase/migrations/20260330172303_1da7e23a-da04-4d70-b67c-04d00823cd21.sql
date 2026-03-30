
-- Lead statuses
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'archived');

-- Cities table
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  postal_code TEXT,
  region TEXT,
  country TEXT NOT NULL DEFAULT 'FR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read cities" ON public.cities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage cities" ON public.cities FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  city_id UUID REFERENCES public.cities(id),
  city_name TEXT,
  postal_code TEXT,
  category_id UUID REFERENCES public.categories(id),
  category_name TEXT,
  message TEXT,
  source_page TEXT NOT NULL DEFAULT '/',
  source_campaign TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  consent_text_version TEXT NOT NULL DEFAULT 'v1',
  status lead_status NOT NULL DEFAULT 'new',
  notes_admin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- Anyone can insert a lead (public form)
CREATE POLICY "Anyone can submit lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Only authenticated admins can read/update/delete
CREATE POLICY "Admins can read leads" ON public.leads FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

-- Lead tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

CREATE TABLE public.lead_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lead_id, tag_id)
);
ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage lead_tags" ON public.lead_tags FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

-- Lead events (activity log)
CREATE TABLE public.lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage lead_events" ON public.lead_events FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

-- Exports log
CREATE TABLE public.exports_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  export_type TEXT NOT NULL DEFAULT 'csv',
  filters JSONB DEFAULT '{}',
  row_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exports_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage exports_log" ON public.exports_log FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin'))
);

-- Updated_at trigger for leads
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

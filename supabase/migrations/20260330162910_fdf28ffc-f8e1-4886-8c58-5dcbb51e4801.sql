
-- Enums
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE public.monitor_type AS ENUM ('ai_query', 'web_watch');
CREATE TYPE public.monitor_status AS ENUM ('active', 'paused', 'error');
CREATE TYPE public.alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE public.diff_type AS ENUM ('added', 'removed', 'changed', 'semantic');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Workspaces
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Workspace members
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role workspace_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Security definer function to check workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id UUID, _workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE user_id = _user_id AND workspace_id = _workspace_id
  )
$$;

CREATE OR REPLACE FUNCTION public.get_workspace_role(_user_id UUID, _workspace_id UUID)
RETURNS workspace_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.workspace_members
  WHERE user_id = _user_id AND workspace_id = _workspace_id
  LIMIT 1
$$;

-- Workspace RLS policies
CREATE POLICY "Members can view workspace" ON public.workspaces
FOR SELECT USING (public.is_workspace_member(auth.uid(), id));

CREATE POLICY "Authenticated users can create workspaces" ON public.workspaces
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners/admins can update workspace" ON public.workspaces
FOR UPDATE USING (public.get_workspace_role(auth.uid(), id) IN ('owner', 'admin'));

-- Workspace members RLS
CREATE POLICY "Members can view workspace members" ON public.workspace_members
FOR SELECT USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Owners/admins can manage members" ON public.workspace_members
FOR INSERT WITH CHECK (
  public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin')
  OR auth.uid() = user_id
);

CREATE POLICY "Owners/admins can update members" ON public.workspace_members
FOR UPDATE USING (public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin'));

CREATE POLICY "Owners/admins can remove members" ON public.workspace_members
FOR DELETE USING (public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin'));

-- Auto-create workspace + owner membership on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_workspace()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  INSERT INTO public.workspaces (name, created_by)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Workspace',
    NEW.id
  )
  RETURNING id INTO new_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_workspace
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_workspace();

-- Monitors
CREATE TABLE public.monitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type monitor_type NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  status monitor_status NOT NULL DEFAULT 'active',
  interval_minutes INT NOT NULL DEFAULT 60,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_monitors_updated_at BEFORE UPDATE ON public.monitors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Members can view monitors" ON public.monitors
FOR SELECT USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Members can create monitors" ON public.monitors
FOR INSERT WITH CHECK (
  public.is_workspace_member(auth.uid(), workspace_id)
  AND public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin', 'member')
);

CREATE POLICY "Members can update monitors" ON public.monitors
FOR UPDATE USING (
  public.is_workspace_member(auth.uid(), workspace_id)
  AND public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin', 'member')
);

CREATE POLICY "Owners/admins can delete monitors" ON public.monitors
FOR DELETE USING (public.get_workspace_role(auth.uid(), workspace_id) IN ('owner', 'admin'));

-- Evidence Snapshots (immutable ledger)
CREATE TABLE public.evidence_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id UUID REFERENCES public.monitors(id) ON DELETE CASCADE NOT NULL,
  run_id UUID NOT NULL DEFAULT gen_random_uuid(),
  raw_content TEXT,
  structured_data JSONB,
  source_url TEXT,
  source_engine TEXT,
  content_hash TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);
ALTER TABLE public.evidence_snapshots ENABLE ROW LEVEL SECURITY;

-- Evidence is read-only for members (INSERT via edge functions with service role)
CREATE POLICY "Members can view evidence" ON public.evidence_snapshots
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.monitors m
    WHERE m.id = monitor_id
    AND public.is_workspace_member(auth.uid(), m.workspace_id)
  )
);

-- No UPDATE or DELETE policies = immutable ledger

CREATE INDEX idx_evidence_monitor ON public.evidence_snapshots(monitor_id);
CREATE INDEX idx_evidence_captured ON public.evidence_snapshots(captured_at DESC);
CREATE INDEX idx_evidence_hash ON public.evidence_snapshots(content_hash);

-- Snapshot Diffs
CREATE TABLE public.snapshot_diffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id UUID REFERENCES public.monitors(id) ON DELETE CASCADE NOT NULL,
  snapshot_a_id UUID REFERENCES public.evidence_snapshots(id) ON DELETE CASCADE NOT NULL,
  snapshot_b_id UUID REFERENCES public.evidence_snapshots(id) ON DELETE CASCADE NOT NULL,
  diff_type diff_type NOT NULL,
  diff_data JSONB NOT NULL DEFAULT '{}',
  significance REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.snapshot_diffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view diffs" ON public.snapshot_diffs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.monitors m
    WHERE m.id = monitor_id
    AND public.is_workspace_member(auth.uid(), m.workspace_id)
  )
);

CREATE INDEX idx_diffs_monitor ON public.snapshot_diffs(monitor_id);

-- Alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  monitor_id UUID REFERENCES public.monitors(id) ON DELETE CASCADE,
  diff_id UUID REFERENCES public.snapshot_diffs(id) ON DELETE SET NULL,
  severity alert_severity NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view alerts" ON public.alerts
FOR SELECT USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Members can update alerts" ON public.alerts
FOR UPDATE USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE INDEX idx_alerts_workspace ON public.alerts(workspace_id, created_at DESC);

-- Audit Log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view audit log" ON public.audit_log
FOR SELECT USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE INDEX idx_audit_workspace ON public.audit_log(workspace_id, created_at DESC);

-- Full-text search entries
CREATE TABLE public.search_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  monitor_id UUID REFERENCES public.monitors(id) ON DELETE CASCADE,
  snapshot_id UUID REFERENCES public.evidence_snapshots(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT,
  engine TEXT,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tsv TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', content)) STORED
);
ALTER TABLE public.search_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can search" ON public.search_entries
FOR SELECT USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE INDEX idx_search_tsv ON public.search_entries USING GIN(tsv);
CREATE INDEX idx_search_workspace ON public.search_entries(workspace_id);

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

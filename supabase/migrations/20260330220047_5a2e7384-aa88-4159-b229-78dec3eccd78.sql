CREATE OR REPLACE FUNCTION public.get_dashboard_aggregates(p_workspace_id UUID)
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result JSON;
BEGIN
  IF NOT public.is_workspace_member(auth.uid(), p_workspace_id) THEN
    RETURN json_build_object('error', 'UNAUTHORIZED');
  END IF;
  WITH
  counts AS (
    SELECT COUNT(*) AS total,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('day', now())) AS today,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('week', now())) AS week,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', now())) AS month,
      COUNT(*) FILTER (WHERE status = 'new') AS new_leads
    FROM public.leads WHERE workspace_id = p_workspace_id
  ),
  top_cities AS (
    SELECT json_agg(row_to_json(tc)) AS data FROM (
      SELECT city_name AS name, COUNT(*) AS count FROM public.leads
      WHERE workspace_id = p_workspace_id AND city_name IS NOT NULL
      GROUP BY city_name ORDER BY count DESC LIMIT 5
    ) tc
  ),
  top_categories AS (
    SELECT json_agg(row_to_json(tc)) AS data FROM (
      SELECT category_name AS name, COUNT(*) AS count FROM public.leads
      WHERE workspace_id = p_workspace_id AND category_name IS NOT NULL
      GROUP BY category_name ORDER BY count DESC LIMIT 5
    ) tc
  ),
  daily_chart AS (
    SELECT json_agg(row_to_json(dc) ORDER BY dc.date) AS data FROM (
      SELECT to_char(d.day, 'DD/MM') AS date, COALESCE(cnt.c, 0) AS count
      FROM generate_series((now() - interval '13 days')::date, now()::date, '1 day'::interval) AS d(day)
      LEFT JOIN (
        SELECT created_at::date AS day, COUNT(*) AS c FROM public.leads
        WHERE workspace_id = p_workspace_id AND created_at >= now() - interval '14 days'
        GROUP BY created_at::date
      ) cnt ON cnt.day = d.day
    ) dc
  ),
  recent AS (
    SELECT json_agg(row_to_json(r)) AS data FROM (
      SELECT id, email, full_name, city_name, category_name, status, created_at
      FROM public.leads WHERE workspace_id = p_workspace_id
      ORDER BY created_at DESC LIMIT 6
    ) r
  )
  SELECT json_build_object(
    'total', c.total, 'today', c.today, 'week', c.week, 'month', c.month,
    'newLeads', c.new_leads, 'topCities', COALESCE(tc.data, '[]'::json),
    'topCategories', COALESCE(tcat.data, '[]'::json),
    'dailyChart', COALESCE(dc.data, '[]'::json),
    'recentLeads', COALESCE(rl.data, '[]'::json)
  ) INTO result FROM counts c, top_cities tc, top_categories tcat, daily_chart dc, recent rl;
  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_dashboard_aggregates TO authenticated;

CREATE INDEX IF NOT EXISTS idx_leads_ws_created ON public.leads(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_ws_status ON public.leads(workspace_id, status);
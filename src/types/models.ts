import { Tables, Enums } from "@/integrations/supabase/types";

// Re-export DB row types
export type Profile = Tables<"profiles">;
export type Workspace = Tables<"workspaces">;
export type WorkspaceMember = Tables<"workspace_members">;
export type Monitor = Tables<"monitors">;
export type EvidenceSnapshot = Tables<"evidence_snapshots">;
export type SnapshotDiff = Tables<"snapshot_diffs">;
export type Alert = Tables<"alerts">;
export type AuditLogEntry = Tables<"audit_log">;
export type SearchEntry = Tables<"search_entries">;

// Enum types
export type MonitorType = Enums<"monitor_type">;
export type MonitorStatus = Enums<"monitor_status">;
export type AlertSeverity = Enums<"alert_severity">;
export type DiffType = Enums<"diff_type">;
export type WorkspaceRole = Enums<"workspace_role">;

// Config shapes stored in monitors.config JSONB
export interface AiQueryConfig {
  query: string;
  engines: string[];
}

export interface WebWatchConfig {
  urls: string[];
}

export type MonitorConfig = AiQueryConfig | WebWatchConfig;

// Helper to extract typed config
export function isAiQueryConfig(config: unknown): config is AiQueryConfig {
  return typeof config === "object" && config !== null && "query" in config;
}

export function isWebWatchConfig(config: unknown): config is WebWatchConfig {
  return typeof config === "object" && config !== null && "urls" in config;
}

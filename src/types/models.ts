import { Tables, Enums } from "@/integrations/supabase/types";

// Re-export DB row types
export type Profile = Tables<"profiles">;
export type Workspace = Tables<"workspaces">;
export type WorkspaceMember = Tables<"workspace_members">;
export type WorkspaceRole = Enums<"workspace_role">;

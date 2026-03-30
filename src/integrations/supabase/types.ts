export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          diff_id: string | null
          id: string
          message: string | null
          monitor_id: string | null
          read: boolean
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          diff_id?: string | null
          id?: string
          message?: string | null
          monitor_id?: string | null
          read?: boolean
          severity?: Database["public"]["Enums"]["alert_severity"]
          title: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          diff_id?: string | null
          id?: string
          message?: string | null
          monitor_id?: string | null
          read?: boolean
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_diff_id_fkey"
            columns: ["diff_id"]
            isOneToOne: false
            referencedRelation: "snapshot_diffs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_snapshots: {
        Row: {
          captured_at: string
          content_hash: string
          id: string
          metadata: Json | null
          monitor_id: string
          raw_content: string | null
          run_id: string
          source_engine: string | null
          source_url: string | null
          structured_data: Json | null
        }
        Insert: {
          captured_at?: string
          content_hash: string
          id?: string
          metadata?: Json | null
          monitor_id: string
          raw_content?: string | null
          run_id?: string
          source_engine?: string | null
          source_url?: string | null
          structured_data?: Json | null
        }
        Update: {
          captured_at?: string
          content_hash?: string
          id?: string
          metadata?: Json | null
          monitor_id?: string
          raw_content?: string | null
          run_id?: string
          source_engine?: string | null
          source_url?: string | null
          structured_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_snapshots_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
        ]
      }
      monitors: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          id: string
          interval_minutes: number
          last_run_at: string | null
          name: string
          next_run_at: string | null
          status: Database["public"]["Enums"]["monitor_status"]
          type: Database["public"]["Enums"]["monitor_type"]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          interval_minutes?: number
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          status?: Database["public"]["Enums"]["monitor_status"]
          type: Database["public"]["Enums"]["monitor_type"]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          interval_minutes?: number
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          status?: Database["public"]["Enums"]["monitor_status"]
          type?: Database["public"]["Enums"]["monitor_type"]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitors_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_entries: {
        Row: {
          captured_at: string
          content: string
          engine: string | null
          id: string
          monitor_id: string | null
          snapshot_id: string | null
          source: string | null
          tsv: unknown
          workspace_id: string
        }
        Insert: {
          captured_at?: string
          content: string
          engine?: string | null
          id?: string
          monitor_id?: string | null
          snapshot_id?: string | null
          source?: string | null
          tsv?: unknown
          workspace_id: string
        }
        Update: {
          captured_at?: string
          content?: string
          engine?: string | null
          id?: string
          monitor_id?: string | null
          snapshot_id?: string | null
          source?: string | null
          tsv?: unknown
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_entries_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_entries_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "evidence_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_entries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      snapshot_diffs: {
        Row: {
          created_at: string
          diff_data: Json
          diff_type: Database["public"]["Enums"]["diff_type"]
          id: string
          monitor_id: string
          significance: number
          snapshot_a_id: string
          snapshot_b_id: string
        }
        Insert: {
          created_at?: string
          diff_data?: Json
          diff_type: Database["public"]["Enums"]["diff_type"]
          id?: string
          monitor_id: string
          significance?: number
          snapshot_a_id: string
          snapshot_b_id: string
        }
        Update: {
          created_at?: string
          diff_data?: Json
          diff_type?: Database["public"]["Enums"]["diff_type"]
          id?: string
          monitor_id?: string
          significance?: number
          snapshot_a_id?: string
          snapshot_b_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "snapshot_diffs_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snapshot_diffs_snapshot_a_id_fkey"
            columns: ["snapshot_a_id"]
            isOneToOne: false
            referencedRelation: "evidence_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snapshot_diffs_snapshot_b_id_fkey"
            columns: ["snapshot_b_id"]
            isOneToOne: false
            referencedRelation: "evidence_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["workspace_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["workspace_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_workspace_role: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: Database["public"]["Enums"]["workspace_role"]
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "info" | "warning" | "critical"
      diff_type: "added" | "removed" | "changed" | "semantic"
      monitor_status: "active" | "paused" | "error"
      monitor_type: "ai_query" | "web_watch"
      workspace_role: "owner" | "admin" | "member" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["info", "warning", "critical"],
      diff_type: ["added", "removed", "changed", "semantic"],
      monitor_status: ["active", "paused", "error"],
      monitor_type: ["ai_query", "web_watch"],
      workspace_role: ["owner", "admin", "member", "viewer"],
    },
  },
} as const

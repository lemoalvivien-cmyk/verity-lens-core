import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Workspace } from "@/types/models";

interface WorkspaceContextType {
  workspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  switchWorkspace: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: null,
  workspaces: [],
  loading: true,
  switchWorkspace: () => {},
});

export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorkspaces([]);
      setWorkspace(null);
      setLoading(false);
      return;
    }

    const fetchWorkspaces = async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to fetch workspaces:", error.message);
        setLoading(false);
        return;
      }

      setWorkspaces(data || []);
      if (data && data.length > 0) {
        const savedId = localStorage.getItem("truthos_workspace_id");
        const saved = data.find((w) => w.id === savedId);
        setWorkspace(saved || data[0]);
      }
      setLoading(false);
    };

    fetchWorkspaces();
  }, [user]);

  const switchWorkspace = (id: string) => {
    const found = workspaces.find((w) => w.id === id);
    if (found) {
      setWorkspace(found);
      localStorage.setItem("truthos_workspace_id", id);
    }
  };

  return (
    <WorkspaceContext.Provider value={{ workspace, workspaces, loading, switchWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

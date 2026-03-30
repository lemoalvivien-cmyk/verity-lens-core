import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "owner" | "admin" | "member" | "viewer";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, loading: authLoading } = useAuth();
  const { workspace, loading: wsLoading } = useWorkspace();

  if (authLoading || wsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!workspace) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;

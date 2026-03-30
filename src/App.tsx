import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import AiMonitors from "./pages/AiMonitors";
import WebMonitors from "./pages/WebMonitors";
import CreateMonitor from "./pages/CreateMonitor";
import ResultsFeed from "./pages/ResultsFeed";
import EvidenceViewer from "./pages/EvidenceViewer";
import DiffViewer from "./pages/DiffViewer";
import Compare from "./pages/Compare";
import SearchWorkspace from "./pages/SearchWorkspace";
import Alerts from "./pages/Alerts";
import SettingsPage from "./pages/SettingsPage";
import ApiDestinations from "./pages/ApiDestinations";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<Index />} />
                <Route path="/ai-monitors" element={<AiMonitors />} />
                <Route path="/web-monitors" element={<WebMonitors />} />
                <Route path="/monitors/new" element={<CreateMonitor />} />
                <Route path="/results" element={<ResultsFeed />} />
                <Route path="/evidence/:id" element={<EvidenceViewer />} />
                <Route path="/evidence" element={<EvidenceViewer />} />
                <Route path="/diffs/:id" element={<DiffViewer />} />
                <Route path="/diffs" element={<DiffViewer />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/search" element={<SearchWorkspace />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/destinations" element={<ApiDestinations />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

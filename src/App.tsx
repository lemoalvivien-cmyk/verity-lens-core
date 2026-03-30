import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import SubmitLead from "./pages/SubmitLead";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLeads from "./pages/admin/Leads";
import AdminCities from "./pages/admin/Cities";
import AdminCategories from "./pages/admin/Categories";
import AdminTags from "./pages/admin/Tags";
import AdminExport from "./pages/admin/Export";
import AdminSearch from "./pages/admin/Search";
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
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/submit" element={<SubmitLead />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Private admin cockpit */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="cities" element={<AdminCities />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="tags" element={<AdminTags />} />
                <Route path="export" element={<AdminExport />} />
                <Route path="search" element={<AdminSearch />} />
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

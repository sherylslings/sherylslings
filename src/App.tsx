import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import CarrierDetailPage from "./pages/CarrierDetailPage";
import PoliciesPage from "./pages/PoliciesPage";
import SafetyPage from "./pages/SafetyPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarriers from "./pages/admin/AdminCarriers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminSafety from "./pages/admin/AdminSafety";
import AdminBlog from "./pages/admin/AdminBlog";
import AccountingDashboard from "./pages/admin/AccountingDashboard";
import Transactions from "./pages/admin/Transactions";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SiteSettingsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/carrier/:id" element={<CarrierDetailPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route index element={<Navigate to="carriers" replace />} />
              <Route path="carriers" element={<AdminCarriers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="policies" element={<AdminPolicies />} />
              <Route path="safety" element={<AdminSafety />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SiteSettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

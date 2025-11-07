import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Donors from "./pages/Donors";
import FoodItems from "./pages/FoodItems";
import Storage from "./pages/Storage";
import DistributionEvents from "./pages/DistributionEvents";
import DistributionDetails from "./pages/DistributionDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute requiredRole="donor">
                <Layout>
                  <DonorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donors"
            element={
              <ProtectedRoute>
                <Layout>
                  <Donors />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-items"
            element={
              <ProtectedRoute>
                <Layout>
                  <FoodItems />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage"
            element={
              <ProtectedRoute>
                <Layout>
                  <Storage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribution-events"
            element={
              <ProtectedRoute>
                <Layout>
                  <DistributionEvents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribution-details"
            element={
              <ProtectedRoute>
                <Layout>
                  <DistributionDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

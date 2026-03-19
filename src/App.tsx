import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Checking from "@/modules/checking/pages/Checking";
import ReservationsPage from "@/modules/booking/pages/ReservationsPage.tsx";
import ProductFamiliesPage from "@/modules/product-families/pages/ProductFamiliesPage";
import ProductsPage from "@/modules/products/pages/ProductsPage";
import LiquidationsPage from "@/modules/liquidations/pages/LiquidationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/clientes/reservas" replace />} />
            <Route path="/clientes/reservas" element={<ReservationsPage />} />
            <Route path="/clientes/checking" element={<Checking />} />
            <Route path="/productos/familias" element={<ProductFamiliesPage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/liquidaciones" element={<LiquidationsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

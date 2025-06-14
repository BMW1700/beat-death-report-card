import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Phase9Page from "./pages/Phase9Page";
import Phase10Page from "./pages/Phase10Page";
import Phase11Page from "./pages/Phase11Page";
import Phase12Page from "./pages/Phase12Page";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Custom PHASE routes */}
          <Route path="/phase9" element={<Phase9Page />} />
          <Route path="/phase10" element={<Phase10Page />} />
          <Route path="/phase11" element={<Phase11Page />} />
          <Route path="/phase12" element={<Phase12Page />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

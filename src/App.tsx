
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ApiPlatformPage from "./pages/ApiPlatformPage";
import SurvivalistMapPage from "./pages/SurvivalistMapPage";
import WellnessPage from "./pages/WellnessPage";
import SciencePage from "./pages/SciencePage";
import DeathScannerPage from "./pages/DeathScannerPage";
import { MainNavBar } from "@/components/MainNavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainNavBar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/death-scanner" element={<DeathScannerPage />} />
            <Route path="/api-platform" element={<ApiPlatformPage />} />
            <Route path="/survival-map" element={<SurvivalistMapPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/science" element={<SciencePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

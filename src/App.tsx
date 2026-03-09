
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SurvivalistMapPage from "./pages/SurvivalistMapPage";
import DeathScannerPage from "./pages/DeathScannerPage";
import OnboardingPage from "./pages/OnboardingPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import { MainNavBar } from "@/components/MainNavBar";
import { LifeClockProvider } from "@/contexts/LifeClockContext";
import { AuthProvider } from "@/hooks/useAuth";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LifeClockProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainNavBar />
            <div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/death-scanner" element={<DeathScannerPage />} />
                <Route path="/survival-map" element={<SurvivalistMapPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LifeClockProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

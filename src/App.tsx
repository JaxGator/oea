import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DesktopNavigation } from "./components/DesktopNavigation";
import { MobileNavigation } from "./components/MobileNavigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Auth from "./pages/Auth";
import Members from "./pages/Members";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div>
            <DesktopNavigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/events" element={<Events />} />
              <Route path="/about" element={<About />} />
              <Route path="/members" element={<Members />} />
            </Routes>
            <MobileNavigation />
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
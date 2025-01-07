import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./components/providers/AppProviders";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Members from "./pages/Members";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import Test from "./pages/Test";
import Store from "./pages/Store";
import Maintenance from "./pages/Maintenance";
import { PrivacyPolicy } from "./components/legal/PrivacyPolicy";
import { TermsAndConditions } from "./components/legal/TermsAndConditions";
import { ErrorBoundary } from "./components/error/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-4 rounded-lg bg-red-50 text-red-800">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p>Please try refreshing the page. If the problem persists, contact support.</p>
          </div>
        </div>
      }
    >
      <AppProviders>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="members" element={<Members />} />
            <Route path="profile" element={<Profile />} />
            <Route path="resources" element={<Resources />} />
            <Route path="admin" element={<Admin />} />
            <Route path="test" element={<Test />} />
            <Route path="store" element={<Store />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsAndConditions />} />
          </Route>
        </Routes>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
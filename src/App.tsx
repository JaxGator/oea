import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./components/providers/AppProviders";
import { AppLayout } from "./components/layout/AppLayout";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireAdmin } from "./components/auth/RequireAdmin";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Users from "./pages/Users";
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

const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="p-4 rounded-lg bg-red-50 text-red-800">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p>Please try refreshing the page. If the problem persists, contact support.</p>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <AppProviders>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<AppLayout />}>
            {/* Public Routes */}
            <Route index element={<Index />} />
            <Route path="about" element={<About />} />
            <Route path="events" element={<Events />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsAndConditions />} />
            <Route path="resources" element={<Resources />} />
            
            {/* Protected Routes */}
            <Route path="events/:id" element={<RequireAuth><EventDetails /></RequireAuth>} />
            <Route path="users" element={<RequireAuth><Users /></RequireAuth>} />
            <Route path="members" element={<RequireAuth><Members /></RequireAuth>} />
            <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="admin" element={
              <RequireAuth>
                <RequireAdmin>
                  <Admin />
                </RequireAdmin>
              </RequireAuth>
            } />
            <Route path="test" element={<RequireAuth><Test /></RequireAuth>} />
            <Route path="store" element={<RequireAuth><Store /></RequireAuth>} />
            <Route path="maintenance" element={<RequireAuth><Maintenance /></RequireAuth>} />
          </Route>
        </Routes>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import About from "@/pages/About";
import Members from "@/pages/Members";
import Store from "@/pages/Store";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import Maintenance from "@/pages/Maintenance";
import { TermsAndConditions } from "@/components/legal/TermsAndConditions";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { useAuthState } from "@/hooks/useAuthState";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import { Loader2 } from "lucide-react";

// Protected route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthState();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

// Maintenance mode wrapper component
function MaintenanceModeWrapper({ children }: { children: React.ReactNode }) {
  const { isMaintenanceMode, isLoading, profile } = useMaintenanceMode();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Allow admins to bypass maintenance mode
  if (isMaintenanceMode && !profile?.is_admin) {
    return <Navigate to="/maintenance" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    element: (
      <MaintenanceModeWrapper>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </MaintenanceModeWrapper>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/events/:eventId",
        element: <EventDetails />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/members",
        element: (
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        ),
      },
      {
        path: "/store",
        element: <Store />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/terms",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/maintenance",
    element: <Maintenance />,
  },
]);
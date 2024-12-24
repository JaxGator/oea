import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import Members from "@/pages/Members";
import About from "@/pages/About";
import Resources from "@/pages/Resources";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Store from "@/pages/Store";
import { TermsAndConditions } from "@/components/legal/TermsAndConditions";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold">Unexpected Error</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                We encountered an unexpected error. Please try again later.
              </p>
            </div>
          </div>
        }
      >
        <div>An error occurred while loading the application.</div>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "events/:id",
        element: <EventDetails />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "resources",
        element: <Resources />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "store",
        element: <Store />,
      },
      {
        path: "terms",
        element: <TermsAndConditions />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
    ],
  },
]);
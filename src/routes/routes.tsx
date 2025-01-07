import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import Members from "@/pages/Members";
import Profile from "@/pages/Profile";
import Resources from "@/pages/Resources";
import Admin from "@/pages/Admin";
import Test from "@/pages/Test";
import Store from "@/pages/Store";
import Maintenance from "@/pages/Maintenance";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { TermsAndConditions } from "@/components/legal/TermsAndConditions";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    ),
    errorElement: (
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "auth",
        element: <Auth />,
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
        path: "profile",
        element: <Profile />,
      },
      {
        path: "resources",
        element: <Resources />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "store",
        element: <Store />,
      },
      {
        path: "maintenance",
        element: <Maintenance />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms",
        element: <TermsAndConditions />,
      },
    ],
  },
]);
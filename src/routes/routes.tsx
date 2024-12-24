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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
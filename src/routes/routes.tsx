import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import About from "@/pages/About";
import Members from "@/pages/Members";
import Store from "@/pages/Store";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";

export const router = createBrowserRouter([
  {
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth",
        element: <Auth />,
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
        element: <Members />,
      },
      {
        path: "/store",
        element: <Store />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
    ],
  },
]);
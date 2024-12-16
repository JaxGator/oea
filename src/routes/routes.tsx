import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Events from "@/pages/Events";
import About from "@/pages/About";
import Members from "@/pages/Members";
import Store from "@/pages/Store";
import Profile from "@/pages/Profile";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
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
    ],
  },
]);
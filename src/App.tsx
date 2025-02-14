import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { AppProviders } from "@/components/providers/AppProviders";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { lazy, Suspense } from "react";
import { PublicEventView } from "./components/event/public/PublicEventView";

// Lazy load other components
const Home = lazy(() => import("@/pages/Home"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetails = lazy(() => import("@/pages/EventDetails"));
const Profile = lazy(() => import("@/pages/Profile"));
const Admin = lazy(() => import("@/pages/Admin"));
const Polls = lazy(() => import("@/pages/Polls"));
const Social = lazy(() => import("@/pages/Social"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Site = lazy(() => import("@/pages/Site"));
const Account = lazy(() => import("@/pages/Account"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/events",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Events />
      </Suspense>
    ),
  },
  {
    path: "/events/share/:token",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PublicEventView />
      </Suspense>
    ),
  },
  {
    path: "/events/:eventId",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Admin />
      </Suspense>
    ),
  },
  {
    path: "/polls",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Polls />
      </Suspense>
    ),
  },
  {
    path: "/social",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Social />
      </Suspense>
    ),
  },
  {
    path: "/gallery",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Gallery />
      </Suspense>
    ),
  },
  {
    path: "/site",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Site />
      </Suspense>
    ),
  },
  {
    path: "/account",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Account />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <NotificationProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
          <Toaster />
        </NotificationProvider>
      </AppProviders>
    </QueryClientProvider>
  );
}

export default App;

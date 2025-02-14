
import { createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { AppProviders } from "@/components/providers/AppProviders";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { lazy, Suspense } from "react";
import { PublicEventView } from "./components/event/public/PublicEventView";
import { SessionManager } from "@/components/auth/SessionManager";

// Lazy load components
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
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/events",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Events />
        </Suspense>
      </SessionManager>
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
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <EventDetails />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/profile",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/admin",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Admin />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/polls",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Polls />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/social",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Social />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/gallery",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Gallery />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/site",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Site />
        </Suspense>
      </SessionManager>
    ),
  },
  {
    path: "/account",
    element: (
      <SessionManager queryClient={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Account />
        </Suspense>
      </SessionManager>
    ),
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

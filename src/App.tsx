
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { AppProviders } from "@/components/providers/AppProviders";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { lazy, Suspense } from "react";
import { PublicEventView } from "./components/event/public/PublicEventView";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Lazy load components
const Index = lazy(() => import("@/pages/Index"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetails = lazy(() => import("@/pages/EventDetails"));
const Profile = lazy(() => import("@/pages/Profile"));
const Admin = lazy(() => import("@/pages/Admin"));
const Polls = lazy(() => import("@/pages/Polls"));
const Social = lazy(() => import("@/pages/Social"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Site = lazy(() => import("@/pages/Site"));
const Account = lazy(() => import("@/pages/Account"));
const Auth = lazy(() => import("@/pages/Auth"));
const Terms = lazy(() => import("@/pages/Terms"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Index />
      </Suspense>
    ),
  },
  {
    path: "/auth",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: "/auth/callback",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Auth />
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
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Admin />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/polls",
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Polls />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/social",
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Social />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/gallery",
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Gallery />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/site",
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Site />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/account",
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Loading...</div>}>
          <Account />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/terms",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Terms />
      </Suspense>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivacyPolicy />
      </Suspense>
    ),
  }
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

import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./components/providers/AppProviders";
import { router } from "./routes/routes";
import { usePageTitle } from "./hooks/usePageTitle";

const App = () => {
  usePageTitle();

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
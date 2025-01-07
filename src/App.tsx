import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppProviders } from "./components/providers/AppProviders";
import { router } from "./routes/routes";

const App = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./components/providers/AppProviders";
import { router } from "./routes/routes";

const App = () => {
  return (
    <AppProviders session={null}>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
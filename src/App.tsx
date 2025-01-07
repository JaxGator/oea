import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./components/providers/AppProviders";
import { router } from "./routes/routes";

const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        {/* RouterProvider is not needed when using BrowserRouter */}
        <router.Component />
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
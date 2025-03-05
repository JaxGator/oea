
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppProviders } from './components/providers/AppProviders';
import { Toaster } from "sonner";

// Simplified error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Failed to find the root element");

  const root = createRoot(rootElement);
  
  // Render without StrictMode to avoid double rendering and potential issues
  root.render(
    <BrowserRouter>
      <AppProviders>
        <App />
        <Toaster position="top-right" />
      </AppProviders>
    </BrowserRouter>
  );
  
  console.log("Application successfully rendered");
} catch (error) {
  console.error("Critical error during app initialization:", error);
  
  // Fallback render in case of critical error
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
        <div style="padding: 20px; background-color: #fee2e2; color: #b91c1c; border-radius: 8px; max-width: 500px;">
          <h2 style="margin-bottom: 16px; font-size: 20px;">Application Error</h2>
          <p>We encountered a problem while loading the application. Please try refreshing the page.</p>
          <button onclick="window.location.reload()" style="margin-top: 16px; padding: 8px 16px; background-color: #b91c1c; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}


import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { NotificationProvider } from './components/providers/NotificationProvider';

createRoot(document.getElementById("root")!).render(
  <NotificationProvider>
    <App />
  </NotificationProvider>
);

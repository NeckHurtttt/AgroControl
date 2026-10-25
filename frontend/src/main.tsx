import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App';
import AppErrorBoundary from './app/AppErrorBoundary';
import { AuthProvider } from './features/auth/context/AuthContext';
import './styles/tokens.css';
import './styles/global.css';
import './styles/forms.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </AppErrorBoundary>
  </StrictMode>,
);

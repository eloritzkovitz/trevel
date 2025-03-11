import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/styles.css';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
    <StrictMode>
      <App />
    </StrictMode>,
  </GoogleOAuthProvider>  
)

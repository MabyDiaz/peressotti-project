import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

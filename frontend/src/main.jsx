import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CuponProvider from './context/CuponContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CuponProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </CuponProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

import { createContext, useContext } from 'react';

export const CuponContext = createContext();

export function useCupon() {
  const context = useContext(CuponContext);
  if (!context) {
    throw new Error('useCupon debe usarse dentro de CuponProvider');
  }
  return context;
}

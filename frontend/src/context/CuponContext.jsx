import { useState } from 'react';
import { CuponContext } from '../hooks/useCupon.js';
import api from '../api/axios';

export default function CuponProvider({ children }) {
  const [cupon, setCupon] = useState(null);
  const [mensajeCupon, setMensajeCupon] = useState('');

  const aplicarCupon = async (codigoCupon) => {
    try {
      const response = await api.get(
        `/cupones/validar/${codigoCupon.trim().toUpperCase()}`
      );

      // Crear objeto de cupón con la estructura correcta
      const cuponData = {
        nombreCupon: response.data.nombreCupon,
        porcentajeDescuento: response.data.porcentajeDescuento,
        codigoCupon: codigoCupon.toUpperCase(),
      };

      setCupon(cuponData);
      setMensajeCupon(
        `Cupón "${response.data.nombreCupon}" (${response.data.porcentajeDescuento}%) aplicado con éxito.`
      );
      return true;
    } catch (error) {
      setCupon(null);
      setMensajeCupon(
        error.response?.data?.msg ||
          'El código de cupón ingresado no es válido o ha expirado.'
      );
      return false;
    }
  };

  const quitarCupon = () => {
    setCupon(null);
    setMensajeCupon('Cupón removido correctamente.');
  };

  return (
    <CuponContext.Provider
      value={{ cupon, mensajeCupon, aplicarCupon, quitarCupon }}>
      {children}
    </CuponContext.Provider>
  );
}

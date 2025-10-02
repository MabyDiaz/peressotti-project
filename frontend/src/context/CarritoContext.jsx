import { useState } from 'react';
import { CarritoContext } from '../hooks/useCarrito.js';
import { useCupon } from '../hooks/useCupon.js';

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const { cupon } = useCupon();

  const agregarProducto = (producto, customData, cantidad = 1) => {
    const existe = carrito.find(
      (item) =>
        item.id === producto.id &&
        JSON.stringify(item.customData) === JSON.stringify(customData)
    );

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id &&
          JSON.stringify(item.customData) === JSON.stringify(customData)
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad,
          oferta: producto.oferta,
          descuento: producto.descuento,
          imagenPrincipal: producto.imagenPrincipal,
          customData,
        },
      ]);
    }
  };

  const eliminarProducto = (id) =>
    setCarrito((prev) => prev.filter((item) => item.id !== id));

  const aumentarCantidad = (id) =>
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );

  const disminuirCantidad = (id) =>
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 }
          : item
      )
    );

  // Cálculo de totales
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const descuentoPorCupon = cupon?.porcentajeDescuento
    ? carrito.reduce((acc, item) => {
        // aplicar cupón solo a productos SIN oferta y SIN descuento
        if (!item.oferta && (!item.descuento || item.descuento === 0)) {
          return (
            acc +
            (item.precio * item.cantidad * cupon.porcentajeDescuento) / 100
          );
        }
        return acc;
      }, 0)
    : 0;

  const totalCarrito = subtotal - descuentoPorCupon;

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        vaciarCarrito,
        aumentarCantidad,
        disminuirCantidad,
        cantidadTotal,
        subtotal,
        descuentoPorCupon,
        totalCarrito,
      }}>
      {children}
    </CarritoContext.Provider>
  );
};

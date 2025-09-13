import { useState } from 'react';
import { CarritoContext } from '../hooks/useCarrito.js';

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarProducto = (producto, cantidad) => {
    setCarrito((prevCarrito) => {
      const index = prevCarrito.findIndex((item) => item.id === producto.id);
      if (index !== -1) {
        const nuevoCarrito = [...prevCarrito];
        nuevoCarrito[index].cantidad += cantidad;
        return nuevoCarrito;
      } else {
        return [...prevCarrito, { ...producto, cantidad }];
      }
    });
  };

  const eliminarProducto = (id) =>
    setCarrito((prev) => prev.filter((item) => item.id !== id));

  const incrementarCantidad = (id) =>
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );

  const decrementarCantidad = (id) =>
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 }
          : item
      )
    );

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

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
        incrementarCantidad,
        decrementarCantidad,
        cantidadTotal,
        totalCarrito,
      }}>
      {children}
    </CarritoContext.Provider>
  );
};

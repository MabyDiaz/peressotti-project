const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Retorna la URL completa de una imagen
 * @param {string} path - Ruta guardada en la DB (ej: "/uploads/imagen.png")
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  return `${API_URL}${path}`;
};

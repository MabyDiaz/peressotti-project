import { Mensaje, Producto } from '../models/index.js';

// Obtener mensajes
export const obtenerMensajesPorproducto = async (req, res) => {
  try {
    const { id } = req.params;
    const mensajes = await Mensaje.findAll({
      where: { idProducto: id },
    });
    res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res
      .status(500)
      .json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Crear mensaje
export const crearMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const nuevoMensaje = await Mensaje.create({
      idProducto: id,
      texto,
    });
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res
      .status(500)
      .json({ message: 'Error interno del servidor', error: error.message });
  }
};

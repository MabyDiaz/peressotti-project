import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar cliente con Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const crearPreferencia = async (req, res) => {
  try {
    const { items, clienteEmail } = req.body;

    const preference = new Preference(client);

    const body = {
      items: items.map((item) => ({
        title: item.nombre,
        quantity: Number(item.cantidad),
        currency_id: 'ARS',
        unit_price: Number(item.precio),
      })),
      payer: {
        email: clienteEmail,
      },
      back_urls: {
        success: 'http://localhost:5173/pago-exitoso',
        failure: 'http://localhost:5173/pago-fallido',
        pending: 'http://localhost:5173/pago-pendiente',
      },
      auto_return: 'approved',
    };

    const result = await preference.create({ body });

    res.json({
      success: true,
      id: result.id,
      init_point: result.init_point, // URL de checkout
    });
  } catch (error) {
    console.error('❌ Error al crear preferencia de pago:', error);
    res.status(500).json({ success: false, message: 'Error al crear la preferencia' });
  }
};

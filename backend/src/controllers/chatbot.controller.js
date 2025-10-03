import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatQuery = async (req, res) => {
  try {
    const { message } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente de ventas de una imprenta llamada Peressotti. Ayudas a los clientes a elegir productos de impresión (tarjetas, flyers, banners, etc.), respondes dudas técnicas y das recomendaciones. Sé claro, amable y profesional.',
        },
        { role: 'user', content: message },
      ],
      model: 'llama3-8b-8192', // o "llama3-70b-8192" si necesitas más calidad
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply =
      chatCompletion.choices[0]?.message?.content?.trim() ||
      'Lo siento, no pude generar una respuesta.';

    res.json({ success: true, reply });
  } catch (error) {
    console.error('Error en Groq:', error);
    res
      .status(500)
      .json({ success: false, error: 'Error al procesar la solicitud.' });
  }
};

// import { useState } from 'react';
// import api from '../../api/axios.js';

// const ChatBot = () => {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { role: 'user', content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const res = await api.post('/chat/chat-query', { message: input });
//       if (res.data.success) {
//         const botMessage = { role: 'assistant', content: res.data.reply };
//         setMessages((prev) => [...prev, botMessage]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content: 'Lo siento, hubo un error.' },
//         ]);
//       }
//     } catch (err) {
//       console.error('Error en el chat:', err);
//       setMessages((prev) => [
//         ...prev,
//         { role: 'assistant', content: '⚠️ No pude conectar con el asistente.' },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         width: '360px',
//         maxHeight: '500px',
//         backgroundColor: '#fff',
//         borderRadius: '12px',
//         boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
//         display: 'flex',
//         flexDirection: 'column',
//         zIndex: 1000,
//       }}>
//       {/* Header */}
//       <div
//         style={{
//           backgroundColor: '#dc2626',
//           color: 'white',
//           padding: '12px 16px',
//           borderRadius: '12px 12px 0 0',
//           fontWeight: 'bold',
//           fontSize: '14px',
//         }}>
//         Asistente de Imprenta Peressotti
//       </div>

//       {/* Chat messages */}
//       <div
//         style={{
//           flex: 1,
//           padding: '12px',
//           overflowY: 'auto',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '10px',
//         }}>
//         {messages.length === 0 && (
//           <p
//             style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center' }}>
//             ¡Hola! ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre
//             tarjetas, flyers, banners, presupuestos, etc.
//           </p>
//         )}
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
//               maxWidth: '80%',
//               padding: '8px 12px',
//               borderRadius: '12px',
//               backgroundColor: msg.role === 'user' ? '#dc2626' : '#f3f4f6',
//               color: msg.role === 'user' ? 'white' : '#1f2937',
//               fontSize: '14px',
//               lineHeight: 1.4,
//             }}>
//             {msg.content}
//           </div>
//         ))}
//         {loading && (
//           <div
//             style={{
//               alignSelf: 'flex-start',
//               maxWidth: '80%',
//               padding: '8px 12px',
//               borderRadius: '12px',
//               backgroundColor: '#f3f4f6',
//               color: '#1f2937',
//               fontSize: '14px',
//             }}>
//             ⏳ Pensando...
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           display: 'flex',
//           padding: '12px',
//           borderTop: '1px solid #e5e7eb',
//           gap: '8px',
//         }}>
//         <input
//           type='text'
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder='Escribe tu mensaje...'
//           disabled={loading}
//           style={{
//             flex: 1,
//             padding: '8px 12px',
//             border: '1px solid #d1d5db',
//             borderRadius: '20px',
//             fontSize: '14px',
//           }}
//         />
//         <button
//           type='submit'
//           disabled={loading || !input.trim()}
//           style={{
//             backgroundColor: '#dc2626',
//             color: 'white',
//             border: 'none',
//             borderRadius: '20px',
//             padding: '8px 16px',
//             fontWeight: 'bold',
//             cursor: 'pointer',
//             opacity: loading || !input.trim() ? 0.6 : 1,
//           }}>
//           Enviar
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBot;

import { useState, useEffect } from 'react';
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import api from '../../api/axios';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // ✅ Cargar historial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // ✅ Guardar historial en localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    try {
      const res = await api.post('/chat/chat-query', { message: input });
      const botReply = res.data.reply || 'Lo siento, no pude responder.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error al conectar con el asistente.' },
      ]);
    }
  };

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {/* Botón flotante para abrir/cerrar */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className='bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition'>
          <FaComments size={24} />
        </button>
      ) : (
        <div className='w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200'>
          {/* Header */}
          <div className='flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-2xl'>
            <h2 className='font-semibold'>Asistente</h2>
            <div className='flex gap-2'>
              <button
                onClick={() => setOpen(false)}
                className='hover:text-gray-200'>
                <FaMinus />
              </button>
              <button
                onClick={() => setOpen(false)}
                className='hover:text-gray-200'>
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className='flex-1 overflow-y-auto p-3 space-y-2 text-sm'>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 self-end ml-auto text-right'
                    : 'bg-gray-100 self-start mr-auto text-left'
                }`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className='flex items-center border-t p-2'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder='Escribí tu mensaje...'
              className='flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <button
              onClick={sendMessage}
              className='ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition'>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;

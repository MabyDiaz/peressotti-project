import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaCommentAlt, FaMinus } from 'react-icons/fa';
import api from '../../api/axios';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // ✅ Cargar historial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // ✅ Guardar historial en localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        { sender: 'bot', text: '⚠️ No pude conectar con el asistente.' },
      ]);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  // Formatear enlaces (WhatsApp) como clickeables
  const formatMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='text-red-600 underline hover:text-red-800 font-medium'>
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {/* Botón flotante para abrir */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className='bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 focus:outline-none'>
          <FaComments size={24} />
        </button>
      ) : (
        <div className='w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200'>
          {/* Header */}
          <div className='flex justify-between items-center bg-red-600 text-white px-4 py-2 rounded-t-2xl'>
            <h2 className='font-semibold text-sm'>Asistente Peressotti</h2>
            <div className='flex gap-1'>
              <button
                onClick={clearHistory}
                className='text-white hover:text-gray-200 text-xs'
                title='Limpiar historial'>
                🗑️
              </button>
              {/* <button
                onClick={() => setOpen(false)}
                className='text-white hover:text-gray-200'
                title='Minimizar'>
                <FaMinus size={14} />
              </button> */}
              <button
                onClick={() => setOpen(false)}
                className='text-white hover:text-gray-200'
                title='Cerrar'>
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className='flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50'>
            {messages.length === 0 && (
              <p className='text-gray-500 text-center text-xs'>
                ¡Hola! ¿En qué puedo ayudarte?
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-red-600 text-white'
                    : 'mr-auto bg-white border border-gray-200 text-gray-800'
                }`}>
                <div className='text-sm'>{formatMessage(msg.text)}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='flex items-center border-t border-gray-200 p-2 bg-white'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder='Escribí tu mensaje...'
              className='flex-1 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
            />
            <button
              onClick={sendMessage}
              className='ml-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition'
              aria-label='Enviar mensaje'>
              <FaCommentAlt size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;

import { useState, useEffect } from 'react';

const ProcesoCompra = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: 'Explorá el catálogo',
      description: 'Navegá por nuestras categorías y descubrí opciones',
      icon: '📚',
    },
    {
      number: 2,
      title: 'Elegí tu producto',
      description:
        'Seleccioná el producto que mejor se adapte a tus necesidades',
      icon: '🖼️',
    },
    {
      number: 3,
      title: 'Personalizá tu pedido',
      description: 'Cargá tus archivos y especificaciones',
      icon: '✏️',
    },
    {
      number: 4,
      title: 'Revisá tu carrito',
      description: 'Chequeá los detalles y aplicá cupones',
      icon: '🛒',
    },
    {
      number: 5,
      title: 'Pagá fácilmente',
      description: 'Seleccioná tu medio de pago preferido',
      icon: '💳',
    },
    {
      number: 6,
      title: 'Recibí tu pedido',
      description: 'Nosotros nos encargamos de la producción y entrega',
      icon: '📦',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className='bg-[#d0d3c5] text-gray-800 py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-center text-3xl font-bold mb-2'>¿Cómo funciona?</h2>
        <p className='text-center text-gray-600 mb-10'>
          Un proceso simple para obtener tus productos impresos
        </p>

        {/* Desktop */}
        <div className='hidden md:grid grid-cols-6 gap-6 relative'>
          {/* Línea de conexión */}
          <div className='absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-cyan-400 to-gray-700 z-0'></div>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className='relative z-10 text-center'>
              <div
                className={`w-20 h-20 mx-auto flex items-center justify-center rounded-full shadow-md transition-transform duration-300 ${
                  index <= currentStep
                    ? 'bg-gradient-to-br from-cyan-400 to-red-500 text-white scale-110'
                    : 'bg-white text-gray-400'
                }`}
                style={{ fontSize: '1.8rem' }}>
                {step.icon}
              </div>
              <h3
                className={`mt-3 font-semibold ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                {step.title}
              </h3>
              <p className='text-sm text-gray-600'>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className='md:hidden text-center mt-8'>
          <div className='flex justify-center mb-4'>
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full mx-1 ${
                  index === currentStep ? 'bg-cyan-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div>
            <div className='w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-red-500 text-white text-2xl animate-pulse'>
              {steps[currentStep].icon}
            </div>
            <h3 className='text-lg font-semibold'>
              {steps[currentStep].title}
            </h3>
            <p className='text-gray-600 mt-2'>
              {steps[currentStep].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcesoCompra;

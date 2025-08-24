"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import ClientOnly from '../ClientOnly';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "md",
  showCloseButton = true,
  withImage = false // Nueva prop para mostrar imagen
}) => {
  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc, false);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Manejar click en el overlay (fondo)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Configurar ancho máximo basado en la prop
  const getMaxWidth = () => {
    if (withImage) {
      return 'w-[850px]'; // Ancho fijo cuando tiene imagen - actualizado a 850px
    }
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      default: return 'max-w-md';
    }
  };

  const getHeight = () => {
    return withImage ? 'h-[600px]' : 'max-h-[90vh]';
  };

  return (
    <ClientOnly>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 1000, backgroundColor: '#dee1e7' }}
        onClick={handleOverlayClick}
      >
        <div 
          className={`
            bg-white 
            rounded-2xl 
            shadow-lg 
            ${getMaxWidth()}
            ${getHeight()}
            overflow-hidden
            transition-all 
            duration-300 
            ease-out
            animate-fadeInScale
            ${withImage ? 'flex' : 'flex flex-col'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {withImage ? (
            // Layout con imagen (tablet/laptop)
            <div className="hidden md:flex w-full h-full">
              {/* Columna izquierda - Contenido */}
              <div className="w-[425px] flex flex-col">
                {/* Header del modal */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    {title && (
                      <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                      </h2>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="
                          p-2 
                          text-gray-400 
                          hover:text-gray-600 
                          transition-colors 
                          duration-200 
                          rounded-full 
                          hover:bg-gray-100
                        "
                        aria-label="Cerrar modal"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12" 
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Contenido scrolleable */}
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
              </div>

              {/* Columna derecha - Imagen */}
              <div className="flex-1 bg-gray-50 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                  style={{
                    backgroundImage: "url('/assets/images/login.png')"
                  }}
                />
              </div>
            </div>
          ) : (
            // Layout normal sin imagen
            <>
              {/* Header del modal */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="
                        p-2 
                        text-gray-400 
                        hover:text-gray-600 
                        transition-colors 
                        duration-200 
                        rounded-full 
                        hover:bg-gray-100
                      "
                      aria-label="Cerrar modal"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Contenido del modal */}
              <div className="p-6">
                {children}
              </div>
            </>
          )}

          {/* Layout móvil para modales con imagen */}
          {withImage && (
            <div className="md:hidden flex flex-col w-full h-full">
              {/* Header del modal */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="
                        p-2 
                        text-gray-400 
                        hover:text-gray-600 
                        transition-colors 
                        duration-200 
                        rounded-full 
                        hover:bg-gray-100
                      "
                      aria-label="Cerrar modal"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {/* Contenido del modal */}
              <div className="p-6 flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
};

export default Modal;

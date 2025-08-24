"use client";
import { useEffect, useState, useRef } from 'react';

const VideoHero = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculamos qué tanto del componente está visible
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const totalHeight = rect.height;
      
      if (visibleHeight > 0) {
        // El componente está visible
        setIsVisible(true);
        
        // Calculamos el progreso basado en la posición del scroll
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + totalHeight)));
        setScrollProgress(progress);
      } else {
        setIsVisible(false);
      }
    };

    // Throttle para mejor rendimiento
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    handleScroll(); // Llamada inicial

    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  // Calculamos el ancho del video basado en el progreso del scroll
  // Comienza en 60% y llega hasta 100%
  const videoWidth = 60 + (40 * scrollProgress);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen md:flex md:items-center md:justify-center bg-white relative overflow-hidden mt-0 md:mt-0"
    >
      {/* Solo visible en tablet y desktop */}
      <div className="hidden md:flex w-full h-screen items-center justify-center p-4">
        <div 
          className="relative transition-all duration-500 ease-out shadow-2xl md:rounded-[28px] lg:rounded-[36px] overflow-hidden"
          style={{ 
            width: `${videoWidth}%`,
            aspectRatio: '16/9',
            transform: `scale(${0.9 + (0.1 * scrollProgress)})`,
          }}
        >
          <video
            className="w-full h-full object-cover md:rounded-[28px] lg:rounded-[36px]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              filter: `brightness(${0.8 + (0.2 * scrollProgress)})`,
            }}
          >
            <source src="/assets/images/videoHero.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
          
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 flex items-center justify-center md:rounded-[28px] lg:rounded-[36px]">
            <div 
              className="text-center text-white transition-all duration-700"
              style={{
                transform: `translateY(${20 - (20 * scrollProgress)}px)`,
                opacity: 0.8 + (0.2 * scrollProgress)
              }}
            >
              <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                Explore Properties
                <span className="block" style={{ color: '#D6E7EF' }}>Exceptional</span>
              </h2>
              
              {/* Input de búsqueda que aparece gradualmente */}
              <div 
                className="mt-0 transition-all duration-1000"
                style={{
                  opacity: scrollProgress > 0.3 ? 1 : 0,
                  transform: `translateY(${scrollProgress > 0.3 ? 0 : 20}px)`
                }}
              >
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Enter an address or zip code"
                    className="w-full px-6 py-4 text-lg text-gray-800 bg-white rounded-full border-0 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de progreso */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 transition-all duration-300 rounded-full"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout para móvil - Video simple sin efecto scroll */}
      <div className="md:hidden w-full px-4 pt-12 pb-8">
        {/* Texto solo para móvil arriba del video */}
        <div className="text-center mt-5 mb-6">
          <p className="text-gray-600 text-lg font-medium">
            Find the best properties near the area you love. You can enter a City or Zip Code.
          </p>
        </div>
        
        <div className="relative w-full shadow-xl rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video
            className="w-full h-full object-cover rounded-xl"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/assets/images/videoHero.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 flex items-center justify-center rounded-xl">
            <div className="text-center text-white px-4">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
                Explore Properties
                <span className="block" style={{ color: '#D6E7EF' }}>Exceptional</span>
              </h2>
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Enter an address or zip code"
                  className="w-full px-4 py-2 text-sm text-gray-800 bg-white rounded-full border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoHero;
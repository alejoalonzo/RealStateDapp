"use client";
import Image from "next/image";
import HeroText from './heroText/heroText';
import HeroImage from './heroImage/heroImage';
import ClientOnly from '../ClientOnly';

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile Layout - Imagen arriba, texto abajo */}
      <ClientOnly fallback={
        <div className="md:hidden">
          <HeroText />
          <HeroImage />
        </div>
      }>
        <div className="md:hidden">
          <HeroText />
          <HeroImage />
        </div>
      </ClientOnly>
      
      {/* Tablet y Desktop Layout - Dos columnas 50/50 */}
      <ClientOnly fallback={
        <div className="hidden md:flex md:h-screen">
          <div className="w-1/2 flex items-center">
            <HeroText />
          </div>
          <div className="w-1/2 flex items-center p-4">
            <HeroImage />
          </div>
        </div>
      }>
        <div className="hidden md:flex md:h-screen">
          {/* Columna izquierda - Texto Hero */}
          <div className="w-1/2 flex items-center">
            <HeroText />
          </div>
          
          {/* Columna derecha - Imagen Hero */}
          <div className="w-1/2 flex items-center p-4">
            <HeroImage />
          </div>
        </div>
      </ClientOnly>
    </div>
  );
};

export default Home;
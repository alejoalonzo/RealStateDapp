"use client";
import Image from "next/image";
import HeroText from './heroText/heroText';
import HeroImage from './heroImage/heroImage';

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile Layout - Imagen arriba, texto abajo */}
      <div className="md:hidden">
        <HeroText />
        <HeroImage />
      </div>
      
      {/* Tablet y Desktop Layout - Dos columnas 50/50 */}
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
    </div>
  );
};

export default Home;
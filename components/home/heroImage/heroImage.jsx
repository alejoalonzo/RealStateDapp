"use client";

import Image from "next/image";
import { useState } from "react";
import { IoShare, IoHeartOutline, IoHeart } from "react-icons/io5";

const HeroImage = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="w-full h-full">
      {/* Móvil sin borde; tablet/desktop más redondo */}
      <div className="relative w-full h-[100svh] md:h-[92vh] rounded-none md:rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-lg">
        {/* Imagen de fondo */}
        <Image
          src="/assets/images/hero.png"
          alt="Hero Image - Real Estate"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay sutil */}
        <div className="" />

        {/* TOP BAR: más margen ENTRE cajas (margen a la derecha del 1er y 2do bloque) */}
        <div className="absolute top-0 left-0 right-0 p-6 md:p-8">
          <div className="grid grid-cols-3 items-start">
            {/* Izquierda */}
            <div className="text-white text-left text-sm sm:text-base md:text-base font-normal max-w-[14rem] sm:max-w-[18rem] md:max-w-[24rem] pr-4 sm:pr-6 md:pr-4">
              More than 1500 real estate properties
            </div>

            {/* Centro */}
            <div className="text-white text-left text-sm sm:text-base md:text-base font-normal max-w-[14rem] sm:max-w-[18rem] md:max-w-[24rem] pr-4 sm:pr-6 md:pr-4">
              From $150,000 with a yield of 10% per annum
            </div>

            {/* Derecha: botones */}
            <div className="flex justify-end items-center gap-3">
              <button
                type="button"
                aria-pressed={liked}
                onClick={() => setLiked((v) => !v)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/90 bg-transparent flex items-center justify-center transition hover:scale-105 active:scale-95"
              >
                {liked ? (
                  <IoHeart size={20} style={{ color: "#f96fa4" }} />
                ) : (
                  <IoHeartOutline size={20} className="text-white" />
                )}
              </button>

              <button
                type="button"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white flex items-center justify-center shadow-md transition hover:scale-105 active:scale-95"
                aria-label="Share"
              >
                <IoShare size={20} className="text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: botón Connect/Wallet un poco más grande (misma tipografía) */}
        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-8 md:right-8">
          <div className="flex items-end justify-between">
            <div />
            <button
              type="button"
              className="bg-white text-[#151515] rounded-2xl px-7 py-4 shadow-lg leading-tight font-normal text-right transition hover:scale-105 active:scale-95"
            >
              <span className="block">Connect</span>
              <span className="block">Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;

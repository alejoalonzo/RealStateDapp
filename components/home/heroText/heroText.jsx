"use client";

import { IoArrowForward } from "react-icons/io5";
import { Header } from '@/components';

const HeroText = () => {
  return (
    <div className="w-full h-screen md:h-full flex flex-col px-6 md:px-8 lg:px-12">
      {/* Header Component - En el top */}
      <div className="w-full">
         <Header />
      </div>
     
      {/* Contenido principal - Centrado verticalmente */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Badge / Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-black/10 px-3.5 py-1.5 text-xs md:text-sm text-[#1e2d25] backdrop-blur">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
            <span>10 new listings this month</span>
          </div>

          {/* Heading */}
          <h1
            className="mt-6 bg-gradient-to-r from-text-primary via-text-primary to-gray-600 bg-clip-text text-transparent text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            Find your ideal home
          </h1>

          {/* Subheading */}
          <p
            className="mt-5 text-lg md:text-xl text-text-primary/80 leading-relaxed max-w-2xl font-normal"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            Discover the best real estate opportunities with our decentralized
            platform. Buy, sell, and invest securely and transparently—your
            property journey starts here.
          </p>

          {/* CTA */}
          <div className="mt-8">
            <button
              className="group inline-flex items-center gap-3 rounded-full bg-btn-primary text-white px-6 md:px-8 py-4 font-semibold shadow-[0_20px_35px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_45px_rgba(0,0,0,0.22)] transition-all"
              aria-label="Book my free consultation"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Book my free consultation
              <IoArrowForward className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroText;

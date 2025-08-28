"use client";

import { IoArrowForward } from "react-icons/io5";
import Image from "next/image";
import User from "../../user/user.jsx"; 
import Menu from "../../menu/menu.jsx";

const HeroText = () => {
  const scrollToPropertyPortfolio = () => {
    const element = document.getElementById('property-portfolio');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="w-full h-screen md:h-full flex flex-col px-4 md:px-8 lg:px-12 max-w-full overflow-x-hidden">
      {/* Header integrado - solo visible en el área de heroText */}
      <header className="bg-bg-primary border-b border-gray-100 py-2 lg:py-3 relative mb-4">
        <div className="flex items-center justify-between max-w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Image
              src="/assets/images/logo.png"
              alt="Real Estate DApp Logo"
              width={100}
              height={100}
              className="w-[55px] h-[55px] sm:w-[65px] sm:h-[65px] lg:w-[100px] lg:h-[100px] object-contain"
              priority
            />
          </div>

          {/* Icons Container */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
            {/* User Component */}
            <User />
            {/* Menu Component */}
            <Menu />
          </div>
        </div>
      </header>

      {/* Contenido principal - Centrado verticalmente */}
      <div className="flex-1 flex flex-col justify-center max-w-full">;
        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl lg:pr-8 xl:pr-12 w-full">
          {/* Badge / Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-black/10 px-3.5 py-1.5 text-xs md:text-sm text-[#1e2d25] backdrop-blur max-w-full">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 flex-shrink-0" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">10 new listings this month</span>
          </div>

          {/* Heading */}
          <h1
            className="mt-6 bg-gradient-to-r from-text-primary via-text-primary to-gray-600 bg-clip-text text-transparent text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight max-w-full break-words"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            Find your ideal home
          </h1>

          {/* Subheading */}
          <p
            className="mt-5 text-lg md:text-xl lg:text-lg xl:text-xl text-text-primary/80 leading-relaxed max-w-xl lg:max-w-lg xl:max-w-xl font-normal max-w-full break-words"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            Discover the best real estate opportunities with our decentralized
            platform. Buy, sell, and invest securely and transparently—your
            property journey starts here.
          </p>

          {/* CTA */}
          <div className="mt-8">
            <button
              onClick={scrollToPropertyPortfolio}
              className="group inline-flex items-center gap-3 rounded-full bg-btn-primary text-white px-6 md:px-8 py-4 font-semibold shadow-[0_20px_35px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_45px_rgba(0,0,0,0.22)] transition-all max-w-full"
              aria-label="See property listings"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              <span className="whitespace-nowrap">See property listings</span>
              <IoArrowForward className="transition-transform group-hover:translate-x-1 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroText;

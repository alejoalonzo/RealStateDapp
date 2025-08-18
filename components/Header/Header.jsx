"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full bg-bg-primary border-b border-gray-100 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="Real Estate DApp Logo"
            width={100}
            height={100}
            className="w-[100px] h-[100px] lg:w-[125px] lg:h-[125px] object-contain"
            priority
          />
        </div>

        {/* Icons Container */}
        <div className="flex items-center space-x-4">
          {/* Map Icon */}
          <button 
            className="p-3 rounded-lg transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: '#D6E7EF' }}
            aria-label="Mapa de propiedades"
          >
            <FaMapMarkerAlt className="w-5 h-5 text-text-primary" />
          </button>

          {/* Hamburger Menu Icon */}
          <button 
            className="p-3 rounded-lg transition-all duration-200 hover:opacity-80"
            style={{ backgroundColor: '#D6E7EF' }}
            aria-label="Menú"
          >
            <HiMenu className="w-5 h-5 text-text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

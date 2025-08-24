"use client";
import Image from "next/image";
import User from "../user/user"; 
import Menu from "../menu/menu";

const Header = () => {
  return (
    <header className="w-full bg-bg-primary border-b border-gray-100 py-2 lg:py-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="Real Estate DApp Logo"
            width={100}
            height={100}
            className="w-[70px] h-[70px] lg:w-[125px] lg:h-[125px] object-contain"
            priority
          />
        </div>

        {/* Icons Container */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* User Component - ahora incluye dirección y botón de desconectar */}
          <User />
          {/* Menu Component */}
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;

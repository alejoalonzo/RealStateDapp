"use client";

import React, { useState, useEffect, useContext } from "react";
import { IoMenu, IoClose, IoHome, IoSearch, IoGrid, IoMail, IoWallet } from "react-icons/io5";
import { Modal } from "../index";
import { RealEstateContext } from "@/context/RealEstateContext";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  const { connectWallet, account, loading, error, setError } = useContext(RealEstateContext);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Cerrar menu al hacer scroll (móvil)
  useEffect(() => {
    if (isOpen && isMobile) {
      const handleScroll = () => setIsOpen(false);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen, isMobile]);

  // Cerrar dropdown en desktop al hacer clic fuera o ESC
  useEffect(() => {
    if (isOpen && !isMobile) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isMobile]);

  // Funciones de navegación
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsOpen(false);
  };

  const openConnectWallet = () => {
    if (account) {
      // Si ya está conectado, mostrar info
      alert(`Wallet already connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
      setIsOpen(false);
      return;
    }
    // Abrir modal de conexión
    setIsWalletModalOpen(true);
    setIsOpen(false);
  };

  const handleWalletConnection = async () => {
    try {
      setError("");
      await connectWallet();
      setIsWalletModalOpen(false);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  // Cerrar modal cuando se conecte la wallet
  useEffect(() => {
    if (account && isWalletModalOpen) {
      setIsWalletModalOpen(false);
    }
  }, [account, isWalletModalOpen]);

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: IoHome,
      action: scrollToTop
    },
    {
      id: 'video-hero',
      label: 'Find Property',
      icon: IoSearch,
      action: () => scrollToSection('video-hero')
    },
    {
      id: 'property-portfolio',
      label: 'See Portfolio',
      icon: IoGrid,
      action: () => scrollToSection('property-portfolio')
    },
    {
      id: 'connect-wallet',
      label: 'Connect Wallet',
      icon: IoWallet,
      action: openConnectWallet
    },
    {
      id: 'footer',
      label: 'Contact',
      icon: IoMail,
      action: () => scrollToSection('footer')
    }
  ];

  return (
    <>
      {/* Menu Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: '#D6E7EF' }}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <IoClose size={20} className="text-gray-800" />
          ) : (
            <IoMenu size={20} className="text-gray-800" />
          )}
        </button>

        {/* Desktop Dropdown Menu */}
        {!isMobile && isOpen && (
          <>
            {/* Overlay para cerrar el menú */}
            <div 
              className="fixed inset-0" 
              style={{ zIndex: 9998 }}
              onClick={() => setIsOpen(false)}
            />
            <div 
              className="absolute top-full right-0 mt-2 w-64 rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-96"
              style={{ 
                backgroundColor: '#ffffff',
                zIndex: 9999
              }}
            >
              <div className="p-2">
                {menuItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group"
                    style={{ 
                      color: '#151515',
                      ':hover': { backgroundColor: '#F7F6F1' }
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F6F1'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <item.icon 
                      size={18} 
                      className="text-gray-600 group-hover:text-gray-800 transition-colors duration-200" 
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Side Menu */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Side Menu */}
          <div 
            className={`fixed top-0 right-0 h-full w-80 transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ 
              backgroundColor: '#ffffff',
              zIndex: 9999
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold" style={{ color: '#151515' }}>
                Navigation
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200"
                style={{ backgroundColor: '#F7F6F1' }}
              >
                <IoClose size={20} className="text-gray-800" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 group"
                  style={{ 
                    color: '#151515',
                    ':hover': { backgroundColor: '#F7F6F1' }
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F6F1'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div 
                    className="w-10 h-10 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: '#D6E7EF' }}
                  >
                    <item.icon size={18} className="text-gray-800" />
                  </div>
                  <span className="font-medium text-lg">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Footer info */}
            <div className="absolute bottom-6 left-6 right-6">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#F7F6F1' }}
              >
                <h3 className="font-semibold mb-1" style={{ color: '#151515' }}>
                  Blockchain Real Estate
                </h3>
                <p className="text-sm text-gray-600">
                  Your property journey starts here
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de Wallet */}
      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        maxWidth="md"
        withImage={false}
        showCloseButton={true}
        title="Connect Your Wallet"
      >
        <div className="text-center space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <p className="text-gray-600 mb-6">
              Connect your MetaMask wallet to access the Real Estate DApp
            </p>

            <button
              onClick={handleWalletConnection}
              disabled={loading}
              className="w-full px-4 py-4 bg-gradient-to-r from-[#232323] to-[#3c3a3a] text-white rounded-lg hover:from-[#3c3a3a] hover:to-[#232323] transition-all duration-200 font-medium flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>Connect MetaMask Wallet</span>
                </>
              )}
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">Need MetaMask?</p>
                  <p className="text-xs text-blue-700 mt-1">
                    MetaMask is required to interact with this DApp. 
                    <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 ml-1">
                      Download here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Menu;

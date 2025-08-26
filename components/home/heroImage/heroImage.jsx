"use client";

import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { IoShare, IoHeartOutline, IoHeart } from "react-icons/io5";
import { Modal } from "../../index";
import { RealEstateContext } from "@/context/RealEstateContext";

const HeroImage = () => {
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [previousAccount, setPreviousAccount] = useState("");
  const [showAccountChange, setShowAccountChange] = useState(false);
  
  const { connectWallet, account, loading, error, setError, updateCurrentAccount } = useContext(RealEstateContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnectWallet = async () => {
    if (account) {
      // Si ya está conectado, mostrar info
      alert(`Wallet already connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
      return;
    }
    // Abrir modal de conexión
    setIsWalletModalOpen(true);
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

  // Detectar cambio de cuenta y mostrar notificación
  useEffect(() => {
    if (account && previousAccount && account !== previousAccount) {
      setShowAccountChange(true);
      setTimeout(() => setShowAccountChange(false), 3000); // Ocultar después de 3 segundos
    }
    setPreviousAccount(account);
  }, [account, previousAccount]);

  // Función para formatear la dirección de la wallet
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!mounted) {
    return (
      <div className="w-full h-full">
        <div className="relative w-full h-[100svh] md:h-[92vh] rounded-none md:rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-lg">
          <Image
            src="/assets/images/hero.png"
            alt="Hero Image - Real Estate"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    );
  }

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
          sizes="100vw"
          priority
        />

        {/* Overlay sutil */}
        <div className="" />

        {/* Overlay oscuro solo para móvil - solo sobre la imagen */}
        <div 
          className="md:hidden absolute inset-0 z-0" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />

        {/* Título centrado solo para móvil */}
        <div className="md:hidden absolute inset-0 flex items-center justify-start z-10">
          <div className="text-left px-6">
            <h1 
              className="mt-6 text-white font-semibold tracking-tight"
              style={{ 
                fontFamily: "var(--font-poppins), Poppins, sans-serif",
                fontSize: "clamp(4rem, 12vw, 8rem)",
                lineHeight: "0.80"
              }}
            >
              <span className="block">Blockchain</span>
              <span className="block">Real</span>
              <span className="block">Estate</span>
            </h1>
          </div>
        </div>

        {/* TOP BAR: más margen ENTRE cajas (margen a la derecha del 1er y 2do bloque) */}
        <div className="absolute top-0 left-0 right-0 p-6 md:p-8 z-20">
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
                suppressHydrationWarning
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
        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-8 md:right-8 z-20">
          <div className="flex items-end justify-between">
            <div />
            <button
              type="button"
              onClick={handleConnectWallet}
              className={`bg-white text-[#151515] rounded-2xl px-7 py-4 shadow-lg leading-tight font-normal text-right transition hover:scale-105 active:scale-95 ${account ? 'bg-green-100 border-2 border-green-300' : ''}`}
              title={account ? `Connected: ${formatAddress(account)}` : "Connect your wallet"}
            >
              {account ? (
                <>
                  <span className="block text-sm">{formatAddress(account)}</span>
                  <span className="block text-xs text-green-700">Connected</span>
                </>
              ) : (
                <>
                  <span className="block">Connect</span>
                  <span className="block">Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Notificación de cambio de cuenta */}
      {showAccountChange && account && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium">Account Changed</p>
              <p className="text-xs opacity-90">{formatAddress(account)}</p>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default HeroImage;

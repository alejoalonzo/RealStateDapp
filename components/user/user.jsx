"use client";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import { useState, useContext } from "react";
import Modal from "../modal/modal";
import Login from "../login/login";
import { RealEstateContext } from "@/context/RealEstateContext";

const User = () => {
  const { account, disconnectWallet, loading, userRole } = useContext(RealEstateContext);
  
  // Estados para controlar los modales
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isWalletConnected = !!account; // Verdadero si hay una wallet conectada
  const userPhoto = null; // Aquí irá la URL de la foto del usuario

  const handleUserClick = () => {
    if (!isWalletConnected) {
      setIsLoginModalOpen(true);
    } else {
      // Si hay wallet conectada, mostrar menú de usuario
      setShowUserMenu(!showUserMenu);
    }
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowUserMenu(false);
  };

  // Función para obtener el color del rol
  const getRoleColor = (role) => {
    switch (role) {
      case 'seller': return 'text-orange-600 bg-orange-100';
      case 'buyer': return 'text-blue-600 bg-blue-100';
      case 'inspector': return 'text-green-600 bg-green-100';
      case 'lender': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Función para formatear la dirección de la wallet
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        {/* Mostrar dirección de wallet si está conectada */}
        {isWalletConnected && (
          <div className="hidden md:flex items-center space-x-3">
            {/* Mostrar rol del usuario */}
            {userRole && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getRoleColor(userRole)}`}>
                {userRole}
              </span>
            )}
            
            <span className="text-sm text-gray-500 font-mono">
              {formatAddress(account)}
            </span>
            
            {/* Botón de desconectar */}
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50"
              title="Disconnect Wallet"
            >
              <IoLogOut className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Icono de usuario */}
        <div className="relative">
          <div 
            className={`w-12 h-12 rounded-full ${isWalletConnected ? 'bg-green-100 border-green-300' : 'bg-gray-200 border-gray-300'} flex items-center justify-center overflow-hidden border-2 cursor-pointer hover:bg-opacity-80 transition-colors ${loading ? 'opacity-50' : ''}`}
            onClick={handleUserClick}
            title={isWalletConnected ? formatAddress(account) : "Login / Sign Up"}
          >
            {isWalletConnected && userPhoto ? (
              <Image
                src={userPhoto}
                alt="Foto del usuario"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className={`w-5 h-5 ${isWalletConnected ? 'text-green-600' : 'text-gray-500'}`} />
            )}
          </div>

          {/* Menú desplegable del usuario (solo en móvil cuando hay wallet) */}
          {showUserMenu && isWalletConnected && (
            <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px] z-50 md:hidden">
              {userRole && (
                <div className="mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getRoleColor(userRole)}`}>
                    {userRole}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600 mb-2">Connected:</div>
              <div className="text-xs font-mono text-gray-800 mb-3 break-all">
                {formatAddress(account)}
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full text-left text-sm text-red-600 hover:text-red-800 transition-colors flex items-center space-x-2"
              >
                <IoLogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Login */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={closeModal}
        maxWidth="md"
        withImage={true}
        showCloseButton={false}
      >
        <Login
          type="login"
          onSwitchToSignup={switchToSignup}
          onClose={closeModal}
        />
      </Modal>

      {/* Modal de Registro */}
      <Modal
        isOpen={isSignupModalOpen}
        onClose={closeModal}
        maxWidth="lg"
        withImage={true}
        showCloseButton={false}
      >
        <Login
          type="signup"
          onSwitchToLogin={switchToLogin}
          onClose={closeModal}
        />
      </Modal>

      {/* Overlay para cerrar el menú */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default User;

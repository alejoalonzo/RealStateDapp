"use client";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import { Modal, Login } from "../index";

const User = () => {
  // Estado temporal para simular si el usuario está logueado
  // Esto se reemplazará con el estado real de autenticación
  const isLoggedIn = false; // Cambiar a true para probar con usuario logueado
  const userPhoto = null; // Aquí irá la URL de la foto del usuario
  
  // Estados para controlar los modales
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleUserClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
    // Si está logueado, aquí podríamos mostrar un menú de usuario
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

  return (
    <>
      <div 
        className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors"
        onClick={handleUserClick}
      >
        {isLoggedIn && userPhoto ? (
          <Image
            src={userPhoto}
            alt="Foto del usuario"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUser className="w-5 h-5 text-gray-500" />
        )}
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
    </>
  );
};

export default User;

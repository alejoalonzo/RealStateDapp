"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Dynamic imports para evitar errores en build
let ethers;
let Constants;
let apiFeature;

// Verificar si estamos en el cliente antes de importar ethers
if (typeof window !== "undefined") {
  try {
    ethers = require("ethers");
    Constants = require("@/context/Constants");
    apiFeature = require("@/Utils/apiFeature");
  } catch (error) {
    console.warn("Blockchain dependencies not available:", error);
  }
}

export const RealEstateContext = React.createContext();

export const RealEstateProvider = ({ children }) => {
  // USESTATE -
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(null); // Nuevo estado para el rol
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLoggedOut, setUserLoggedOut] = useState(false); // Flag para logout manual
  const [isClient, setIsClient] = useState(false);
  const [contracts, setContracts] = useState({
    realEstate: null,
    escrow: null,
    provider: null,
  }); // Contratos

  // Check if blockchain dependencies are available
  const isBlockchainAvailable = () => {
    return typeof window !== "undefined" && ethers && Constants && apiFeature;
  };

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);

    // Only check wallet if blockchain dependencies are available
    if (isBlockchainAvailable()) {
      checkWallet();
      setupMetaMaskListeners();
    } else {
      console.log(
        "Blockchain dependencies not available - running in demo mode"
      );
    }
  }, []);

  const setupMetaMaskListeners = () => {
    // Setup MetaMask account change listener
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = accounts => {
        console.log("Accounts changed:", accounts);
        if (accounts.length === 0) {
          // User disconnected all accounts
          setAccount("");
          setUserName("");
          setUserRole(null);
          setContracts({ realEstate: null, escrow: null, provider: null });
          console.log("All accounts disconnected");
        } else {
          // User switched to a different account
          const newAccount = accounts[0];
          setAccount(newAccount);
          const role = Constants?.getUserRole
            ? Constants.getUserRole(newAccount)
            : null;
          setUserRole(role);
          console.log("Account switched to:", newAccount, "Role:", role);

          // Reconectar contratos con la nueva cuenta
          initializeContracts(newAccount);
        }
      };

      // Add event listener
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup function
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  };

  // Función para inicializar contratos
  const initializeContracts = async accountAddress => {
    try {
      if (!accountAddress || !window.ethereum || !ethers || !Constants) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Crear instancias de los contratos
      const realEstateContract = new ethers.Contract(
        Constants.RealEstateAddress,
        Constants.RealEstateABI,
        signer
      );

      // Para Escrow, necesitamos el ABI. Por ahora usamos una versión simplificada
      const escrowABI = [
        "function buyer(uint256) view returns (address)",
        "function seller() view returns (address)",
        "function inspector() view returns (address)",
        "function lender() view returns (address)",
        "function isListed(uint256) view returns (bool)",
        "function approval(uint256, address) view returns (bool)",
        "function approveTransaction(uint256)",
        "function purchasePrice(uint256) view returns (uint256)",
        "function escrowAmount(uint256) view returns (uint256)",
        "function depositEarnest(uint256) payable",
        "function updateInspectionStatus(uint256, bool)",
        "function finalizeSale(uint256)",
        "function inspectionIsPassed(uint256) view returns (bool)",
        "function getBalance() view returns (uint256)",
        "receive() external payable",
      ];

      const escrowContract = new ethers.Contract(
        Constants.EscrowAddress,
        escrowABI,
        signer
      );

      setContracts({
        realEstate: realEstateContract,
        escrow: escrowContract,
        provider: provider,
      });

      console.log("Contracts initialized for account:", accountAddress);
    } catch (error) {
      console.error("Error initializing contracts:", error);
    }
  };

  //FETCH DATA TIME OF THE PAGE LOAD
  // 1) Sólo lee si ya hay wallet conectada (SIN pop-up)
  const checkWallet = async () => {
    try {
      if (!isBlockchainAvailable()) {
        console.log("Blockchain not available, skipping wallet check");
        return;
      }

      // Si el usuario hizo logout manual, no reconectar automáticamente
      if (userLoggedOut) {
        console.log("User logged out manually, skipping auto-reconnect");
        return;
      }

      const acc = await apiFeature.GetCurrentAccount();
      if (!acc) {
        return;
      }

      setAccount(acc);
      const role = Constants.getUserRole ? Constants.getUserRole(acc) : null;
      setUserRole(role);

      // Inicializar contratos
      await initializeContracts(acc);

      console.log("Wallet connected:", acc, "Role:", role);
    } catch (err) {
      console.error("checkWallet error:", err);
      setError("Please install and connect your wallet");
    }
  };

  // 2) Llamada explícita desde el botón (CON pop-up)
  const connectWallet = async () => {
    try {
      if (!isBlockchainAvailable()) {
        setError("Blockchain functionality not available");
        return;
      }

      setLoading(true);
      setError("");

      const acc = await apiFeature.ConnectWallet(); // Abre MetaMask

      if (!acc) {
        setLoading(false);
        return; // Usuario canceló la conexión
      }

      // Limpiar flag de logout cuando se conecta manualmente
      setUserLoggedOut(false);
      setAccount(acc);
      const role = Constants.getUserRole ? Constants.getUserRole(acc) : null;
      setUserRole(role);

      // Inicializar contratos
      await initializeContracts(acc);

      setLoading(false);

      console.log("Wallet connected successfully:", acc, "Role:", role);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Wallet connection failed");
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      setUserLoggedOut(true);
      setAccount("");
      setUserName("");
      setUserRole(null);
      setContracts({ realEstate: null, escrow: null, provider: null });

      if (apiFeature?.ClearWalletConnection) {
        await apiFeature.ClearWalletConnection();
      }

      console.log("Wallet disconnected");
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  // Function to update account (for manual refresh)
  const updateCurrentAccount = async () => {
    try {
      if (!isBlockchainAvailable()) return;

      const acc = await apiFeature.GetCurrentAccount();
      if (acc && acc !== account) {
        setAccount(acc);
        console.log("Account updated to:", acc);
      }
    } catch (err) {
      console.error("Error updating account:", err);
    }
  };

  //CREATE AN ACCOUNT
  const createAccount = async ({ userName }) => {
    try {
      if (!isBlockchainAvailable()) {
        setError("Blockchain functionality not available");
        return;
      }

      //check if username is provided
      if (!userName) {
        setError("Please provide username");
        return;
      }

      console.log("CreateAccount: Starting account creation for:", userName);
      const contract = await apiFeature.ConnectToContract();
      const getCreatedUser = await contract.createAccount(userName);
      setLoading(true);
      await getCreatedUser.wait();

      console.log(
        "CreateAccount: Account created successfully, updating local state"
      );
      // En lugar de recargar la página, actualizar el estado local
      setUserName(userName);
      console.log("CreateAccount: userName state updated to:", userName);
      setLoading(false);

      // window.location.reload(); // Comentado para evitar el reload
    } catch (err) {
      console.error("CreateAccount: Error creating account:", err);
      setLoading(false);
      setError("Error creating account, please reload the page");
    }
  };

  return (
    <RealEstateContext.Provider
      value={{
        CheckIfWalletIsConnected:
          apiFeature?.CheckIfWalletIsConnected || (() => false),
        connectWallet,
        disconnectWallet,
        updateCurrentAccount,
        account,
        userName,
        userRole,
        contracts,
        loading,
        error,
        userLoggedOut,
        isClient,
        createAccount,
        setError,
        PREDEFINED_ACCOUNTS: Constants?.PREDEFINED_ACCOUNTS || [],
        getUserRole: Constants?.getUserRole || (() => null),
        isBlockchainAvailable: isBlockchainAvailable(),
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

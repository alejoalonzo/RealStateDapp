"use client";
// ...existing code...

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { RealEstateABI, RealEstateAddress } from "@/context/Constants";

//INTERNAL IMPORTS
import {
  GetCurrentAccount,
  CheckIfWalletIsConnected,
  ConnectWallet,
  ConnectToContract,
  ConvertTime,
  ClearWalletConnection,
  RequestWalletDisconnect,
} from "@/Utils/apiFeature";

export const RealEstateContext = React.createContext();

export const RealEstateProvider = ({ children }) => {
  // USESTATE -
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLoggedOut, setUserLoggedOut] = useState(false); // Flag para logout manual
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
    // Check wallet connection on load
    checkWallet();

    // Setup MetaMask account change listener
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = accounts => {
        console.log("Accounts changed:", accounts);
        if (accounts.length === 0) {
          // User disconnected all accounts
          setAccount("");
          setUserName("");
          console.log("All accounts disconnected");
        } else {
          // User switched to a different account
          const newAccount = accounts[0];
          setAccount(newAccount);
          console.log("Account switched to:", newAccount);
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
  }, []);

  //FETCH DATA TIME OF THE PAGE LOAD
  // 1) Sólo lee si ya hay wallet conectada (SIN pop-up)
  const checkWallet = async () => {
    try {
      // Si el usuario hizo logout manual, no reconectar automáticamente
      if (userLoggedOut) {
        console.log("User logged out manually, skipping auto-reconnect");
        return;
      }

      const acc = await GetCurrentAccount();
      if (!acc) {
        return;
      }

      setAccount(acc);
      console.log("Wallet connected:", acc);
    } catch (err) {
      console.error("checkWallet error:", err);
      setError("Please install and connect your wallet");
    }
  };

  // 2) Llamada explícita desde el botón (CON pop-up)
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError("");

      const acc = await ConnectWallet(); // Abre MetaMask

      if (!acc) {
        setLoading(false);
        return; // Usuario canceló la conexión
      }

      // Limpiar flag de logout cuando se conecta manualmente
      setUserLoggedOut(false);
      setAccount(acc);
      setLoading(false);

      console.log("Wallet connected successfully:", acc);
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
      await ClearWalletConnection();
      console.log("Wallet disconnected");
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  // Function to update account (for manual refresh)
  const updateCurrentAccount = async () => {
    try {
      const acc = await GetCurrentAccount();
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
      //check if username is provided
      if (!userName) {
        setError("Please provide username");
        return;
      }

      console.log("CreateAccount: Starting account creation for:", userName);
      const contract = await ConnectToContract();
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
        CheckIfWalletIsConnected,
        connectWallet,
        disconnectWallet,
        updateCurrentAccount,
        account,
        userName,
        loading,
        error,
        userLoggedOut,
        isClient,
        createAccount,
        setError,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

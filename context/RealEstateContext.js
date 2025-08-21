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
      setFriendList(await contract.getMyFriendList());
      setUserList(await contract.getAllAppUsers());
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
        account,
        userName,
        loading,
        error,
        userLoggedOut,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

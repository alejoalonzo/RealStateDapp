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

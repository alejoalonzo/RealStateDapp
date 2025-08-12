import { ethers } from "ethers";

import { RealEstateABI, RealEstateAddress } from "@/context/Constants";

// Function to check if MetaMask is installed
export const CheckIfMetaMaskInstalled = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // MetaMask is installed
    return true;
  } else {
    // MetaMask is not installed
    return false;
  }
};

// Returns the first account from the connected wallet, if not NULL
export const GetCurrentAccount = async () => {
  const { ethereum } = window;
  if (!ethereum) return null;

  const accounts = await ethereum.request({ method: "eth_accounts" });
  return accounts.length ? accounts[0] : null;
};

// Function to check if  the wallet is connected
export const CheckIfWalletIsConnected = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("Ethereum object found:", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.log("No authorized account found");
    }
  } catch (error) {
    console.error("Error checking wallet connection:", error);
  }
};

// Function to connect the wallet
export const ConnectWallet = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected account:", accounts[0]);
    return accounts[0];
  } catch (error) {
    // Usuario rechazó la conexión → error.code === 4001
    if (error.code === 4001) {
      console.log("User cancelled wallet connection");
      return null; // cancelación limpia
    }
    // Otro tipo de fallo (red, provider, etc.)
    console.error("Error connecting wallet:", error);
    throw error; // deja que capas superiores lo manejen
  }
};

// Function to fetch the contract
const FetchContract = signerOrProvider =>
  new ethers.Contract(RealEstateAddress, RealEstateABI, signerOrProvider);

//Function to connect to the contract
export const ConnectToContract = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length === 0) {
      console.log("No authorized account found");
      return;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = FetchContract(signer);

    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
  }
};

//Function to convert time
export const ConvertTime = time => {
  const newTime = new Date(time.toNumber());
  const realTime =
    newTime.getHours() +
    "/" +
    newTime.getMinutes() +
    "/" +
    newTime.getSeconds() +
    " Date: " +
    newTime.getDate() +
    "/" +
    (newTime.getMonth() + 1) +
    "/" +
    newTime.getFullYear();

  return realTime;
};

// Function to help with logout (clear local state)
export const ClearWalletConnection = () => {
  try {
    // Clear any cached data in localStorage if your app uses it
    if (typeof window !== "undefined") {
      // Clear any stored wallet connection data
      localStorage.removeItem("walletconnect");
      localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
      localStorage.removeItem("web3-connect-modal");
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:DefaultActiveWallet"
      );
      localStorage.removeItem("ally-supports-cache");

      // Clear any other wallet-related localStorage items
      Object.keys(localStorage).forEach(key => {
        if (
          key.includes("wallet") ||
          key.includes("metamask") ||
          key.includes("web3") ||
          key.includes("ethereum") ||
          key.includes("connect")
        ) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage as well
      sessionStorage.clear();
    }

    console.log("Local wallet connection data cleared");
    return true;
  } catch (error) {
    console.error("Error clearing wallet connection:", error);
    return false;
  }
};

// Function to request account disconnect (note: this doesn't actually disconnect MetaMask)
export const RequestWalletDisconnect = async () => {
  try {
    // Note: There's no standard way to programmatically disconnect MetaMask
    // This is more of a local state reset
    console.log("Requesting wallet disconnect (local state reset)");

    // Clear local connection data
    ClearWalletConnection();

    // Try to revoke permissions (experimental - may not work in all cases)
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // This is experimental and may not work in all MetaMask versions
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
        console.log("Permissions revoked successfully");
      } catch (revokeError) {
        // This is expected to fail in most cases
        console.log(
          "Permission revocation not supported or failed:",
          revokeError.message
        );
      }
    }

    // Return success
    return true;
  } catch (error) {
    console.error("Error requesting wallet disconnect:", error);
    return false;
  }
};

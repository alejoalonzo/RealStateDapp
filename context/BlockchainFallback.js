// Fallback functions for when blockchain dependencies are not available
export const BlockchainFallback = {
  // Mock ethers functions
  ethers: {
    BrowserProvider: class MockBrowserProvider {
      constructor() {
        console.log("Mock BrowserProvider created");
      }
      async getSigner() {
        throw new Error("Blockchain not available");
      }
    },
    Contract: class MockContract {
      constructor() {
        console.log("Mock Contract created");
      }
    },
  },

  // Mock constants
  Constants: {
    RealEstateABI: [],
    RealEstateAddress: "0x0000000000000000000000000000000000000000",
    EscrowAddress: "0x0000000000000000000000000000000000000000",
    getUserRole: () => null,
    PREDEFINED_ACCOUNTS: [],
  },

  // Mock API features
  apiFeature: {
    GetCurrentAccount: async () => null,
    CheckIfWalletIsConnected: () => false,
    ConnectWallet: async () => {
      throw new Error("Blockchain not available");
    },
    ConnectToContract: async () => {
      throw new Error("Blockchain not available");
    },
    ClearWalletConnection: async () => {},
  },
};

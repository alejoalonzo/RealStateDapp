// Utility to safely check and load blockchain dependencies
export const loadBlockchainDependencies = () => {
  let dependencies = {
    ethers: null,
    Constants: null,
    apiFeature: null,
  };

  // Only try to load in browser environment
  if (typeof window !== "undefined") {
    try {
      // Dynamic import of ethers
      dependencies.ethers = require("ethers");
    } catch (error) {
      console.warn("Ethers.js not available:", error.message);
    }

    try {
      // Dynamic import of Constants
      dependencies.Constants = require("./Constants");
    } catch (error) {
      console.warn("Constants not available:", error.message);
    }

    try {
      // Dynamic import of API features
      dependencies.apiFeature = require("../Utils/apiFeature");
    } catch (error) {
      console.warn("API features not available:", error.message);
    }
  }

  return dependencies;
};

export const isBlockchainAvailable = dependencies => {
  return !!(
    dependencies.ethers &&
    dependencies.Constants &&
    dependencies.apiFeature &&
    typeof window !== "undefined"
  );
};

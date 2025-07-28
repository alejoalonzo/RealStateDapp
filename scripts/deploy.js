const hre = require("hardhat");

async function main() {
  // Get the contract factory we want to deploy
  const RealState = await hre.ethers.getContractFactory("RealState");

  // Deploy the contract
  const realState = await RealState.deploy();

  // Wait for the deployment to be confirmed (new syntax)
  await realState.waitForDeployment();

  console.log("RealState deployed to:", await realState.getAddress());
}

// Run the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

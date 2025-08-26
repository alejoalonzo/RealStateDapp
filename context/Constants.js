import RealEstateJSON from "./RealEstate.json";

export const RealEstateAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const RealEstateABI = RealEstateJSON.abi;

// Dirección del contrato Escrow (actualizada con el deploy actual)
export const EscrowAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

// Cuentas predefinidas (desde Hardhat)
export const PREDEFINED_ACCOUNTS = {
  // Estas son las direcciones típicas de Hardhat local
  seller: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Account #0
  buyer: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Account #1
  inspector: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Account #2
  lender: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Account #3
};

// Función para obtener el rol de una cuenta
export const getUserRole = address => {
  if (!address) return null;

  const normalizedAddress = address.toLowerCase();

  if (normalizedAddress === PREDEFINED_ACCOUNTS.seller.toLowerCase())
    return "seller";
  if (normalizedAddress === PREDEFINED_ACCOUNTS.buyer.toLowerCase())
    return "buyer";
  if (normalizedAddress === PREDEFINED_ACCOUNTS.inspector.toLowerCase())
    return "inspector";
  if (normalizedAddress === PREDEFINED_ACCOUNTS.lender.toLowerCase())
    return "lender";

  return "user"; // Usuario genérico
};

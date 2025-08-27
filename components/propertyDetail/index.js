// Componentes
export { default as PropertyImage } from "./components/PropertyImage";
export { default as PropertyHeader } from "./components/PropertyHeader";
export { default as PropertyDetails } from "./components/PropertyDetails";
export { default as PropertyActions } from "./components/PropertyActions";

// Hooks
export { usePropertyContract } from "./hooks/usePropertyContract";

// Servicios
export { PropertyContractService } from "./services/PropertyContractService";

// Componente principal refactorizado
export { default as PropertyDetailRefactored } from "./PropertyDetailRefactored";

// Componente original (para mantener compatibilidad)
export { default as PropertyDetail } from "./propertyDetail";
export { default } from "./propertyDetail";

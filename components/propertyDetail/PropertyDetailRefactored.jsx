"use client";

import React, { useContext } from "react";
import { IoClose } from "react-icons/io5";
import { RealEstateContext } from "@/context/RealEstateContext";
import { usePropertyContract } from "./hooks/usePropertyContract";
import PropertyImage from "./components/PropertyImage";
import PropertyHeader from "./components/PropertyHeader";
import PropertyDetails from "./components/PropertyDetails";
import PropertyActions from "./components/PropertyActions";
import Stepper from "@/components/stepper/stepper";

const PropertyDetailRefactored = ({ property, togglePop }) => {
  const { userRole } = useContext(RealEstateContext);
  const contractState = usePropertyContract(property);

  const { hasBought, hasInspected, hasLended, hasSold } = contractState;

  const handleContactAgent = () => {
    console.log('Contacting agent for property:', property.name);
    alert(`Contacting agent for ${property.name}`);
  };

  const handleActionComplete = () => {
    // Refrescar los datos del contrato después de una acción
    contractState.refetch();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: '#dee1e7' }}
      onClick={togglePop}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative">
          <button
            onClick={togglePop}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
          >
            <IoClose size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Layout condicional: stepper solo o layout completo */}
        {hasBought && userRole === 'buyer' ? (
          // Mostrar solo el stepper cuando el buyer ya compró
          <div className="flex flex-col h-full max-h-[90vh] justify-center">
            <div className="p-6 lg:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h2>
                <p className="text-gray-600">Transaction in Progress</p>
              </div>
              <Stepper 
                hasInspected={hasInspected}
                hasLended={hasLended}
                hasSold={hasSold}
                propertyName={property.name}
                handleContactAgent={handleContactAgent}
              />
            </div>
          </div>
        ) : (
          // Layout completo para otros casos
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Image Section */}
            <PropertyImage property={property} />

            {/* Content Section - Scrollable */}
            <div className="flex flex-col flex-1 min-h-0">
              <div 
                className="flex-1 overflow-y-auto p-6 lg:p-8" 
                style={{ 
                  maxHeight: 'calc(90vh - 180px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E0 #F7FAFC'
                }}
              >
                <div className="space-y-6">
                  {/* Property Header */}
                  <PropertyHeader property={property} />

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Property Details */}
                  <PropertyDetails property={property} />

                  {/* Status Messages */}
                  {!contractState.contractsAvailable && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-700">
                        <span className="font-medium">Demo Mode:</span> Smart contracts not connected. Property details are for display only.
                      </p>
                    </div>
                  )}

                  {!contractState.account && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Note:</span> Connect your wallet to purchase this property
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="flex-shrink-0 p-6 lg:p-8 border-t bg-white rounded-b-2xl">
                <PropertyActions 
                  property={property}
                  contractState={contractState}
                  onActionComplete={handleActionComplete}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailRefactored;

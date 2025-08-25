"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { IoClose, IoBed, IoLocation, IoHome, IoCalendar, IoWallet, IoMail } from "react-icons/io5";
import { RealEstateContext } from "@/context/RealEstateContext";
import { formatCryptoPrice } from "@/Utils/cryptoUtils";

const PropertyDetail = ({ property, togglePop }) => {
  const [imageError, setImageError] = useState(false);
  const { account, connectWallet } = useContext(RealEstateContext);

  // Extract data from attributes
  const getAttribute = (traitType) => {
    const attr = property.attributes?.find(attr => attr.trait_type === traitType);
    return attr ? attr.value : '';
  };

  const habitaciones = getAttribute('Bedrooms');
  const precio = getAttribute('Price');
  const ubicacion = getAttribute('Location');
  const yearBuilt = getAttribute('Year Built') || '2020';
  const propertyType = getAttribute('Property Type') || 'House';
  const squareFeet = getAttribute('Square Feet') || '2,500';

  // Formatear precio con crypto
  const formattedPrice = formatCryptoPrice(precio, 'ETH');

  const handleBuy = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Aquí implementarías la lógica de compra con smart contracts
    console.log('Buying property:', property.name);
    alert(`Initiating purchase for ${property.name}`);
  };

  const handleContactAgent = () => {
    // Aquí implementarías la lógica para contactar al agente
    console.log('Contacting agent for property:', property.name);
    alert(`Contacting agent for ${property.name}`);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: '#dee1e7' }}
        onClick={togglePop}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
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

          {/* Layout vertical: imagen arriba, contenido abajo */}
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Image Section */}
            <div className="relative h-48 md:h-56 lg:h-64 bg-gray-200 flex-shrink-0">
              {!imageError ? (
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="text-gray-600">Image not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section - Scrollable */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                {/* Property Info */}
                <div className="space-y-6">
                  {/* Title and Price */}
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {property.name}
                    </h2>
                    <div className="flex items-center space-x-2 mb-4">
                      <IoLocation size={18} className="text-gray-500" />
                      <span className="text-gray-600">{ubicacion}</span>
                    </div>
                    <div className="space-y-1 mb-4">
                      <div className="text-3xl font-bold text-green-600">
                        {formattedPrice.crypto}
                      </div>
                      <div className="text-lg text-gray-500">
                        {formattedPrice.usd}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Property Details Grid */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IoBed size={20} className="text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-500">Bedrooms</p>
                          <p className="font-semibold text-gray-900">{habitaciones}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IoHome size={20} className="text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-semibold text-gray-900">{propertyType}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IoCalendar size={20} className="text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-500">Year Built</p>
                          <p className="font-semibold text-gray-900">{yearBuilt}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Square Feet</p>
                          <p className="font-semibold text-gray-900">{squareFeet} sq ft</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Connection Note */}
                  {!account && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Note:</span> Connect your wallet to purchase this property
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="p-6 lg:p-8 border-t lg:border-t-0 bg-white">
                <div className="space-y-3">
                  <button
                    onClick={handleBuy}
                    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#232323] to-[#3c3a3a] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#3c3a3a] hover:to-[#232323] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <IoWallet size={20} />
                    <span>Buy Property</span>
                  </button>
                  
                  <button
                    onClick={handleContactAgent}
                    className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    <IoMail size={20} />
                    <span>Contact Agent</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;

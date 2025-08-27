"use client";

import React, { useState } from "react";
import Image from "next/image";
import PropertyDetail from "../propertyDetail/propertyDetail";
import { formatCryptoPrice } from "@/Utils/cryptoUtils";

const CardProperty = ({ property }) => {
  const [imageError, setImageError] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  
  // Extract data from attributes
  const getAttribute = (traitType) => {
    const attr = property.attributes?.find(attr => attr.trait_type === traitType);
    return attr ? attr.value : '';
  };

  const habitaciones = getAttribute('Bedrooms');
  const precio = getAttribute('Price');
  const ubicacion = getAttribute('Location');

  // Formatear precio con crypto
  const formattedPrice = formatCryptoPrice(precio, 'ETH');

  const togglePop = (property) => {
    console.log("Toggled property:", property);
    setShowPropertyDetail(!showPropertyDetail);
  }

  return (
    <div className="group relative bg-white rounded-lg md:rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 w-full max-w-full" style={{ aspectRatio: '1 / 0.8' }}>
      {/* Property image - fills entire card */}
      <div className="relative w-full h-full bg-gray-200 overflow-hidden">
        {!imageError ? (
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">🏠</div>
              <p className="text-gray-600 text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700 ease-in-out" />
        
        {/* Title overlay - moves from bottom-left to top-left on hover (desktop) / always top on mobile */}
        <div className="absolute top-6 left-6 right-20 md:bottom-6 md:right-16 md:group-hover:top-6 md:group-hover:bottom-auto md:group-hover:left-6 md:group-hover:right-20 transition-all duration-700 ease-in-out z-10 max-w-[calc(100%-96px)]">
          <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight leading-tight drop-shadow-lg transition-all duration-700 ease-in-out break-words">
            {property.name}
          </h3>
        </div>
        
        {/* Action button - always visible in top right */}
        <div className="absolute top-6 right-6 z-20">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 group flex-shrink-0 cursor-pointer" onClick={() => togglePop(property)}>
            <svg 
              className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </div>
        
        {/* Content - always visible on mobile, hover on desktop */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-0 md:transform md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-700 ease-in-out z-10 max-w-full">
          <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 max-w-full">
            {/* Description block - full width */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-xl mb-3 max-w-full">
              <p className="text-gray-700 text-sm overflow-hidden break-words" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {property.description}
              </p>
            </div>
            
            {/* Bottom row - small columns */}
            <div className="grid grid-cols-3 gap-2 max-w-full">
              {/* Price block */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-xl overflow-hidden">
                <div className="flex items-center">
                  <span className="font-bold text-black text-xs truncate">
                    {formattedPrice.crypto}
                  </span>
                </div>
              </div>
              
              {/* Bedrooms block */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-xl overflow-hidden">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium text-gray-800 text-xs truncate">{habitaciones} Bed</span>
                </div>
              </div>
              
              {/* Location block */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-xl overflow-hidden">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium text-gray-800 text-xs truncate">{ubicacion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Detail Modal */}
      {showPropertyDetail && (
        <PropertyDetail 
          property={property}
          togglePop={() => setShowPropertyDetail(false)}
        />
      )}
    </div>
  );
};

export default CardProperty;
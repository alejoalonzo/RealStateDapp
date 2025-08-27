"use client";

import React from "react";
import { IoLocation } from "react-icons/io5";
import { formatCryptoPrice } from "@/Utils/cryptoUtils";

const PropertyHeader = ({ property }) => {
  // Extract data from attributes
  const getAttribute = (traitType) => {
    const attr = property.attributes?.find(attr => attr.trait_type === traitType);
    return attr ? attr.value : '';
  };

  const precio = getAttribute('Price');
  const ubicacion = getAttribute('Location');

  // Formatear precio con crypto
  const formattedPrice = formatCryptoPrice(precio, 'ETH');

  return (
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
  );
};

export default PropertyHeader;

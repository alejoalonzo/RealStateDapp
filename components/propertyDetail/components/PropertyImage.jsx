"use client";

import React, { useState } from "react";
import Image from "next/image";

const PropertyImage = ({ property }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative h-48 md:h-56 lg:h-64 bg-gray-200 flex-shrink-0">
      {!imageError ? (
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
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
  );
};

export default PropertyImage;

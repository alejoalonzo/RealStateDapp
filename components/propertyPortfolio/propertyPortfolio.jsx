"use client";

import React from "react";
import CardProperty from "../cardProperty/cardProperty";

// Import metadata data temporarily
import property0 from "../../metadata/0.json";
import property1 from "../../metadata/1.json";
import property2 from "../../metadata/2.json";
import property3 from "../../metadata/3.json";
import property4 from "../../metadata/4.json";
import property5 from "../../metadata/5.json";

const PropertyPortfolio = () => {
  // Temporary array with properties
  const properties = [property0, property1, property2, property3, property4, property5];

  return (
    <section id="property-portfolio" className="py-16 md:pt-24 lg:pt-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Explore Our Property Portfolio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our exclusive selection of premium properties in the best locations
          </p>
        </div>

        {/* Property grid - 2 columns on desktop/laptop, 1 on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <CardProperty 
              key={index} 
              property={property} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyPortfolio;
"use client";

import React from "react";
import { IoBed, IoLocation, IoHome, IoCalendar } from "react-icons/io5";

const PropertyDetails = ({ property }) => {
  // Extract data from attributes
  const getAttribute = (traitType) => {
    const attr = property.attributes?.find(attr => attr.trait_type === traitType);
    return attr ? attr.value : '';
  };

  const habitaciones = getAttribute('Bedrooms');
  const banos = getAttribute('Bathrooms');
  const ubicacion = getAttribute('Location');
  const yearBuilt = getAttribute('Year Built') || '2020';
  const propertyType = getAttribute('Property Type') || 'House';
  const squareFeet = getAttribute('Square Feet') || '2,500';

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <IoBed size={20} className="text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Bedrooms</p>
            <p className="font-semibold text-gray-900">{habitaciones}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <p className="text-sm text-gray-500">Bathrooms</p>
            <p className="font-semibold text-gray-900">{banos}</p>
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

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <IoLocation size={20} className="text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Full Address</p>
            <p className="font-semibold text-gray-900 text-xs">{ubicacion}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

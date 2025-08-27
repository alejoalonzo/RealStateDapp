"use client";

import React from "react";
import { IoMail } from "react-icons/io5";

const Stepper = ({ 
  hasInspected, 
  hasLended, 
  hasSold, 
  propertyName,
  handleContactAgent 
}) => {
  const calculateProgress = () => {
    return Math.round(((hasInspected ? 1 : 0) + (hasLended ? 1 : 0) + (hasSold ? 1 : 0)) / 3 * 100);
  };

  return (
    <div className="space-y-4">
      {/* Header con estado - más compacto */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100/50 to-transparent rounded-full transform translate-x-4 -translate-y-4"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-green-800">Purchase Initiated</h3>
              <p className="text-xs text-green-600">Earnest deposit secured</p>
            </div>
          </div>
          <p className="text-green-700 text-xs leading-relaxed">
            You've successfully initiated the purchase. Waiting for other parties to complete their approvals.
          </p>
        </div>
      </div>

      {/* Progress tracker moderno - más compacto */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <h4 className="text-gray-900 font-semibold mb-3 flex items-center text-sm">
          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Transaction Progress
        </h4>
        
        {/* Contenedor para los steps - SIN scroll anidado */}
        <div className="space-y-3">
          {/* Inspector */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasInspected ? 'bg-green-500' : 'bg-gray-300'}`}>
                {hasInspected ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Property Inspection</div>
                <div className="text-xs text-gray-500">Professional evaluation</div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${hasInspected ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {hasInspected ? 'Done' : 'Pending'}
            </div>
          </div>

          {/* Lender */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasLended ? 'bg-green-500' : 'bg-gray-300'}`}>
                {hasLended ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Loan Approval</div>
                <div className="text-xs text-gray-500">Financing verification</div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${hasLended ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {hasLended ? 'Approved' : 'Pending'}
            </div>
          </div>

          {/* Seller */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasSold ? 'bg-green-500' : 'bg-gray-300'}`}>
                {hasSold ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Final Transfer</div>
                <div className="text-xs text-gray-500">Property ownership transfer</div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${hasSold ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {hasSold ? 'Completed' : 'Pending'}
            </div>
          </div>

          {/* Progress bar - más compacto - DENTRO del scroll */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleContactAgent}
        className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <IoMail size={20} />
        <span>Contact Agent</span>
      </button>
    </div>
  );
};

export default Stepper;
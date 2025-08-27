"use client";

import React, { useContext, useState } from "react";
import { IoWallet, IoMail } from "react-icons/io5";
import { RealEstateContext } from "@/context/RealEstateContext";
import { PropertyContractService } from "../services/PropertyContractService";
import Stepper from "@/components/stepper/stepper";

const PropertyActions = ({ 
  property, 
  contractState, 
  onActionComplete 
}) => {
  const { account, connectWallet, userRole, contracts } = useContext(RealEstateContext);
  const [loading, setLoading] = useState(false);

  const {
    contractsAvailable,
    owner,
    hasBought,
    hasInspected,
    hasLended,
    hasSold,
    formatAddress
  } = contractState;

  const handleContactAgent = () => {
    console.log('Contacting agent for property:', property.name);
    alert(`Contacting agent for ${property.name}`);
  };

  const executeContractAction = async (action, actionName) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const service = new PropertyContractService(contracts, account);
      await action(service);
      alert(`${actionName} completed successfully!`);
      onActionComplete?.();
    } catch (error) {
      console.error(`❌ Error during ${actionName.toLowerCase()}:`, error);
      alert(`Error during ${actionName.toLowerCase()}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = () => {
    executeContractAction(
      (service) => service.buyProperty(property.id),
      'Purchase'
    );
  };

  const handleApproveInspection = () => {
    executeContractAction(
      (service) => service.approveInspection(property.id),
      'Inspection approval'
    );
  };

  const handleApproveLend = () => {
    executeContractAction(
      (service) => service.approveLending(property.id),
      'Lending approval'
    );
  };

  const handleApproveSell = () => {
    executeContractAction(
      (service) => service.approveSale(property.id),
      'Sale approval'
    );
  };

  // Si no está conectado
  if (!account) {
    return (
      <button
        onClick={connectWallet}
        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#232323] to-[#3c3a3a] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#3c3a3a] hover:to-[#232323] transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <IoWallet size={20} />
        <span>Connect Wallet</span>
      </button>
    );
  }

  // Modo demo
  if (!contractsAvailable) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => alert('Demo mode: Smart contracts not connected. This would initiate a property purchase.')}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#232323] to-[#3c3a3a] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#3c3a3a] hover:to-[#232323] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <IoWallet size={20} />
          <span>Buy Property (Demo)</span>
        </button>
        
        <button
          onClick={handleContactAgent}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        >
          <IoMail size={20} />
          <span>Contact Agent</span>
        </button>
      </div>
    );
  }

  // Propiedad ya vendida
  if (owner) {
    return (
      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
        <p className="text-lg font-semibold text-green-800 mb-2">Property Owned</p>
        <p className="text-sm text-green-600">
          Owned by: {formatAddress(owner)}
        </p>
      </div>
    );
  }

  // Botones según el rol del usuario
  switch (userRole) {
    case 'inspector':
      return (
        <button
          onClick={handleApproveInspection}
          disabled={hasInspected || loading}
          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
            hasInspected 
              ? 'bg-green-500 text-white cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {loading ? 'Processing...' : hasInspected ? 'Inspection Approved' : 'Approve Inspection'}
          </span>
        </button>
      );

    case 'lender':
      return (
        <button
          onClick={handleApproveLend}
          disabled={hasLended || loading}
          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
            hasLended 
              ? 'bg-green-500 text-white cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <IoWallet size={20} />
          <span>
            {loading ? 'Processing...' : hasLended ? 'Lending Approved' : 'Approve and Lend'}
          </span>
        </button>
      );

    case 'seller':
      if (!hasInspected || !hasLended) {
        return (
          <div className="space-y-3">
            <button
              disabled={true}
              className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Waiting for Approvals</span>
            </button>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium mb-2">Pending Approvals Required:</p>
              <ul className="text-sm text-amber-700 space-y-1">
                {!hasInspected && <li>• Inspector approval pending</li>}
                {!hasLended && <li>• Lender approval pending</li>}
              </ul>
            </div>
          </div>
        );
      }

      return (
        <button
          onClick={handleApproveSell}
          disabled={hasSold || loading}
          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
            hasSold 
              ? 'bg-green-500 text-white cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span>
            {loading ? 'Processing...' : hasSold ? 'Sale Approved' : 'Approve and Sell'}
          </span>
        </button>
      );

    default:
      // Comprador
      if (hasBought) {
        return (
          <Stepper 
            hasInspected={hasInspected}
            hasLended={hasLended}
            hasSold={hasSold}
            propertyName={property.name}
            handleContactAgent={handleContactAgent}
          />
        );
      }

      return (
        <>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#232323] to-[#3c3a3a] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#3c3a3a] hover:to-[#232323] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <IoWallet size={20} />
            <span>{loading ? 'Processing...' : 'Buy Property'}</span>
          </button>
          
          <button
            onClick={handleContactAgent}
            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            <IoMail size={20} />
            <span>Contact Agent</span>
          </button>
        </>
      );
  }
};

export default PropertyActions;

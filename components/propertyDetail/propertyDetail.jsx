"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { IoClose, IoBed, IoLocation, IoHome, IoCalendar, IoWallet, IoMail } from "react-icons/io5";
import { RealEstateContext } from "@/context/RealEstateContext";
import { formatCryptoPrice } from "@/Utils/cryptoUtils";

const PropertyDetail = ({ property, togglePop }) => {
  const [imageError, setImageError] = useState(false);
  const { account, connectWallet, userRole, contracts } = useContext(RealEstateContext);

  const [ hasBought, setHasBought ] = useState(false);
  const [ hasLended, setHasLended ] = useState(false);
  const [ hasInspected, setHasInspected ] = useState(false);
  const [ hasSold, setHasSold ] = useState(false);

  const [ buyer, setBuyer ] = useState(null); 
  const [ lender, setLender ] = useState(null);
  const [ inspector, setInspector ] = useState(null);
  const [ seller, setSeller ] = useState(null);

  const [ owner, setOwner ] = useState(null);
  const [ contractsAvailable, setContractsAvailable ] = useState(false);

  // Helper para formatear direcciones
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchDetails = async () => {
    try {
      // Verificar que escrow existe y tiene las funciones necesarias
      if (!contracts.escrow || typeof contracts.escrow.buyer !== 'function') {
        console.warn('Escrow contract not available or missing methods');
        return;
      }

      const escrow = contracts.escrow;
      
      console.log('🔍 Fetching details for property ID:', property.id);
      console.log('📍 Escrow contract address:', await escrow.getAddress());

      // Verificar primero si la propiedad existe en el contrato RealEstate
      if (contracts.realEstate) {
        try {
          console.log('🔍 Checking if NFT exists...');
          // Intentar obtener el owner del NFT para verificar que existe
          const owner = await contracts.realEstate.ownerOf(property.id);
          console.log('👑 NFT owner:', owner);
        } catch (error) {
          console.error('❌ NFT does not exist with ID:', property.id);
          console.log('💡 Available property IDs should be: 0, 1, 2, 3, 4, 5 (NFTs start from 0)');
          return;
        }
      }

      // Verificar si la propiedad está listada con manejo de errores mejorado
      try {
        console.log('🔍 Checking if property is listed...');
        const isListedResult = await escrow.isListed(property.id);
        console.log('📋 Property', property.id, 'is listed:', isListedResult);
        
        if (!isListedResult) {
          console.log('⚠️ Property is not listed in escrow contract');
          console.log('💡 This property exists but is not currently for sale');
          return;
        }
      } catch (error) {
        console.error('❌ Error checking if property is listed:', error);
        console.log('🔍 This might mean the property ID does not exist in the contract');
        console.log('💡 Make sure the property ID corresponds to a minted NFT');
        return;
      }

      //buyer
      console.log('👤 Fetching buyer for property:', property.id);
      const buyer = await escrow.buyer(property.id);
      setBuyer(buyer);
      console.log('👤 Buyer:', buyer);
      
      const hasBought = await escrow.approval(property.id, buyer);
      setHasBought(hasBought);
      console.log('✅ Has bought:', hasBought);

      // Seller
      console.log('🏪 Fetching seller...');
      const seller = await escrow.seller();
      setSeller(seller);
      console.log('🏪 Seller:', seller);
      
      const hasSold = await escrow.approval(property.id, seller);
      setHasSold(hasSold);
      console.log('✅ Has sold:', hasSold);

      //lender
      console.log('🏦 Fetching lender...');
      const lender = await escrow.lender();
      setLender(lender);
      console.log('🏦 Lender:', lender);
      
      const hasLended = await escrow.approval(property.id, lender);
      setHasLended(hasLended);
      console.log('✅ Has lended:', hasLended);

      // Inspector
      console.log('🔍 Fetching inspector...');
      const inspector = await escrow.inspector();
      setInspector(inspector);
      console.log('🔍 Inspector:', inspector);
      
      // Verificar tanto el approval como el status de inspección
      const hasInspected = await escrow.approval(property.id, inspector);
      const inspectionPassed = await escrow.inspectionIsPassed(property.id);
      console.log('🔍 Inspector approved transaction:', hasInspected);
      console.log('🔍 Inspection status passed:', inspectionPassed);
      
      // El inspector está completo solo si ambos son true
      const inspectorComplete = hasInspected && inspectionPassed;
      setHasInspected(inspectorComplete);
      console.log('✅ Inspector process complete:', inspectorComplete);
      
      console.log('✅ All details fetched successfully');
      
    } catch (error) {
      console.error('❌ Error fetching property details:', error);
    }
  }

  const fetchOwner = async () => {
    try {
      // Verificar que escrow existe y tiene las funciones necesarias
      if (!contracts.escrow || typeof contracts.escrow.isListed !== 'function') {
        console.warn('Escrow contract not available or missing isListed method');
        return;
      }

      const escrow = contracts.escrow;
      
      console.log('🏠 Checking ownership for property ID:', property.id);

      // Primero verificar si el NFT existe
      if (contracts.realEstate) {
        try {
          const nftOwner = await contracts.realEstate.ownerOf(property.id);
          console.log('👑 Current NFT owner:', nftOwner);
          
          // Si el owner no es el contrato Escrow, entonces ya tiene dueño
          const escrowAddress = await escrow.getAddress();
          if (nftOwner.toLowerCase() !== escrowAddress.toLowerCase()) {
            setOwner(nftOwner);
            console.log('👑 Property is owned by:', nftOwner);
            return;
          }
        } catch (error) {
          console.error('❌ Error checking NFT owner:', error);
          return;
        }
      }

      try {
        const isListedResult = await escrow.isListed(property.id);
        console.log('📋 Is listed:', isListedResult);
        
        if (isListedResult) {
          console.log('📋 Property is still listed, no owner yet');
          return;
        }
        
        // Si no está listado pero el NFT existe, obtener el buyer
        const owner = await escrow.buyer(property.id);
        setOwner(owner);
        console.log('👑 Property sold to:', owner);
      } catch (error) {
        console.error('❌ Error checking property status:', error);
        console.log('🔍 This might mean the property ID does not exist in the contract');
        console.log('💡 Available property IDs are likely: 0, 1, 2, 3, 4, 5');
      }
      
    } catch (error) {
      console.error('❌ Error fetching property owner:', error);
    }
  };

  useEffect(() => {
    // Verificar si los contratos están disponibles
    if (contracts.escrow && contracts.provider) {
      setContractsAvailable(true);
      // Solo ejecutar si tenemos el contrato escrow disponible
      if (property && property.id !== undefined) {
        fetchDetails();
        fetchOwner();
      }
    } else {
      setContractsAvailable(false);
      console.log('Smart contracts not available - running in demo mode');
    }
  }, [hasSold, contracts, property]);

  // Extract data from attributes
  const getAttribute = (traitType) => {
    const attr = property.attributes?.find(attr => attr.trait_type === traitType);
    return attr ? attr.value : '';
  };

  const habitaciones = getAttribute('Bedrooms');
  const banos = getAttribute('Bathrooms');
  const precio = getAttribute('Price');
  const ubicacion = getAttribute('Location');
  const yearBuilt = getAttribute('Year Built') || '2020';
  const propertyType = getAttribute('Property Type') || 'House';
  const squareFeet = getAttribute('Square Feet') || '2,500';

  // Formatear precio con crypto
  const formattedPrice = formatCryptoPrice(precio, 'ETH');

  // Determinar el rol del usuario actual (ahora viene del contexto)
  // const getUserRole = () => {
  //   if (!account) return null;
  //   if (account === owner) return 'owner';
  //   if (account === inspector) return 'inspector';
  //   if (account === lender) return 'lender';
  //   if (account === seller) return 'seller';
  //   return 'buyer'; // Por defecto es comprador
  // };

  // const userRole = getUserRole(); // Comentado porque ahora viene del contexto

  const handleBuy = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    // Validar que los contratos estén disponibles
    if (!contracts.escrow || !contracts.provider) {
      alert('Smart contracts not available. Please make sure you are connected to the correct network.');
      return;
    }

    // Validar que property.id existe
    if (property.id === undefined || property.id === null) {
      alert('Property ID not found');
      return;
    }

    try {
      console.log('💰 Starting purchase for property ID:', property.id);
      console.log('👤 Buyer account:', account);
      
      // Verificar primero si el NFT existe
      if (contracts.realEstate) {
        try {
          await contracts.realEstate.ownerOf(property.id);
        } catch (error) {
          alert('This property does not exist. Please check the property ID.');
          return;
        }
      }
      
      // Verificar si la propiedad está listada
      const isListed = await contracts.escrow.isListed(property.id);
      console.log('📋 Property is listed:', isListed);
      
      if (!isListed) {
        alert('This property is not available for purchase');
        return;
      }
      
      // Verificar que somos el buyer designado
      const designatedBuyer = await contracts.escrow.buyer(property.id);
      console.log('👤 Designated buyer:', designatedBuyer);
      console.log('👤 Current account:', account);
      
      if (designatedBuyer.toLowerCase() !== account.toLowerCase()) {
        alert('You are not the designated buyer for this property');
        return;
      }
      
      // Obtener el monto de escrow
      const escrowAmount = await contracts.escrow.escrowAmount(property.id);
      console.log('💰 Escrow amount:', ethers.formatEther(escrowAmount), 'ETH');
      
      // Verificar balance antes de la transacción
      const balanceBefore = await contracts.provider.getBalance(account);
      console.log('💳 Balance before transaction:', ethers.formatEther(balanceBefore), 'ETH');
      
      const signer = await contracts.provider.getSigner();

      //buyer deposit earnest
      console.log('💰 Depositing earnest...');
      let transactions = await contracts.escrow.connect(signer).depositEarnest(property.id, { value: escrowAmount });
      await transactions.wait();
      console.log('✅ Earnest deposited');

      // Verificar balance después del depósito
      const balanceAfterDeposit = await contracts.provider.getBalance(account);
      console.log('💳 Balance after deposit:', ethers.formatEther(balanceAfterDeposit), 'ETH');

      //buyer approve purchase  
      console.log('✅ Approving purchase...');
      transactions = await contracts.escrow.connect(signer).approveTransaction(property.id);
      await transactions.wait();
      console.log('✅ Purchase approved');

      // Balance final
      const balanceAfter = await contracts.provider.getBalance(account);
      console.log('💳 Final balance:', ethers.formatEther(balanceAfter), 'ETH');
      
      const totalSpent = balanceBefore - balanceAfter;
      console.log('💸 Total spent (including gas):', ethers.formatEther(totalSpent), 'ETH');

      setHasBought(true);
      
      console.log('🎉 Purchase completed successfully!');
      // Remover el alert y solo hacer console.log para mejor UX
      console.log(`Purchase initiated successfully for ${property.name}! Waiting for other parties to approve.`);
      
    } catch (error) {
      console.error('❌ Error during purchase:', error);
      alert(`Error during purchase: ${error.message}`);
    }
  };

  const handleApproveInspection = async () => {
    try {
      // Validar que los contratos estén disponibles
      if (!contracts.escrow || !contracts.provider) {
        alert('Smart contracts not available');
        return;
      }

      console.log('🔍 Approving inspection for property ID:', property.id);
      
      const signer = await contracts.provider.getSigner();
      
      // PASO 1: Marcar que la inspección pasó
      console.log('🔍 Setting inspection status to passed...');
      let transaction = await contracts.escrow.connect(signer).updateInspectionStatus(property.id, true);
      await transaction.wait();
      console.log('✅ Inspection status updated to passed');

      // PASO 2: Aprobar la transacción como inspector
      console.log('🔍 Approving transaction as inspector...');
      transaction = await contracts.escrow.connect(signer).approveTransaction(property.id);
      await transaction.wait();
      console.log('✅ Transaction approved by inspector');

      setHasInspected(true);

      console.log('🎉 Inspection completed successfully for property:', property.name);
      console.log('✅ Inspection approved and transaction signed by inspector!');
    } catch (error) {
      console.error('❌ Error approving inspection:', error);
      alert(`Error approving inspection: ${error.message}`);
    }
  };

  const handleApproveLend = async () => {
    try {
      // Validar que los contratos estén disponibles
      if (!contracts.escrow || !contracts.provider) {
        alert('Smart contracts not available');
        return;
      }

      console.log('Approving lending for property ID:', property.id);
      
      // Lógica para aprobar y prestar
      const signer = await contracts.provider.getSigner();
      
      // Primero aprobar la transacción
      const transactions = await contracts.escrow.connect(signer).approveTransaction(property.id);
      await transactions.wait();

      //lender send funds to contract
      const purchasePrice = await contracts.escrow.purchasePrice(property.id);
      const escrowAmount = await contracts.escrow.escrowAmount(property.id);
      const lendAmount = purchasePrice - escrowAmount;
      
      console.log('Sending funds to contract:', lendAmount.toString());
      
      const escrowAddress = await contracts.escrow.getAddress();
      await signer.sendTransaction({
        to: escrowAddress,
        value: lendAmount.toString(),
        gasLimit: 60000
      });

      setHasLended(true);

      console.log('Approving and lending for property:', property.name);
      alert('Lending approved successfully!');
    } catch (error) {
      console.error('Error approving lending:', error);
      alert(`Error approving lending: ${error.message}`);
    }
  };

  const handleApproveSell = async () => {
    try {
      // Validar que los contratos estén disponibles
      if (!contracts.escrow || !contracts.provider) {
        alert('Smart contracts not available');
        return;
      }

      console.log('Approving sale for property ID:', property.id);
      
      // Lógica para aprobar y vender
      const signer = await contracts.provider.getSigner();
      
      // Aprobar la transacción como seller
      const transactions = await contracts.escrow.connect(signer).approveTransaction(property.id);
      await transactions.wait();

      //seller finalize (esto solo funciona si todas las aprobaciones están completas)
      try {
        const finalizeTransaction = await contracts.escrow.connect(signer).finalizeSale(property.id);
        await finalizeTransaction.wait();
        console.log('Sale finalized successfully');
      } catch (finalizeError) {
        console.log('Cannot finalize yet - waiting for other approvals');
      }

      setHasSold(true);

      console.log('Approving sale for property:', property.name);
      alert('Sale approved successfully!');
    } catch (error) {
      console.error('Error approving sale:', error);
      alert(`Error approving sale: ${error.message}`);
    }
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

                  {/* Debug info (solo en desarrollo) */}
                  {process.env.NODE_ENV === 'development' && false && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug Info:</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Property ID: {property.id}</div>
                        <div>Property Name: {property.name}</div>
                        <div>Contracts Available: {contractsAvailable ? '✅' : '❌'}</div>
                        <div>Account: {account ? formatAddress(account) : 'Not connected'}</div>
                        <div>User Role: {userRole || 'None'}</div>
                        {buyer && <div>Designated Buyer: {formatAddress(buyer)}</div>}
                        {seller && <div>Contract Seller: {formatAddress(seller)}</div>}
                        {inspector && <div>Inspector: {formatAddress(inspector)}</div>}
                        {lender && <div>Lender: {formatAddress(lender)}</div>}
                        <div className="mt-2 space-y-1">
                          <div className="text-blue-600">Contract Status:</div>
                          <div>Has Bought: {hasBought ? '✅' : '❌'}</div>
                          <div>Has Inspected: {hasInspected ? '✅' : '❌'}</div>
                          <div>Has Lended: {hasLended ? '✅' : '❌'}</div>
                          <div>Has Sold: {hasSold ? '✅' : '❌'}</div>
                        </div>
                        <div className="text-amber-600 mt-2">
                          💡 Valid property IDs: 0, 1, 2, 3, 4, 5 (6 NFTs minted, IDs start from 0)
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Smart Contract Status */}
                  {!contractsAvailable && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-700">
                        <span className="font-medium">Demo Mode:</span> Smart contracts not connected. Property details are for display only.
                      </p>
                    </div>
                  )}

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
              <div className="flex-shrink-0 p-6 lg:p-8 border-t bg-white rounded-b-2xl">
                <div className="space-y-3">
                  {/* Botones dinámicos según el rol del usuario */}
                  {!account ? (
                    // Usuario no conectado
                    <button
                      onClick={connectWallet}
                      className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#232323] to-[#3c3a3a] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#3c3a3a] hover:to-[#232323] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <IoWallet size={20} />
                      <span>Connect Wallet</span>
                    </button>
                  ) : !contractsAvailable ? (
                    // Modo demo - contratos no disponibles
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
                  ) : owner ? (
                    // Propiedad ya tiene dueño
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-lg font-semibold text-green-800 mb-2">Property Owned</p>
                      <p className="text-sm text-green-600">
                        Owned by: {formatAddress(owner)}
                      </p>
                    </div>
                  ) : (
                    // Propiedad disponible - mostrar botones según rol
                    <>
                      {userRole === 'inspector' ? (
                        <button
                          onClick={handleApproveInspection}
                          disabled={hasInspected}
                          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                            hasInspected 
                              ? 'bg-green-500 text-white cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{hasInspected ? 'Inspection Approved' : 'Approve Inspection'}</span>
                        </button>
                      ) : userRole === 'lender' ? (
                        <button
                          onClick={handleApproveLend}
                          disabled={hasLended}
                          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                            hasLended 
                              ? 'bg-green-500 text-white cursor-not-allowed' 
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          <IoWallet size={20} />
                          <span>{hasLended ? 'Lending Approved' : 'Approve and Lend'}</span>
                        </button>
                      ) : userRole === 'seller' ? (
                        <button
                          onClick={handleApproveSell}
                          disabled={hasSold}
                          className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                            hasSold 
                              ? 'bg-green-500 text-white cursor-not-allowed' 
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span>{hasSold ? 'Sale Approved' : 'Approve and Sell'}</span>
                        </button>
                      ) : (
                        // Comprador por defecto
                        <>
                          {hasBought ? (
                            // Ya compró - mostrar estado de espera
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
                                      <span>{Math.round(((hasInspected ? 1 : 0) + (hasLended ? 1 : 0) + (hasSold ? 1 : 0)) / 3 * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${((hasInspected ? 1 : 0) + (hasLended ? 1 : 0) + (hasSold ? 1 : 0)) / 3 * 100}%` }}
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
                          ) : (
                            // No ha comprado aún
                            <>
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
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
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

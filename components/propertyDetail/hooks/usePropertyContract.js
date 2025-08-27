"use client";

import { useState, useEffect, useContext } from "react";
import { RealEstateContext } from "@/context/RealEstateContext";

export const usePropertyContract = property => {
  const { account, contracts } = useContext(RealEstateContext);

  const [contractState, setContractState] = useState({
    hasBought: false,
    hasLended: false,
    hasInspected: false,
    hasSold: false,
    buyer: null,
    lender: null,
    inspector: null,
    seller: null,
    owner: null,
    contractsAvailable: false,
    loading: true,
  });

  // Helper para formatear direcciones
  const formatAddress = address => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchDetails = async () => {
    try {
      if (!contracts.escrow || typeof contracts.escrow.buyer !== "function") {
        console.warn("Escrow contract not available or missing methods");
        return;
      }

      const escrow = contracts.escrow;

      console.log("🔍 Fetching details for property ID:", property.id);

      // Verificar si la propiedad existe
      if (contracts.realEstate) {
        try {
          const owner = await contracts.realEstate.ownerOf(property.id);
          console.log("👑 NFT owner:", owner);
        } catch (error) {
          console.error("❌ NFT does not exist with ID:", property.id);
          return;
        }
      }

      // Verificar si está listada
      try {
        const isListedResult = await escrow.isListed(property.id);
        console.log("📋 Property", property.id, "is listed:", isListedResult);

        if (!isListedResult) {
          console.log("⚠️ Property is not listed in escrow contract");
          return;
        }
      } catch (error) {
        console.error("❌ Error checking if property is listed:", error);
        return;
      }

      // Obtener detalles del contrato
      const buyer = await escrow.buyer(property.id);
      const seller = await escrow.seller();
      const lender = await escrow.lender();
      const inspector = await escrow.inspector();

      const hasBought = await escrow.approval(property.id, buyer);
      const hasSold = await escrow.approval(property.id, seller);
      const hasLended = await escrow.approval(property.id, lender);
      const hasInspected = await escrow.approval(property.id, inspector);
      const inspectionPassed = await escrow.inspectionIsPassed(property.id);

      setContractState(prev => ({
        ...prev,
        buyer,
        seller,
        lender,
        inspector,
        hasBought,
        hasSold,
        hasLended,
        hasInspected: hasInspected && inspectionPassed,
        loading: false,
      }));

      console.log("✅ All details fetched successfully");
    } catch (error) {
      console.error("❌ Error fetching property details:", error);
      setContractState(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchOwner = async () => {
    try {
      if (
        !contracts.escrow ||
        typeof contracts.escrow.isListed !== "function"
      ) {
        console.warn("Escrow contract not available");
        return;
      }

      const escrow = contracts.escrow;

      if (contracts.realEstate) {
        try {
          const nftOwner = await contracts.realEstate.ownerOf(property.id);
          const escrowAddress = await escrow.getAddress();

          if (nftOwner.toLowerCase() !== escrowAddress.toLowerCase()) {
            setContractState(prev => ({ ...prev, owner: nftOwner }));
            return;
          }
        } catch (error) {
          console.error("❌ Error checking NFT owner:", error);
          return;
        }
      }

      try {
        const isListedResult = await escrow.isListed(property.id);

        if (!isListedResult) {
          const owner = await escrow.buyer(property.id);
          setContractState(prev => ({ ...prev, owner }));
        }
      } catch (error) {
        console.error("❌ Error checking property status:", error);
      }
    } catch (error) {
      console.error("❌ Error fetching property owner:", error);
    }
  };

  useEffect(() => {
    if (contracts.escrow && contracts.provider) {
      setContractState(prev => ({ ...prev, contractsAvailable: true }));

      if (property && property.id !== undefined) {
        fetchDetails();
        fetchOwner();
      }
    } else {
      setContractState(prev => ({
        ...prev,
        contractsAvailable: false,
        loading: false,
      }));
    }
  }, [contracts, property]);

  return {
    ...contractState,
    formatAddress,
    refetch: () => {
      if (property && property.id !== undefined) {
        fetchDetails();
        fetchOwner();
      }
    },
  };
};

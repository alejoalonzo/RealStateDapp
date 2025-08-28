"use client";

import { ethers } from "ethers";

export class PropertyContractService {
  constructor(contracts, account) {
    this.contracts = contracts;
    this.account = account;
  }

  async validateContract() {
    if (!this.contracts.escrow || !this.contracts.provider) {
      throw new Error("Smart contracts not available");
    }
  }

  async validateProperty(propertyId) {
    // Verificar que el NFT existe
    if (this.contracts.realEstate) {
      try {
        await this.contracts.realEstate.ownerOf(propertyId);
      } catch (error) {
        throw new Error("This property does not exist");
      }
    }

    // Verificar que está listada
    const isListed = await this.contracts.escrow.isListed(propertyId);
    if (!isListed) {
      throw new Error("This property is not available for purchase");
    }
  }

  async buyProperty(propertyId) {
    await this.validateContract();
    await this.validateProperty(propertyId);

    console.log("💰 Starting purchase for property ID:", propertyId);

    // Verificar que somos el buyer designado
    const designatedBuyer = await this.contracts.escrow.buyer(propertyId);
    if (designatedBuyer.toLowerCase() !== this.account.toLowerCase()) {
      throw new Error("You are not the designated buyer for this property");
    }

    // Obtener el monto de escrow
    const escrowAmount = await this.contracts.escrow.escrowAmount(propertyId);
    console.log("💰 Escrow amount:", ethers.formatEther(escrowAmount), "ETH");

    const signer = await this.contracts.provider.getSigner();

    // Depositar earnest
    console.log("💰 Depositing earnest...");
    let transaction = await this.contracts.escrow
      .connect(signer)
      .depositEarnest(propertyId, {
        value: escrowAmount,
      });
    await transaction.wait();

    // Aprobar compra
    console.log("✅ Approving purchase...");
    transaction = await this.contracts.escrow
      .connect(signer)
      .approveTransaction(propertyId);
    await transaction.wait();

    console.log(
      "✅ Earnest deposit + buyer approval done. Waiting for lender/inspector/seller."
    );
    return true;
  }

  async approveInspection(propertyId) {
    await this.validateContract();

    console.log("🔍 Approving inspection for property ID:", propertyId);

    const signer = await this.contracts.provider.getSigner();

    // Marcar que la inspección pasó
    console.log("🔍 Setting inspection status to passed...");
    let transaction = await this.contracts.escrow
      .connect(signer)
      .updateInspectionStatus(propertyId, true);
    await transaction.wait();

    // Aprobar la transacción como inspector
    console.log("🔍 Approving transaction as inspector...");
    transaction = await this.contracts.escrow
      .connect(signer)
      .approveTransaction(propertyId);
    await transaction.wait();

    console.log("🎉 Inspection completed successfully");
    return true;
  }

  async approveLending(propertyId) {
    await this.validateContract();

    console.log("🏦 Approving lending for property ID:", propertyId);

    const signer = await this.contracts.provider.getSigner();

    // Aprobar la transacción
    const transaction = await this.contracts.escrow
      .connect(signer)
      .approveTransaction(propertyId);
    await transaction.wait();

    // Enviar fondos al contrato
    const purchasePrice = await this.contracts.escrow.purchasePrice(propertyId);
    const escrowAmount = await this.contracts.escrow.escrowAmount(propertyId);
    const lendAmount = purchasePrice - escrowAmount;

    console.log(
      "💰 Sending funds to contract:",
      ethers.formatEther(lendAmount),
      "ETH"
    );

    const escrowAddress = await this.contracts.escrow.getAddress();
    await signer.sendTransaction({
      to: escrowAddress,
      value: lendAmount.toString(),
      gasLimit: 60000,
    });

    console.log("🎉 Lending approved successfully");
    return true;
  }

  async approveSale(propertyId) {
    await this.validateContract();

    console.log("🏪 Approving sale for property ID:", propertyId);

    const signer = await this.contracts.provider.getSigner();

    // Aprobar la transacción como seller
    const transaction = await this.contracts.escrow
      .connect(signer)
      .approveTransaction(propertyId);
    await transaction.wait();

    console.log("🎉 Sale approved successfully - ready for finalization");
    return true;
  }

  async finalizeSale(propertyId) {
    await this.validateContract();

    console.log("🏁 Finalizing sale for property ID:", propertyId);

    const signer = await this.contracts.provider.getSigner();

    // Finalizar la venta
    const transaction = await this.contracts.escrow
      .connect(signer)
      .finalizeSale(propertyId);
    await transaction.wait();

    console.log("🎉 Sale finalized successfully - NFT transferred to buyer!");
    return true;
  }
}

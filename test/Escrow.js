const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = n => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Escrow", function () {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;

  beforeEach(async () => {
    //SET UP ACCOUNT
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    //DEPLOY REALESTATE
    const RealEstate = await ethers.getContractFactory("RealEstate");
    // Deploy RealEstate contract with seller as deployer
    realEstate = await RealEstate.connect(seller).deploy();

    // 2. Espera a que la tx se confirme
    await realEstate.waitForDeployment();

    // 3. Obtén la dirección (dos maneras equivalentes)
    const addr = await realEstate.getAddress(); // preferido
    // const addr = realEstate.target;

    //MINT
    let transaction = await realEstate
      .connect(seller)
      .mint("https://example.com/metadata/1");
    await transaction.wait();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.target,
      seller.address,
      inspector.address,
      lender.address
    );

    //Approv property
    transaction = await realEstate.connect(seller).approve(escrow.target, 0);
    await transaction.wait();

    //list property
    transaction = await escrow
      .connect(seller)
      .list(0, buyer.address, tokens(10), tokens(5));
    await transaction.wait();
  });

  describe("Deployment", function () {
    it("Returns NFT address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.equal(realEstate.target);
    });

    it("Returns seller address", async () => {
      const result = await escrow.seller();
      expect(result).to.equal(seller.address);
    });

    it("Returns inspector address", async () => {
      const result = await escrow.inspector();
      expect(result).to.equal(inspector.address);
    });

    it("Returns lender address", async () => {
      const result = await escrow.lender();
      expect(result).to.equal(lender.address);
    });
  });

  describe("Listing", () => {
    it("Updated as listed", async () => {
      const result = await escrow.isListed(0);
      expect(result).to.be.true;
    });

    it("Updates ownership", async () => {
      expect(await realEstate.ownerOf(0)).to.be.equal(escrow.target);
    });
    it("Returns buyer", async () => {
      const result = await escrow.buyer(0);
      expect(result).to.equal(buyer.address);
    });

    it("Returns purchase price", async () => {
      const result = await escrow.purchasePrice(0);
      expect(result).to.equal(tokens(10));
    });

    it("Returns escrow amount", async () => {
      const result = await escrow.escrowAmount(0);
      expect(result).to.equal(tokens(5));
    });
  });

  describe("Deposits", () => {
    it("Updates contract balance", async () => {
      const transaction = await escrow.connect(buyer).depositEarnest(0, {
        value: tokens(5),
      });
      await transaction.wait();

      const result = await escrow.getBalance();
      expect(result).to.equal(tokens(5));
    });

    describe("Inspections", () => {
      it("Updates inspection status", async () => {
        const transaction = await escrow
          .connect(inspector)
          .updateInspectionStatus(0, true);
        await transaction.wait();

        const result = await escrow.inspectionIsPassed(0);
        expect(result).to.be.true;
      });
    });

    describe("Approvals", () => {
      it("Update approval status", async () => {
        let transaction = await escrow.connect(buyer).approveTransaction(0);
        await transaction.wait();

        transaction = await escrow.connect(seller).approveTransaction(0);
        await transaction.wait();

        transaction = await escrow.connect(lender).approveTransaction(0);
        await transaction.wait();

        expect(await escrow.approval(0, buyer.address)).to.be.true;
        expect(await escrow.approval(0, seller.address)).to.be.true;
        expect(await escrow.approval(0, lender.address)).to.be.true;
      });
    });

    describe("Sale", () => {
      beforeEach(async () => {
        // Approve the buyer
        let transaction = await escrow.connect(buyer).depositEarnest(0, {
          value: tokens(5),
        });
        await transaction.wait();

        // Approve the inspector
        transaction = await escrow
          .connect(inspector)
          .updateInspectionStatus(0, true);
        await transaction.wait();

        // Approve the buyer
        transaction = await escrow.connect(buyer).approveTransaction(0);
        await transaction.wait();

        // Approve the seller
        transaction = await escrow.connect(seller).approveTransaction(0);
        await transaction.wait();

        // Approve the lender
        transaction = await escrow.connect(lender).approveTransaction(0);
        await transaction.wait();

        await lender.sendTransaction({
          to: escrow.target,
          value: tokens(5), // Lender sends the purchase price
        });

        // Finalize the sale
        transaction = await escrow.connect(seller).finalizeSale(0);
        await transaction.wait();
      });

      it("Updates ownership", async () => {
        expect(await realEstate.ownerOf(0)).to.equal(buyer.address);
      });

      it("Updates balances", async () => {
        expect(await escrow.getBalance()).to.equal(0);
      });
    });

    describe("Cancellation", () => {
      it("Should allow seller to cancel sale", async () => {
        // Seller cancels the sale
        const transaction = await escrow.connect(seller).cancelSale(0);
        await transaction.wait();

        // Verify NFT is returned to seller
        expect(await realEstate.ownerOf(0)).to.equal(seller.address);

        // Verify listing is cancelled
        expect(await escrow.isListed(0)).to.be.false;

        // Verify mappings are reset
        expect(await escrow.purchasePrice(0)).to.equal(0);
        expect(await escrow.escrowAmount(0)).to.equal(0);
        expect(await escrow.buyer(0)).to.equal(
          "0x0000000000000000000000000000000000000000"
        );
        expect(await escrow.inspectionIsPassed(0)).to.be.false;
      });

      it("Should allow buyer to cancel sale", async () => {
        // First deposit earnest money
        let transaction = await escrow.connect(buyer).depositEarnest(0, {
          value: tokens(5),
        });
        await transaction.wait();

        // Verify balance before cancellation
        expect(await escrow.getBalance()).to.equal(tokens(5));

        // Buyer cancels the sale
        transaction = await escrow.connect(buyer).cancelSale(0);
        await transaction.wait();

        // Verify NFT is returned to seller
        expect(await realEstate.ownerOf(0)).to.equal(seller.address);

        // Verify escrow balance is 0 (refunded to buyer)
        expect(await escrow.getBalance()).to.equal(0);

        // Verify listing is cancelled
        expect(await escrow.isListed(0)).to.be.false;
      });

      it("Should not allow unauthorized person to cancel sale", async () => {
        // Try to cancel with inspector (unauthorized)
        await expect(
          escrow.connect(inspector).cancelSale(0)
        ).to.be.revertedWith("Only seller or buyer can cancel the sale");

        // Try to cancel with lender (unauthorized)
        await expect(escrow.connect(lender).cancelSale(0)).to.be.revertedWith(
          "Only seller or buyer can cancel the sale"
        );
      });

      it("Should not allow canceling unlisted NFT", async () => {
        // First cancel the listing
        let transaction = await escrow.connect(seller).cancelSale(0);
        await transaction.wait();

        // Try to cancel again (should fail)
        await expect(escrow.connect(seller).cancelSale(0)).to.be.revertedWith(
          "NFT is not listed"
        );
      });

      it("Should reset all approvals after cancellation", async () => {
        // Set some approvals first
        let transaction = await escrow.connect(buyer).approveTransaction(0);
        await transaction.wait();

        transaction = await escrow.connect(seller).approveTransaction(0);
        await transaction.wait();

        transaction = await escrow.connect(lender).approveTransaction(0);
        await transaction.wait();

        // Verify approvals are set
        expect(await escrow.approval(0, buyer.address)).to.be.true;
        expect(await escrow.approval(0, seller.address)).to.be.true;
        expect(await escrow.approval(0, lender.address)).to.be.true;

        // Cancel the sale
        transaction = await escrow.connect(seller).cancelSale(0);
        await transaction.wait();

        // Verify approvals are reset (note: we need to check with original buyer address)
        expect(await escrow.approval(0, buyer.address)).to.be.false;
        expect(await escrow.approval(0, seller.address)).to.be.false;
        expect(await escrow.approval(0, lender.address)).to.be.false;
      });
    });
  });

  describe("User Account Management", () => {
    describe("Create Account", () => {
      it("Should create a new user account with all required fields", async () => {
        const username = "Juan";
        const lastName = "Pérez";
        const email = "juan.perez@email.com";

        // Create account
        const transaction = await escrow
          .connect(buyer)
          .createAccount(username, lastName, email);
        await transaction.wait();

        // Verify user exists
        expect(await escrow.userExists(buyer.address)).to.be.true;

        // Verify user data
        expect(await escrow.getUserName(buyer.address)).to.equal(username);
        expect(await escrow.getUserLastName(buyer.address)).to.equal(lastName);
        expect(await escrow.getUserEmail(buyer.address)).to.equal(email);

        // Verify complete user info
        const userInfo = await escrow.getUserInfo(buyer.address);
        expect(userInfo[0]).to.equal(username);
        expect(userInfo[1]).to.equal(lastName);
        expect(userInfo[2]).to.equal(email);
      });

      it("Should emit UserCreated event when account is created", async () => {
        const username = "María";
        const lastName = "González";
        const email = "maria.gonzalez@email.com";

        // Expect the UserCreated event to be emitted
        await expect(
          escrow.connect(seller).createAccount(username, lastName, email)
        )
          .to.emit(escrow, "UserCreated")
          .withArgs(seller.address, username, lastName, email);
      });

      it("Should not allow creating account with empty username", async () => {
        await expect(
          escrow.connect(buyer).createAccount("", "Pérez", "juan@email.com")
        ).to.be.revertedWith("Username cannot be empty");
      });

      it("Should not allow creating account with empty last name", async () => {
        await expect(
          escrow.connect(buyer).createAccount("Juan", "", "juan@email.com")
        ).to.be.revertedWith("Last name cannot be empty");
      });

      it("Should not allow creating account with empty email", async () => {
        await expect(
          escrow.connect(buyer).createAccount("Juan", "Pérez", "")
        ).to.be.revertedWith("Email cannot be empty");
      });

      it("Should not allow duplicate accounts for same address", async () => {
        // Create first account
        await escrow
          .connect(buyer)
          .createAccount("Juan", "Pérez", "juan@email.com");

        // Try to create another account with same address
        await expect(
          escrow
            .connect(buyer)
            .createAccount("Pedro", "García", "pedro@email.com")
        ).to.be.revertedWith("User already exists");
      });

      it("Should allow multiple different addresses to create accounts", async () => {
        // Create account for buyer
        await escrow
          .connect(buyer)
          .createAccount("Juan", "Pérez", "juan@email.com");

        // Create account for inspector
        await escrow
          .connect(inspector)
          .createAccount("María", "González", "maria@email.com");

        // Verify both accounts exist
        expect(await escrow.userExists(buyer.address)).to.be.true;
        expect(await escrow.userExists(inspector.address)).to.be.true;

        // Verify account data
        expect(await escrow.getUserName(buyer.address)).to.equal("Juan");
        expect(await escrow.getUserName(inspector.address)).to.equal("María");
      });

      it("Should revert when trying to get info of non-existent user", async () => {
        await expect(escrow.getUserName(buyer.address)).to.be.revertedWith(
          "User does not exist"
        );

        await expect(escrow.getUserLastName(buyer.address)).to.be.revertedWith(
          "User does not exist"
        );

        await expect(escrow.getUserEmail(buyer.address)).to.be.revertedWith(
          "User does not exist"
        );

        await expect(escrow.getUserInfo(buyer.address)).to.be.revertedWith(
          "User does not exist"
        );
      });
    });
  });
});

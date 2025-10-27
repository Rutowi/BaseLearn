const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasicTypes Contract", function () {
  let BasicTypes;
  let basicTypes;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    BasicTypes = await ethers.getContractFactory("BasicTypes");
    basicTypes = await BasicTypes.deploy();
    await basicTypes.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await basicTypes.owner()).to.equal(owner.address);
    });
    
    it("Should initialize default values correctly", async function () {
      expect(await basicTypes.defaultUint()).to.equal(0);
      expect(await basicTypes.isComplete()).to.equal(false);
      expect(await basicTypes.largeNumber()).to.equal(1000000);
      expect(await basicTypes.NUMBER_OF_TEAMS()).to.equal(10);
    });
    
    it("Should set immutable values correctly", async function () {
      const creationTime = await basicTypes.contractCreationTime();
      expect(creationTime).to.be.gt(0);
    });
  });
  
  describe("Integer Operations", function () {
    it("Should update large number correctly", async function () {
      await basicTypes.updateLargeNumber(5000000);
      expect(await basicTypes.largeNumber()).to.equal(5000000);
    });
    
    it("Should reject zero or negative numbers", async function () {
      await expect(
        basicTypes.updateLargeNumber(0)
      ).to.be.revertedWith("Number must be positive");
    });
    
    it("Should compare numbers correctly", async function () {
      expect(await basicTypes.compareNumbers(10, 5)).to.equal("First number is larger");
      expect(await basicTypes.compareNumbers(5, 10)).to.equal("Second number is larger");
      expect(await basicTypes.compareNumbers(5, 5)).to.equal("Numbers are equal");
    });
    
    it("Should perform math operations correctly", async function () {
      const result = await basicTypes.mathOperations(10, 3);
      expect(result.sum).to.equal(13);
      expect(result.difference).to.equal(7);
      expect(result.product).to.equal(30);
      expect(result.quotient).to.equal(3);
      expect(result.remainder).to.equal(1);
    });
    
    it("Should prevent division by zero", async function () {
      await expect(
        basicTypes.mathOperations(10, 0)
      ).to.be.revertedWith("Division by zero");
    });
  });
  
  describe("Boolean Operations", function () {
    it("Should perform boolean operations correctly", async function () {
      const result = await basicTypes.booleanOperations(true, false);
      expect(result.andResult).to.equal(false);
      expect(result.orResult).to.equal(true);
      expect(result.notResult1).to.equal(false);
      expect(result.equalResult).to.equal(false);
    });
    
    it("Should handle all true case", async function () {
      const result = await basicTypes.booleanOperations(true, true);
      expect(result.andResult).to.equal(true);
      expect(result.orResult).to.equal(true);
      expect(result.notResult1).to.equal(false);
      expect(result.equalResult).to.equal(true);
    });
  });
  
  describe("Address Operations", function () {
    it("Should get address info correctly", async function () {
      const result = await basicTypes.getAddressInfo(owner.address);
      expect(result.balance).to.be.gt(0); // Owner has ETH
      expect(result.isContract).to.equal(false); // EOA, not contract
      expect(result.isZeroAddress).to.equal(false);
    });
    
    it("Should detect zero address", async function () {
      const result = await basicTypes.getAddressInfo(ethers.ZeroAddress);
      expect(result.balance).to.equal(0);
      expect(result.isContract).to.equal(false);
      expect(result.isZeroAddress).to.equal(true);
    });
    
    it("Should detect contract address", async function () {
      const contractAddress = await basicTypes.getAddress();
      const result = await basicTypes.getAddressInfo(contractAddress);
      expect(result.isContract).to.equal(true);
    });
  });
  
  describe("String Operations", function () {
    it("Should update contract name", async function () {
      await basicTypes.updateContractName("New Contract Name");
      expect(await basicTypes.contractName()).to.equal("New Contract Name");
    });
    
    it("Should reject empty string", async function () {
      await expect(
        basicTypes.updateContractName("")
      ).to.be.revertedWith("Name cannot be empty");
    });
    
    it("Should concatenate strings correctly", async function () {
      const result = await basicTypes.concatenateStrings("Hello", "World");
      expect(result).to.equal("Hello World");
    });
    
    it("Should hash strings correctly", async function () {
      const hash1 = await basicTypes.hashString("test");
      const hash2 = await basicTypes.hashString("test");
      const hash3 = await basicTypes.hashString("different");
      
      expect(hash1).to.equal(hash2); // Same input = same hash
      expect(hash1).to.not.equal(hash3); // Different input = different hash
    });
  });
  
  describe("Enum Operations", function () {
    it("Should change status correctly", async function () {
      // Status: Pending=0, Active=1, Completed=2, Cancelled=3
      expect(await basicTypes.currentStatus()).to.equal(0); // Pending
      
      await basicTypes.changeStatus(1); // Active
      expect(await basicTypes.currentStatus()).to.equal(1);
      
      await basicTypes.changeStatus(2); // Completed
      expect(await basicTypes.currentStatus()).to.equal(2);
    });
    
    it("Should convert enum to number", async function () {
      await basicTypes.changeStatus(2); // Completed
      expect(await basicTypes.getStatusAsNumber()).to.equal(2);
    });
    
    it("Should emit event on status change", async function () {
      await expect(basicTypes.changeStatus(1))
        .to.emit(basicTypes, "StatusChanged")
        .withArgs(0, 1); // From Pending(0) to Active(1)
    });
    
    it("Should choose flavor correctly", async function () {
      // Flavors: Vanilla=0, Chocolate=1, Strawberry=2, Coffee=3
      expect(await basicTypes.chosenFlavor()).to.equal(3); // Default Coffee
      
      await basicTypes.chooseFlavor(0); // Vanilla
      expect(await basicTypes.chosenFlavor()).to.equal(0);
    });
  });
  
  describe("Type Casting", function () {
    it("Should cast types correctly", async function () {
      const result = await basicTypes.typeCasting(1000);
      expect(result.smallCasted).to.equal(232); // 1000 % 256 = 232 (overflow)
      expect(result.signedCasted).to.equal(1000);
    });
    
    it("Should show type limits", async function () {
      const limits = await basicTypes.getTypeLimits();
      expect(limits.maxUint8).to.equal(255);
      expect(limits.minUint256).to.equal(0);
      expect(limits.maxUint256).to.be.gt(0);
    });
  });
  
  describe("ETH and Payable Functions", function () {
    it("Should accept ETH deposits", async function () {
      const depositAmount = ethers.parseEther("1");
      
      await basicTypes.deposit({ value: depositAmount });
      
      const balance = await basicTypes.getContractBalance();
      expect(balance).to.equal(depositAmount);
    });
    
    it("Should reject zero ETH deposits", async function () {
      await expect(
        basicTypes.deposit({ value: 0 })
      ).to.be.revertedWith("Must send ETH");
    });
  });
  
  describe("Access Control", function () {
    it("Should allow owner to transfer ownership", async function () {
      await basicTypes.transferOwnership(addr1.address);
      expect(await basicTypes.owner()).to.equal(addr1.address);
    });
    
    it("Should reject zero address as new owner", async function () {
      await expect(
        basicTypes.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("New owner cannot be zero address");
    });
    
    it("Should reject non-owner trying to transfer", async function () {
      await expect(
        basicTypes.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
    
    it("Should allow owner to emergency withdraw", async function () {
      // Deposit some ETH first
      await basicTypes.deposit({ value: ethers.parseEther("1") });
      
      // Check initial balances
      const initialTreasuryBalance = await ethers.provider.getBalance(owner.address);
      
      // Emergency withdraw
      const tx = await basicTypes.emergencyWithdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * tx.gasPrice;
      
      // Check final balances
      const finalTreasuryBalance = await ethers.provider.getBalance(owner.address);
      const contractBalance = await basicTypes.getContractBalance();
      
      expect(contractBalance).to.equal(0);
      // Treasury should have received the ETH minus gas costs
      expect(finalTreasuryBalance).to.be.closeTo(
        initialTreasuryBalance + ethers.parseEther("1") - gasUsed,
        ethers.parseEther("0.01") // Allow small variance for gas estimation
      );
    });
  });
  
  describe("Events", function () {
    it("Should emit NumberUpdated event", async function () {
      await expect(basicTypes.updateLargeNumber(999999))
        .to.emit(basicTypes, "NumberUpdated")
        .withArgs(999999, owner.address);
    });
    
    it("Should emit FlavorChosen event", async function () {
      await expect(basicTypes.chooseFlavor(1))
        .to.emit(basicTypes, "FlavorChosen")
        .withArgs(1, owner.address);
    });
  });
});
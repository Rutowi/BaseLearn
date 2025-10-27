const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DataStorage Contract", function () {
  let DataStorage;
  let dataStorage;
  let owner;
  let addr1;
  let addr2;
  
  const TEST_NAME = "Base Learn";
  const TEST_AGE = 25;
  const TEST_CARS = 2;
  const TEST_BALANCE = 1000;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    DataStorage = await ethers.getContractFactory("DataStorage");
    dataStorage = await DataStorage.deploy(
      TEST_NAME,
      TEST_AGE,
      TEST_CARS,
      TEST_BALANCE
    );
    await dataStorage.waitForDeployment();
  });
  
  describe("Deployment and Initialization", function () {
    it("Should set constructor parameters correctly", async function () {
      expect(await dataStorage.name()).to.equal(TEST_NAME);
      expect(await dataStorage.age()).to.equal(TEST_AGE);
      expect(await dataStorage.cars()).to.equal(TEST_CARS);
      expect(await dataStorage.owner()).to.equal(owner.address);
      expect(await dataStorage.isActive()).to.equal(true);
    });
    
    it("Should set immutable values correctly", async function () {
      expect(await dataStorage.deployer()).to.equal(owner.address);
      expect(await dataStorage.deploymentTime()).to.be.gt(0);
    });
    
    it("Should initialize packed variables in correct slots", async function () {
      // Slot 1 packed variables
      expect(await dataStorage.score()).to.equal(100);
      expect(await dataStorage.balance()).to.equal(TEST_BALANCE);
      expect(await dataStorage.timestamp()).to.be.gt(0);
      expect(await dataStorage.id()).to.be.gt(0);
    });
    
    it("Should initialize other storage variables", async function () {
      expect(await dataStorage.largeNumber()).to.equal("999999999999999999999");
      expect(await dataStorage.MAX_SUPPLY()).to.equal(1000000);
    });
  });
  
  describe("Storage Operations", function () {
    it("Should increment age correctly", async function () {
      const initialAge = await dataStorage.age();
      
      await expect(dataStorage.incrementAge())
        .to.emit(dataStorage, "StorageUpdated")
        .withArgs("age", initialAge, Number(initialAge) + 1);
        
      expect(await dataStorage.age()).to.equal(Number(initialAge) + 1);
    });
    
    it("Should set age with admin function", async function () {
      const newAge = 30;
      
      await expect(dataStorage.adminSetAge(newAge))
        .to.emit(dataStorage, "StorageUpdated")
        .withArgs("age", TEST_AGE, newAge);
        
      expect(await dataStorage.age()).to.equal(newAge);
    });
    
    it("Should reject invalid age ranges", async function () {
      await expect(dataStorage.adminSetAge(0))
        .to.be.revertedWith("Invalid age range");
        
      await expect(dataStorage.adminSetAge(151))
        .to.be.revertedWith("Invalid age range");
    });
    
    it("Should update cars count", async function () {
      const newCars = 5;
      
      await expect(dataStorage.updateCars(newCars))
        .to.emit(dataStorage, "StorageUpdated")
        .withArgs("cars", TEST_CARS, newCars);
        
      expect(await dataStorage.cars()).to.equal(newCars);
    });
    
    it("Should update multiple packed variables efficiently", async function () {
      const newAge = 28;
      const newCars = 3;
      const newActive = false;
      
      await dataStorage.updatePackedVariables(newAge, newCars, newActive);
      
      expect(await dataStorage.age()).to.equal(newAge);
      expect(await dataStorage.cars()).to.equal(newCars);
      expect(await dataStorage.isActive()).to.equal(newActive);
    });
    
    it("Should update large number", async function () {
      const newLargeNumber = ethers.parseEther("1");
      
      await expect(dataStorage.updateLargeNumber(newLargeNumber))
        .to.emit(dataStorage, "StorageUpdated");
        
      expect(await dataStorage.largeNumber()).to.equal(newLargeNumber);
    });
  });
  
  describe("Memory vs Storage Operations", function () {
    it("Should process numbers in memory correctly", async function () {
      const numbers = [10, 20, 30, 40];
      const expectedSum = 100;
      const expectedAverage = 25;
      
      const result = await dataStorage.processNumbersInMemory(numbers);
      expect(result.sum).to.equal(expectedSum);
      expect(result.average).to.equal(expectedAverage);
    });
    
    it("Should reject empty array in memory processing", async function () {
      await expect(dataStorage.processNumbersInMemory([]))
        .to.be.revertedWith("Array cannot be empty");
    });
    
    it("Should store numbers array in storage", async function () {
      const numbers = [1, 2, 3, 4, 5];
      
      await expect(dataStorage.storeNumbersArray(numbers))
        .to.emit(dataStorage, "ArrayUpdated");
        
      expect(await dataStorage.getNumbersLength()).to.equal(numbers.length);
      
      // Check individual elements
      for (let i = 0; i < numbers.length; i++) {
        expect(await dataStorage.numbers(i)).to.equal(numbers[i]);
      }
    });
    
    it("Should add and remove numbers from storage array", async function () {
      const testNumber = 42;
      
      // Add number
      await expect(dataStorage.addNumber(testNumber))
        .to.emit(dataStorage, "ArrayUpdated")
        .withArgs("push", 0, testNumber);
        
      expect(await dataStorage.getNumbersLength()).to.equal(1);
      expect(await dataStorage.numbers(0)).to.equal(testNumber);
      
      // Remove number
      await expect(dataStorage.removeLastNumber())
        .to.emit(dataStorage, "ArrayUpdated")
        .withArgs("pop", 0, testNumber);
        
      expect(await dataStorage.getNumbersLength()).to.equal(0);
    });
    
    it("Should reject removing from empty array", async function () {
      await expect(dataStorage.removeLastNumber())
        .to.be.revertedWith("Array is empty");
    });
    
    it("Should return all numbers as memory array", async function () {
      const numbers = [10, 20, 30];
      await dataStorage.storeNumbersArray(numbers);
      
      const result = await dataStorage.getAllNumbers();
      expect(result.length).to.equal(numbers.length);
      
      for (let i = 0; i < numbers.length; i++) {
        expect(result[i]).to.equal(numbers[i]);
      }
    });
  });
  
  describe("Mapping Operations", function () {
    it("Should set and get balances", async function () {
      const testBalance = 500;
      
      await expect(dataStorage.setBalance(addr1.address, testBalance))
        .to.emit(dataStorage, "MappingUpdated")
        .withArgs(addr1.address, 0, testBalance);
        
      expect(await dataStorage.balances(addr1.address)).to.equal(testBalance);
    });
    
    it("Should transfer balance between addresses", async function () {
      const initialBalance = 1000;
      const transferAmount = 300;
      
      // Set initial balance
      await dataStorage.setBalance(addr1.address, initialBalance);
      
      // Transfer
      await expect(dataStorage.transferBalance(addr1.address, addr2.address, transferAmount))
        .to.emit(dataStorage, "MappingUpdated");
        
      expect(await dataStorage.balances(addr1.address)).to.equal(initialBalance - transferAmount);
      expect(await dataStorage.balances(addr2.address)).to.equal(transferAmount);
    });
    
    it("Should reject transfer with insufficient balance", async function () {
      await dataStorage.setBalance(addr1.address, 100);
      
      await expect(dataStorage.transferBalance(addr1.address, addr2.address, 200))
        .to.be.revertedWith("Insufficient balance");
    });
    
    it("Should set and check permissions", async function () {
      const permissionId = 1;
      
      await dataStorage.setPermission(addr1.address, permissionId, true);
      expect(await dataStorage.hasPermission(addr1.address, permissionId)).to.equal(true);
      
      await dataStorage.setPermission(addr1.address, permissionId, false);
      expect(await dataStorage.hasPermission(addr1.address, permissionId)).to.equal(false);
    });
  });
  
  describe("Struct and Array Operations", function () {
    it("Should add person to array", async function () {
      const person = {
        firstName: "Alice",
        lastName: "Smith",
        age: 30,
        isVerified: true,
        wallet: addr1.address
      };
      
      await expect(dataStorage.addPerson(
        person.firstName,
        person.lastName,
        person.age,
        person.isVerified,
        person.wallet
      )).to.emit(dataStorage, "PersonAdded")
        .withArgs(0, person.firstName, person.lastName);
        
      expect(await dataStorage.getPeopleCount()).to.equal(1);
    });
    
    it("Should get person details correctly", async function () {
      const person = {
        firstName: "Bob",
        lastName: "Johnson", 
        age: 25,
        isVerified: false,
        wallet: addr2.address
      };
      
      await dataStorage.addPerson(
        person.firstName,
        person.lastName,
        person.age,
        person.isVerified,
        person.wallet
      );
      
      const retrievedPerson = await dataStorage.getPerson(0);
      expect(retrievedPerson.firstName).to.equal(person.firstName);
      expect(retrievedPerson.lastName).to.equal(person.lastName);
      expect(retrievedPerson.age).to.equal(person.age);
      expect(retrievedPerson.isVerified).to.equal(person.isVerified);
      expect(retrievedPerson.wallet).to.equal(person.wallet);
    });
    
    it("Should update person verification status", async function () {
      await dataStorage.addPerson("Charlie", "Brown", 35, false, addr1.address);
      
      await dataStorage.updatePersonVerification(0, true);
      
      const person = await dataStorage.getPerson(0);
      expect(person.isVerified).to.equal(true);
    });
    
    it("Should reject invalid person index", async function () {
      await expect(dataStorage.getPerson(0))
        .to.be.revertedWith("Index out of bounds");
        
      await expect(dataStorage.updatePersonVerification(0, true))
        .to.be.revertedWith("Index out of bounds");
    });
  });
  
  describe("Gas Optimization and Batch Operations", function () {
    it("Should batch set balances efficiently", async function () {
      const users = [addr1.address, addr2.address];
      const balances = [100, 200];
      
      await expect(dataStorage.batchSetBalances(users, balances))
        .to.emit(dataStorage, "MappingUpdated");
        
      expect(await dataStorage.balances(addr1.address)).to.equal(100);
      expect(await dataStorage.balances(addr2.address)).to.equal(200);
    });
    
    it("Should reject mismatched array lengths in batch", async function () {
      const users = [addr1.address];
      const balances = [100, 200];
      
      await expect(dataStorage.batchSetBalances(users, balances))
        .to.be.revertedWith("Arrays length mismatch");
    });
    
    it("Should get packed variables efficiently", async function () {
      const result = await dataStorage.getPackedVariables();
      
      expect(result._age).to.equal(TEST_AGE);
      expect(result._cars).to.equal(TEST_CARS);
      expect(result._isActive).to.equal(true);
      expect(result._owner).to.equal(owner.address);
    });
  });
  
  describe("Storage Analysis Functions", function () {
    it("Should return storage statistics", async function () {
      // Add some data first
      await dataStorage.addNumber(42);
      await dataStorage.addPerson("Test", "User", 25, true, addr1.address);
      
      const stats = await dataStorage.getStorageStats();
      
      expect(stats.numbersLength).to.equal(1);
      expect(stats.peopleCount).to.equal(1);
      expect(stats.contractDeploymentTime).to.be.gt(0);
      expect(stats.contractDeployer).to.equal(owner.address);
    });
    
    it("Should compare storage vs memory costs", async function () {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      
      const result = await dataStorage.compareStorageVsMemory(testArray);
      
      expect(result.storageGasCost).to.include("High");
      expect(result.memoryGasCost).to.include("Low");
    });
    
    it("Should get contract info", async function () {
      const info = await dataStorage.getContractInfo();
      
      expect(info.contractName).to.equal(TEST_NAME);
      expect(info.contractOwner).to.equal(owner.address);
      expect(info.contractActive).to.equal(true);
      expect(info.deployTime).to.be.gt(0);
    });
  });
  
  describe("Access Control", function () {
    it("Should reject non-owner function calls", async function () {
      await expect(dataStorage.connect(addr1).incrementAge())
        .to.be.revertedWith("Only owner can call this function");
        
      await expect(dataStorage.connect(addr1).addNumber(42))
        .to.be.revertedWith("Only owner can call this function");
    });
    
    it("Should allow owner to transfer ownership", async function () {
      await dataStorage.transferOwnership(addr1.address);
      expect(await dataStorage.owner()).to.equal(addr1.address);
    });
    
    it("Should reject zero address as new owner", async function () {
      await expect(dataStorage.transferOwnership(ethers.ZeroAddress))
        .to.be.revertedWith("Invalid address");
    });
  });
  
  describe("Emergency Functions", function () {
    it("Should clear all arrays", async function () {
      // Add some data first
      await dataStorage.addNumber(42);
      await dataStorage.addPerson("Test", "User", 25, true, addr1.address);
      
      // Verify data exists
      expect(await dataStorage.getNumbersLength()).to.equal(1);
      expect(await dataStorage.getPeopleCount()).to.equal(1);
      
      // Clear arrays
      await dataStorage.clearAllArrays();
      
      // Verify arrays are empty
      expect(await dataStorage.getNumbersLength()).to.equal(0);
      expect(await dataStorage.getPeopleCount()).to.equal(0);
    });
  });
  
  describe("Variable Packing Demonstration", function () {
    it("Should show inefficient packing in bad examples", async function () {
      // These should demonstrate poor packing
      expect(await dataStorage.badExample1()).to.equal(1);
      expect(await dataStorage.badExample2()).to.equal(123456789);
      expect(await dataStorage.badExample3()).to.equal(3);
    });
    
    it("Should verify constants don't use storage", async function () {
      // MAX_SUPPLY is a constant, stored in bytecode not storage
      expect(await dataStorage.MAX_SUPPLY()).to.equal(1000000);
    });
  });
});
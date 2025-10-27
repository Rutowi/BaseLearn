const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ControlStructures Contract", function () {
  let ControlStructures;
  let controlStructures;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    ControlStructures = await ethers.getContractFactory("ControlStructures");
    controlStructures = await ControlStructures.deploy();
    await controlStructures.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await controlStructures.owner()).to.equal(owner.address);
    });
    
    it("Should initialize contract as active", async function () {
      expect(await controlStructures.contractActive()).to.equal(true);
    });
    
    it("Should initialize counter to 0", async function () {
      expect(await controlStructures.counter()).to.equal(0);
    });
    
    it("Should authorize owner by default", async function () {
      expect(await controlStructures.authorizedUsers(owner.address)).to.equal(true);
    });
  });
  
  describe("Conditional Control Structures", function () {
    it("Should handle zero correctly", async function () {
      expect(await controlStructures.conditionalExample(0))
        .to.equal("The number is zero.");
    });
    
    it("Should identify even numbers", async function () {
      expect(await controlStructures.conditionalExample(4))
        .to.equal("The number is even and greater than zero.");
    });
    
    it("Should identify odd numbers", async function () {
      expect(await controlStructures.conditionalExample(3))
        .to.equal("The number is odd and is greater than zero.");
    });
    
    it("Should check driving eligibility correctly", async function () {
      expect(await controlStructures.checkDrivingEligibility(15, false))
        .to.equal("Too young to drive");
      
      expect(await controlStructures.checkDrivingEligibility(17, true))
        .to.equal("Can drive with restrictions");
      
      expect(await controlStructures.checkDrivingEligibility(20, true))
        .to.equal("Can drive without restrictions");
      
      expect(await controlStructures.checkDrivingEligibility(20, false))
        .to.equal("Needs license to drive");
    });
    
    it("Should calculate grades correctly", async function () {
      expect(await controlStructures.calculateGrade(95)).to.equal("A");
      expect(await controlStructures.calculateGrade(85)).to.equal("B");
      expect(await controlStructures.calculateGrade(75)).to.equal("C");
      expect(await controlStructures.calculateGrade(65)).to.equal("D");
      expect(await controlStructures.calculateGrade(55)).to.equal("F");
    });
    
    it("Should reject scores over 100", async function () {
      await expect(controlStructures.calculateGrade(101))
        .to.be.revertedWith("Score cannot exceed 100");
    });
  });
  
  describe("Iterative Control Structures", function () {
    it("Should calculate sum in for loop", async function () {
      const result = await controlStructures.forLoopDemo(5);
      // Sum of 0+1+2+3+4+5 = 15
      expect(result).to.equal(15);
    });
    
    it("Should reject too many iterations", async function () {
      await expect(controlStructures.forLoopDemo(101))
        .to.be.revertedWith("Too many iterations");
    });
    
    it("Should sum only even numbers with continue", async function () {
      const result = await controlStructures.forLoopWithContinue(5);
      // Sum of 0+2+4 = 6
      expect(result).to.equal(6);
    });
    
    it("Should break at 7", async function () {
      const result = await controlStructures.forLoopWithBreak(10);
      // Sum of 0+1+2+3+4+5+6 = 21 (stops before 7)
      expect(result).to.equal(21);
    });
    
    it("Should handle while loop correctly", async function () {
      const result = await controlStructures.whileLoopDemo(1, 5);
      // Sum of 1+2+3+4+5 = 15
      expect(result).to.equal(15);
    });
    
    it("Should reject invalid range in while loop", async function () {
      await expect(controlStructures.whileLoopDemo(5, 3))
        .to.be.revertedWith("Limit must be greater than start");
    });
    
    it("Should calculate factorial correctly", async function () {
      expect(await controlStructures.calculateFactorial(0)).to.equal(1);
      expect(await controlStructures.calculateFactorial(5)).to.equal(120); // 5! = 120
    });
    
    it("Should reject large factorial", async function () {
      await expect(controlStructures.calculateFactorial(11))
        .to.be.revertedWith("Number too large for factorial");
    });
  });
  
  describe("Array Processing", function () {
    beforeEach(async function () {
      // Populate array for testing
      await controlStructures.populateArray(5);
    });
    
    it("Should populate array correctly", async function () {
      const length = await controlStructures.getArrayLength();
      expect(length).to.equal(5);
      
      // Check some values (should be even numbers: 2, 4, 6, 8, 10)
      expect(await controlStructures.getNumberAt(0)).to.equal(2);
      expect(await controlStructures.getNumberAt(4)).to.equal(10);
    });
    
    it("Should find maximum in array", async function () {
      const max = await controlStructures.findMaxInArray();
      expect(max).to.equal(10); // Largest in [2,4,6,8,10]
    });
    
    it("Should sum even numbers", async function () {
      const sum = await controlStructures.sumEvenNumbers();
      expect(sum).to.equal(30); // 2+4+6+8+10 = 30
    });
    
    it("Should reject empty array for max", async function () {
      // Deploy new contract with empty array
      const newContract = await ControlStructures.deploy();
      await newContract.waitForDeployment();
      
      await expect(newContract.findMaxInArray())
        .to.be.revertedWithCustomError(newContract, "ArrayEmpty");
    });
    
    it("Should handle array bounds checking", async function () {
      await expect(controlStructures.getNumberAt(10))
        .to.be.revertedWith("Index out of bounds");
    });
  });
  
  describe("Error Handling", function () {
    it("Should use custom error for odd numbers", async function () {
      await expect(controlStructures.onlyAddEvenNumbers(1, 2))
        .to.be.revertedWithCustomError(controlStructures, "OddNumberSubmitted")
        .withArgs(1, 2);
    });
    
    it("Should add even numbers successfully", async function () {
      const result = await controlStructures.onlyAddEvenNumbers(4, 6);
      expect(result).to.equal(10);
    });
    
    it("Should use require for odd numbers", async function () {
      await expect(controlStructures.requireAddEvenNumbers(1, 2))
        .to.be.revertedWith("First number is not even");
      
      await expect(controlStructures.requireAddEvenNumbers(2, 3))
        .to.be.revertedWith("Second number is not even");
    });
    
    it("Should handle safe division", async function () {
      expect(await controlStructures.safeDivision(10, 2)).to.equal(5);
      
      await expect(controlStructures.safeDivision(10, 0))
        .to.be.revertedWith("Cannot divide by zero");
    });
    
    it("Should process validated even numbers", async function () {
      // This should not revert for even numbers
      await expect(controlStructures.processEvenNumber(4))
        .to.not.be.reverted;
    });
  });
  
  describe("Complex Control Flow", function () {
    it("Should process arrays with complex logic", async function () {
      const input = [15, 9, 5, 2, 101]; // FizzBuzz, Fizz, Buzz, regular, large
      const result = await controlStructures.complexProcessing(input);
      
      expect(result[0]).to.equal(999); // 15 is FizzBuzz
      expect(result[1]).to.equal(18);  // 9 is Fizz (9*2)
      expect(result[2]).to.equal(15);  // 5 is Buzz (5*3)
      expect(result[3]).to.equal(12);  // 2 is regular (2+10)
      expect(result[4]).to.equal(50);  // 101 is large (101/2)
    });
    
    it("Should reject empty array", async function () {
      await expect(controlStructures.complexProcessing([]))
        .to.be.revertedWith("Array cannot be empty");
    });
    
    it("Should check prime numbers", async function () {
      expect(await controlStructures.isPrime(2)).to.equal(true);
      expect(await controlStructures.isPrime(17)).to.equal(true);
      expect(await controlStructures.isPrime(4)).to.equal(false);
      expect(await controlStructures.isPrime(15)).to.equal(false);
      expect(await controlStructures.isPrime(1)).to.equal(false);
    });
  });
  
  describe("State Management", function () {
    it("Should update counter with conditional logic", async function () {
      // Counter starts at 0, should double increment
      await controlStructures.updateCounter(5);
      expect(await controlStructures.counter()).to.equal(10); // 5*2
      
      // Counter is 10, should normal increment
      await controlStructures.updateCounter(5);
      expect(await controlStructures.counter()).to.equal(15); // 10+5
    });
    
    it("Should emit counter update event", async function () {
      await expect(controlStructures.updateCounter(5))
        .to.emit(controlStructures, "CounterUpdated")
        .withArgs(0, 10);
    });
    
    it("Should batch process with early termination", async function () {
      const values = [1, 2, 3, 0, 4, 5]; // Should stop at 0
      const tx = await controlStructures.batchProcess(values);
      const receipt = await tx.wait();
      
      // Check return value from transaction
      const result = await controlStructures.batchProcess.staticCall(values);
      expect(result).to.equal(3); // Processed 1, 2, 3 then stopped at 0
    });
    
    it("Should emit events during batch processing", async function () {
      const values = [1, 2];
      await expect(controlStructures.batchProcess(values))
        .to.emit(controlStructures, "NumberProcessed")
        .withArgs(1, "Processed");
    });
  });
  
  describe("Access Control and Modifiers", function () {
    it("Should allow owner to authorize users", async function () {
      await controlStructures.authorizeUser(addr1.address);
      expect(await controlStructures.authorizedUsers(addr1.address)).to.equal(true);
    });
    
    it("Should reject non-owner authorization", async function () {
      await expect(controlStructures.connect(addr1).authorizeUser(addr2.address))
        .to.be.revertedWithCustomError(controlStructures, "UnauthorizedAccess")
        .withArgs(addr1.address);
    });
    
    it("Should reject zero address authorization", async function () {
      await expect(controlStructures.authorizeUser(ethers.ZeroAddress))
        .to.be.revertedWith("Invalid address");
    });
    
    it("Should allow only authorized users to populate array", async function () {
      await expect(controlStructures.connect(addr1).populateArray(5))
        .to.be.revertedWith("User not authorized");
      
      // Authorize addr1 and try again
      await controlStructures.authorizeUser(addr1.address);
      await controlStructures.connect(addr1).populateArray(5);
      expect(await controlStructures.getArrayLength()).to.equal(5);
    });
    
    it("Should toggle contract status", async function () {
      expect(await controlStructures.contractActive()).to.equal(true);
      
      await controlStructures.toggleContractStatus();
      expect(await controlStructures.contractActive()).to.equal(false);
      
      // Should not be able to update counter when inactive
      await expect(controlStructures.updateCounter(5))
        .to.be.revertedWithCustomError(controlStructures, "ContractNotActive");
    });
    
    it("Should validate number ranges in modifiers", async function () {
      await expect(controlStructures.updateCounter(0))
        .to.be.revertedWith("Number must be positive");
      
      await expect(controlStructures.updateCounter(1001))
        .to.be.revertedWith("Number too large");
    });
  });
  
  describe("Helper Functions", function () {
    beforeEach(async function () {
      await controlStructures.populateArray(3);
    });
    
    it("Should return all numbers", async function () {
      const allNumbers = await controlStructures.getAllNumbers();
      expect(allNumbers.length).to.equal(3);
      expect(allNumbers[0]).to.equal(2);
      expect(allNumbers[1]).to.equal(4);
      expect(allNumbers[2]).to.equal(6);
    });
    
    it("Should get array length", async function () {
      expect(await controlStructures.getArrayLength()).to.equal(3);
    });
  });
});
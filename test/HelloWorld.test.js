const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld Contract", function () {
  let HelloWorld;
  let helloWorld;
  
  beforeEach(async function () {
    // Déployer le contrat avant chaque test
    HelloWorld = await ethers.getContractFactory("HelloWorld");
    helloWorld = await HelloWorld.deploy();
    await helloWorld.waitForDeployment();
  });
  
  describe("SayHello Function", function () {
    it("Should return 'Hello World!'", async function () {
      const result = await helloWorld.SayHello();
      expect(result).to.equal("Hello World!");
    });
  });
  
  describe("Greeter Function", function () {
    it("Should return greeting tuple", async function () {
      const name = "Base";
      const result = await helloWorld.Greeter(name);
      
      // Le résultat est un tuple [string, string]
      expect(result[0]).to.equal("Hello");
      expect(result[1]).to.equal(name);
    });
    
    it("Should work with different names", async function () {
      const names = ["Alice", "Bob", "Charlie"];
      
      for (let name of names) {
        const result = await helloWorld.Greeter(name);
        expect(result[0]).to.equal("Hello");
        expect(result[1]).to.equal(name);
      }
    });
    
    it("Should handle empty string", async function () {
      const result = await helloWorld.Greeter("");
      expect(result[0]).to.equal("Hello");
      expect(result[1]).to.equal("");
    });
  });
});
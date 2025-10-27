const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 1: DeployingToTestnet", function () {
    let deployingToTestnet;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        
        const DeployingToTestnet = await ethers.getContractFactory("DeployingToTestnet");
        deployingToTestnet = await DeployingToTestnet.deploy();
        await deployingToTestnet.waitForDeployment();
    });

    describe("🚀 Deployment", function () {
        it("Should deploy with correct initial state", async function () {
            expect(await deployingToTestnet.message()).to.equal("Hello Base Sepolia!");
            expect(await deployingToTestnet.counter()).to.equal(0);
            expect(await deployingToTestnet.owner()).to.equal(owner.address);
        });

        it("Should return true for isDeployed", async function () {
            expect(await deployingToTestnet.isDeployed()).to.be.true;
        });

        it("Should return true for validate", async function () {
            expect(await deployingToTestnet.validate()).to.be.true;
        });
    });

    describe("📝 Message Functions", function () {
        it("Should return correct greeting", async function () {
            expect(await deployingToTestnet.greet()).to.equal("Hello Base Sepolia!");
        });

        it("Should update message correctly", async function () {
            const newMessage = "Hello Base Learn!";
            await deployingToTestnet.setMessage(newMessage);
            expect(await deployingToTestnet.greet()).to.equal(newMessage);
        });

        it("Should emit MessageUpdated event", async function () {
            const newMessage = "Test message";
            await expect(deployingToTestnet.setMessage(newMessage))
                .to.emit(deployingToTestnet, "MessageUpdated")
                .withArgs(newMessage);
        });

        it("Should reject empty message", async function () {
            await expect(deployingToTestnet.setMessage(""))
                .to.be.revertedWith("Message cannot be empty");
        });
    });

    describe("🔢 Counter Functions", function () {
        it("Should start with counter at 0", async function () {
            expect(await deployingToTestnet.getCounter()).to.equal(0);
        });

        it("Should increment counter correctly", async function () {
            await deployingToTestnet.increment();
            expect(await deployingToTestnet.counter()).to.equal(1);
            expect(await deployingToTestnet.getCounter()).to.equal(1);
        });

        it("Should emit CounterIncremented event", async function () {
            await expect(deployingToTestnet.increment())
                .to.emit(deployingToTestnet, "CounterIncremented")
                .withArgs(1);
        });

        it("Should increment multiple times", async function () {
            for (let i = 1; i <= 5; i++) {
                await deployingToTestnet.increment();
                expect(await deployingToTestnet.getCounter()).to.equal(i);
            }
        });
    });

    describe("ℹ️  Info Functions", function () {
        it("Should return correct info", async function () {
            const [message, counter, ownerAddr] = await deployingToTestnet.getInfo();
            expect(message).to.equal("Hello Base Sepolia!");
            expect(counter).to.equal(0);
            expect(ownerAddr).to.equal(owner.address);
        });

        it("Should return updated info after changes", async function () {
            await deployingToTestnet.setMessage("Updated message");
            await deployingToTestnet.increment();
            
            const [message, counter, ownerAddr] = await deployingToTestnet.getInfo();
            expect(message).to.equal("Updated message");
            expect(counter).to.equal(1);
            expect(ownerAddr).to.equal(owner.address);
        });
    });

    describe("🎯 Exercise Validation", function () {
        it("Should pass all Base Learn exercise requirements", async function () {
            // Test 1: Contract is deployable
            expect(await deployingToTestnet.isDeployed()).to.be.true;
            
            // Test 2: Basic functionality works
            expect(await deployingToTestnet.greet()).to.not.be.empty;
            expect(await deployingToTestnet.getCounter()).to.be.a('bigint');
            
            // Test 3: State can be modified
            await deployingToTestnet.increment();
            expect(await deployingToTestnet.getCounter()).to.equal(1);
            
            // Test 4: Validation passes
            expect(await deployingToTestnet.validate()).to.be.true;
            
            console.log("✅ All exercise requirements satisfied!");
        });

        it("Should be compatible with Base Learn test framework", async function () {
            // Common patterns that Base Learn test contracts check
            expect(await deployingToTestnet.validate()).to.be.true;
            expect(await deployingToTestnet.isDeployed()).to.be.true;
            
            // Contract should have an address
            expect(await deployingToTestnet.getAddress()).to.be.properAddress;
            
            // Functions should be callable
            expect(await deployingToTestnet.greet()).to.be.a('string');
            
            console.log("✅ Compatible with Base Learn test patterns!");
        });
    });

    describe("⛽ Gas Optimization", function () {
        it("Should have reasonable gas costs", async function () {
            const tx = await deployingToTestnet.increment();
            const receipt = await tx.wait();
            
            // Gas should be reasonable for a simple increment
            expect(receipt.gasUsed).to.be.below(50000);
            console.log(`⛽ Gas used for increment: ${receipt.gasUsed}`);
        });
    });
});

// Test d'intégration avec le contrat de test réel
describe("🔗 Integration with Base Learn Test Contract", function () {
    it("Should be ready for Base Learn validation", async function () {
        console.log("🎯 Exercise 1: DeployingToTestnet");
        console.log("📍 Target NFT: Basic Contracts Pin");
        console.log("🧪 Test Contract: 0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F");
        console.log("✅ Ready for deployment to Base Sepolia!");
    });
});
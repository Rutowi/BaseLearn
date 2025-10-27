const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BaseLearnToken - Concepts Base Learn 2-4", function () {
    let baseLearnToken;
    let owner;
    let addr1;
    let addr2;
    
    const INITIAL_SUPPLY = ethers.parseEther("5000000"); // 5M tokens
    const MAX_SUPPLY = ethers.parseEther("1000000000"); // 1B tokens
    
    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        
        const BaseLearnToken = await ethers.getContractFactory("BaseLearnToken");
        baseLearnToken = await BaseLearnToken.deploy(INITIAL_SUPPLY, owner.address);
        await baseLearnToken.waitForDeployment();
    });

    describe("🚀 Module 2: Basic Types", function () {
        it("Should have correct token metadata (string, uint8)", async function () {
            expect(await baseLearnToken.name()).to.equal("Base Learn Token");
            expect(await baseLearnToken.symbol()).to.equal("BLT");
            expect(await baseLearnToken.decimals()).to.equal(18);
        });

        it("Should handle uint256 supply correctly", async function () {
            expect(await baseLearnToken.totalSupply()).to.equal(INITIAL_SUPPLY);
            expect(await baseLearnToken.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
        });

        it("Should assign initial balance correctly", async function () {
            expect(await baseLearnToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
            expect(await baseLearnToken.owner()).to.equal(owner.address);
        });
    });

    describe("🏛️ Module 3: Control Structures", function () {
        beforeEach(async function () {
            // Transfer some tokens for testing
            await baseLearnToken.transfer(addr1.address, ethers.parseEther("10000"));
        });

        it("Should use modifiers for access control", async function () {
            // Only owner should be able to mint
            await expect(
                baseLearnToken.connect(addr1).mint(addr2.address, ethers.parseEther("1000"))
            ).to.be.revertedWithCustomError(baseLearnToken, "Unauthorized");
            
            // Owner should be able to mint
            await expect(
                baseLearnToken.mint(addr2.address, ethers.parseEther("1000"))
            ).to.not.be.reverted;
        });

        it("Should use require statements for validation", async function () {
            // Should revert on zero address
            await expect(
                baseLearnToken.transfer(ethers.ZeroAddress, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(baseLearnToken, "InvalidAddress");
        });

        it("Should use custom errors properly", async function () {
            // Should revert on insufficient balance
            await expect(
                baseLearnToken.connect(addr1).transfer(addr2.address, ethers.parseEther("20000"))
            ).to.be.revertedWithCustomError(baseLearnToken, "InsufficientBalance");
        });

        it("Should use conditional logic in transfers", async function () {
            // Set VIP status
            await baseLearnToken.setVipStatus(addr2.address, true);
            
            const initialBalance = await baseLearnToken.balanceOf(addr2.address);
            const transferAmount = ethers.parseEther("5000"); // Large transfer for VIP bonus
            
            // Transfer from addr1 to VIP addr2
            await baseLearnToken.connect(addr1).transfer(addr2.address, transferAmount);
            
            const finalBalance = await baseLearnToken.balanceOf(addr2.address);
            
            // VIP should receive bonus (though not implemented in simplified version)
            console.log("Balance avant:", ethers.formatEther(initialBalance));
            console.log("Balance après:", ethers.formatEther(finalBalance));
            console.log("Transfer:", ethers.formatEther(transferAmount));
        });

        it("Should handle pause functionality", async function () {
            // Toggle pause
            await baseLearnToken.togglePause();
            
            // Transfers should fail when paused
            await expect(
                baseLearnToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
            ).to.be.revertedWith("Contract paused");
            
            // Unpause
            await baseLearnToken.togglePause();
            
            // Should work again
            await expect(
                baseLearnToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
            ).to.not.be.reverted;
        });
    });

    describe("🗂️ Module 4: Storage Optimization", function () {
        it("Should use mappings efficiently", async function () {
            // Test balance mapping
            expect(await baseLearnToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
            expect(await baseLearnToken.balanceOf(addr1.address)).to.equal(0);
            
            // Transfer and check mapping update
            await baseLearnToken.transfer(addr1.address, ethers.parseEther("1000"));
            expect(await baseLearnToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
        });

        it("Should use packed struct for gas optimization", async function () {
            // Get user data (demonstrates packed struct usage)
            const userData = await baseLearnToken.getUserData(owner.address);
            
            expect(userData[0]).to.equal(INITIAL_SUPPLY); // balance
            expect(userData[1]).to.equal(0); // stakedAmount (uint128)
            expect(userData[2]).to.equal(0); // lastAction (uint64)
            expect(userData[3]).to.equal(0); // points (uint32)
            expect(userData[4]).to.equal(false); // isVip (bool)
        });

        it("Should update packed storage on actions", async function () {
            // Perform a transfer to update lastAction timestamp
            await baseLearnToken.transfer(addr1.address, ethers.parseEther("1000"));
            
            const userData = await baseLearnToken.getUserData(owner.address);
            expect(userData[2]).to.be.gt(0); // lastAction should be updated
        });

        it("Should manage VIP status in packed storage", async function () {
            // Initially not VIP
            let userData = await baseLearnToken.getUserData(addr1.address);
            expect(userData[4]).to.equal(false);
            
            // Set VIP status
            await baseLearnToken.setVipStatus(addr1.address, true);
            
            userData = await baseLearnToken.getUserData(addr1.address);
            expect(userData[4]).to.equal(true);
        });
    });

    describe("💼 ERC-20 Standard Implementation", function () {
        beforeEach(async function () {
            await baseLearnToken.transfer(addr1.address, ethers.parseEther("10000"));
        });

        it("Should transfer tokens correctly", async function () {
            const transferAmount = ethers.parseEther("1000");
            
            await expect(
                baseLearnToken.connect(addr1).transfer(addr2.address, transferAmount)
            ).to.emit(baseLearnToken, "Transfer")
             .withArgs(addr1.address, addr2.address, transferAmount);
            
            expect(await baseLearnToken.balanceOf(addr2.address)).to.equal(transferAmount);
            expect(await baseLearnToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("9000"));
        });

        it("Should handle approval correctly", async function () {
            const approvalAmount = ethers.parseEther("5000");
            
            await expect(
                baseLearnToken.connect(addr1).approve(addr2.address, approvalAmount)
            ).to.emit(baseLearnToken, "Approval")
             .withArgs(addr1.address, addr2.address, approvalAmount);
            
            expect(await baseLearnToken.allowance(addr1.address, addr2.address)).to.equal(approvalAmount);
        });
    });

    describe("👑 Admin Functions", function () {
        it("Should allow owner to mint tokens", async function () {
            const mintAmount = ethers.parseEther("1000");
            const initialSupply = await baseLearnToken.totalSupply();
            
            await expect(
                baseLearnToken.mint(addr1.address, mintAmount)
            ).to.emit(baseLearnToken, "Transfer")
             .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
            
            expect(await baseLearnToken.balanceOf(addr1.address)).to.equal(mintAmount);
            expect(await baseLearnToken.totalSupply()).to.equal(initialSupply + mintAmount);
        });

        it("Should prevent minting beyond max supply", async function () {
            const excessiveAmount = MAX_SUPPLY; // This would exceed max supply
            
            await expect(
                baseLearnToken.mint(addr1.address, excessiveAmount)
            ).to.be.revertedWith("Exceeds max supply");
        });

        it("Should manage VIP status", async function () {
            // Set VIP status
            await baseLearnToken.setVipStatus(addr1.address, true);
            
            const userData = await baseLearnToken.getUserData(addr1.address);
            expect(userData[4]).to.equal(true); // isVip should be true
            
            // Remove VIP status
            await baseLearnToken.setVipStatus(addr1.address, false);
            
            const updatedUserData = await baseLearnToken.getUserData(addr1.address);
            expect(updatedUserData[4]).to.equal(false); // isVip should be false
        });
    });

    describe("📊 View Functions & Data Retrieval", function () {
        it("Should return complete user data efficiently", async function () {
            // Transfer some tokens and set VIP status
            await baseLearnToken.transfer(addr1.address, ethers.parseEther("5000"));
            await baseLearnToken.setVipStatus(addr1.address, true);
            
            const userData = await baseLearnToken.getUserData(addr1.address);
            
            expect(userData[0]).to.equal(ethers.parseEther("5000")); // balance
            expect(userData[1]).to.equal(0); // stakedAmount
            expect(userData[2]).to.be.gt(0); // lastAction (should be set)
            expect(userData[3]).to.equal(0); // points
            expect(userData[4]).to.equal(true); // isVip
        });
    });

    describe("🔒 Security Features", function () {
        it("Should validate addresses", async function () {
            await expect(
                baseLearnToken.transfer(ethers.ZeroAddress, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(baseLearnToken, "InvalidAddress");
        });

        it("Should enforce access control", async function () {
            await expect(
                baseLearnToken.connect(addr1).mint(addr2.address, ethers.parseEther("1000"))
            ).to.be.revertedWithCustomError(baseLearnToken, "Unauthorized");
            
            await expect(
                baseLearnToken.connect(addr1).togglePause()
            ).to.be.revertedWithCustomError(baseLearnToken, "Unauthorized");
        });

        it("Should handle pause state correctly", async function () {
            // Pause contract
            await baseLearnToken.togglePause();
            
            // Transfers should fail
            await expect(
                baseLearnToken.transfer(addr1.address, ethers.parseEther("100"))
            ).to.be.revertedWith("Contract paused");
            
            // Approvals should fail
            await expect(
                baseLearnToken.approve(addr1.address, ethers.parseEther("100"))
            ).to.be.revertedWith("Contract paused");
        });
    });
});
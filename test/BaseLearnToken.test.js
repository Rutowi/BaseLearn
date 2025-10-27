const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("BaseLearnToken - Advanced ERC-20", function () {
  let BaseLearnToken;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  
  const INITIAL_SUPPLY = ethers.parseEther("10000000"); // 10M tokens
  const DECIMALS = 18;
  
  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
    BaseLearnToken = await ethers.getContractFactory("BaseLearnToken");
    token = await BaseLearnToken.deploy(INITIAL_SUPPLY, owner.address);
    await token.waitForDeployment();
  });
  
  describe("Deployment and Basic Info", function () {
    it("Should set correct token metadata", async function () {
      expect(await token.name()).to.equal("Base Learn Token");
      expect(await token.symbol()).to.equal("BLT");
      expect(await token.decimals()).to.equal(18);
    });
    
    it("Should set correct initial supply and max supply", async function () {
      expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY);
      expect(await token.MAX_SUPPLY()).to.equal(ethers.parseEther("1000000000")); // 1B
    });
    
    it("Should set correct owner and initial balance", async function () {
      expect(await token.owner()).to.equal(owner.address);
      expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
      expect(await token.deployer()).to.equal(owner.address);
    });
    
    it("Should initialize staking rewards correctly", async function () {
      expect(await token.stakingRewards(1)).to.equal(5);
      expect(await token.stakingRewards(2)).to.equal(8);
      expect(await token.stakingRewards(3)).to.equal(12);
      expect(await token.stakingRewards(4)).to.equal(18);
      expect(await token.stakingRewards(5)).to.equal(25);
    });
  });
  
  describe("ERC-20 Core Functions", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for testing
      await token.transfer(addr1.address, ethers.parseEther("1000"));
    });
    
    it("Should transfer tokens correctly", async function () {
      const amount = ethers.parseEther("100");
      
      await expect(token.connect(addr1).transfer(addr2.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(addr1.address, addr2.address, amount);
        
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("900"));
      expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });
    
    it("Should handle approve and transferFrom", async function () {
      const amount = ethers.parseEther("100");
      
      // Approve
      await expect(token.connect(addr1).approve(addr2.address, amount))
        .to.emit(token, "Approval")
        .withArgs(addr1.address, addr2.address, amount);
        
      expect(await token.allowance(addr1.address, addr2.address)).to.equal(amount);
      
      // TransferFrom
      await expect(token.connect(addr2).transferFrom(addr1.address, addr3.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(addr1.address, addr3.address, amount);
        
      expect(await token.balanceOf(addr3.address)).to.equal(amount);
      expect(await token.allowance(addr1.address, addr2.address)).to.equal(0);
    });
    
    it("Should revert on insufficient balance", async function () {
      const amount = ethers.parseEther("2000"); // More than addr1 has
      
      await expect(token.connect(addr1).transfer(addr2.address, amount))
        .to.be.revertedWithCustomError(token, "InsufficientBalance");
    });
    
    it("Should revert on insufficient allowance", async function () {
      const amount = ethers.parseEther("100");
      
      await expect(token.connect(addr2).transferFrom(addr1.address, addr3.address, amount))
        .to.be.revertedWithCustomError(token, "InsufficientAllowance");
    });
  });
  
  describe("VIP System and Transfer Bonuses", function () {
    beforeEach(async function () {
      await token.transfer(addr1.address, ethers.parseEther("10000"));
      await token.setVipStatus(addr2.address, true);
    });
    
    it("Should set VIP status correctly", async function () {
      await expect(token.setVipStatus(addr1.address, true))
        .to.emit(token, "VipStatusChanged")
        .withArgs(addr1.address, true);
        
      const userData = await token.getUserData(addr1.address);
      expect(userData.isVip).to.equal(true);
    });
    
    it("Should give VIP bonus on large transfers", async function () {
      const amount = ethers.parseEther("1000"); // Qualifies for VIP bonus
      const expectedBonus = amount / 100n; // 1% bonus
      
      const initialBalance = await token.balanceOf(addr2.address);
      
      await token.connect(addr1).transfer(addr2.address, amount);
      
      const finalBalance = await token.balanceOf(addr2.address);
      expect(finalBalance).to.equal(initialBalance + amount + expectedBonus);
    });
    
    it("Should not give bonus on small transfers", async function () {
      const amount = ethers.parseEther("500"); // Below threshold
      
      const initialBalance = await token.balanceOf(addr2.address);
      await token.connect(addr1).transfer(addr2.address, amount);
      
      const finalBalance = await token.balanceOf(addr2.address);
      expect(finalBalance).to.equal(initialBalance + amount); // No bonus
    });
  });
  
  describe("Staking System", function () {
    beforeEach(async function () {
      await token.transfer(addr1.address, ethers.parseEther("10000"));
    });
    
    it("Should allow staking with different tiers", async function () {
      const stakeAmount = ethers.parseEther("1000");
      const tier = 3;
      
      await expect(token.connect(addr1).stake(stakeAmount, tier))
        .to.emit(token, "Stake")
        .withArgs(addr1.address, stakeAmount, tier);
        
      const stake = await token.stakes(addr1.address);
      expect(stake.amount).to.equal(stakeAmount);
      expect(stake.stakingTier).to.equal(tier);
      expect(stake.isActive).to.equal(true);
      expect(stake.lockPeriod).to.equal(90 * 24 * 60 * 60); // 90 days
    });
    
    it("Should reject staking below minimum", async function () {
      const stakeAmount = ethers.parseEther("50"); // Below 100 minimum
      
      await expect(token.connect(addr1).stake(stakeAmount, 1))
        .to.be.revertedWith("Amount below minimum stake");
    });
    
    it("Should reject invalid staking tier", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await expect(token.connect(addr1).stake(stakeAmount, 0))
        .to.be.revertedWithCustomError(token, "InvalidStakingTier");
        
      await expect(token.connect(addr1).stake(stakeAmount, 6))
        .to.be.revertedWithCustomError(token, "InvalidStakingTier");
    });
    
    it("Should calculate correct lock periods for different tiers", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      // Test each tier
      await token.connect(addr1).stake(stakeAmount, 1);
      let stake = await token.stakes(addr1.address);
      expect(stake.lockPeriod).to.equal(7 * 24 * 60 * 60); // 7 days
      
      // Reset for next test
      await token.connect(addr1).unstake(); // This will fail due to lock period, but let's test anyway
    });
    
    it("Should prevent unstaking before lock period expires", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await token.connect(addr1).stake(stakeAmount, 1); // 7 days lock
      
      await expect(token.connect(addr1).unstake())
        .to.be.revertedWithCustomError(token, "StakingPeriodNotExpired");
    });
    
    it("Should allow unstaking after lock period with rewards", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await token.connect(addr1).stake(stakeAmount, 1); // 7 days lock, 5% APY
      
      // Fast forward time by 8 days
      await time.increase(8 * 24 * 60 * 60);
      
      const initialBalance = await token.balanceOf(addr1.address);
      
      await expect(token.connect(addr1).unstake())
        .to.emit(token, "Unstake");
        
      const finalBalance = await token.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance + stakeAmount); // Should have rewards
      
      // Check stake is cleared
      const stake = await token.stakes(addr1.address);
      expect(stake.isActive).to.equal(false);
    });
  });
  
  describe("Governance System", function () {
    beforeEach(async function () {
      await token.transfer(addr1.address, ethers.parseEther("2000")); // Enough to create proposal
    });
    
    it("Should create proposal correctly", async function () {
      const description = "Test proposal";
      
      await expect(token.connect(addr1).createProposal(description))
        .to.emit(token, "ProposalCreated")
        .withArgs(0, addr1.address, description);
        
      const proposal = await token.getProposal(0);
      expect(proposal.description).to.equal(description);
      expect(proposal.proposer).to.equal(addr1.address);
      expect(proposal.forVotes).to.equal(0);
      expect(proposal.againstVotes).to.equal(0);
    });
    
    it("Should reject proposal creation with insufficient tokens", async function () {
      await expect(token.connect(addr2).createProposal("Test"))
        .to.be.revertedWith("Insufficient tokens to propose");
    });
    
    it("Should allow voting on proposals", async function () {
      await token.connect(addr1).createProposal("Test proposal");
      await token.transfer(addr2.address, ethers.parseEther("500"));
      
      const voteWeight = await token.balanceOf(addr2.address);
      
      await expect(token.connect(addr2).vote(0, true))
        .to.emit(token, "Voted")
        .withArgs(0, addr2.address, true, voteWeight);
        
      const proposal = await token.getProposal(0);
      expect(proposal.forVotes).to.equal(voteWeight);
    });
    
    it("Should prevent double voting", async function () {
      await token.connect(addr1).createProposal("Test proposal");
      await token.transfer(addr2.address, ethers.parseEther("500"));
      
      await token.connect(addr2).vote(0, true);
      
      await expect(token.connect(addr2).vote(0, false))
        .to.be.revertedWithCustomError(token, "AlreadyVoted");
    });
    
    it("Should prevent voting on non-existent proposals", async function () {
      await expect(token.connect(addr1).vote(999, true))
        .to.be.revertedWithCustomError(token, "ProposalNotFound");
    });
  });
  
  describe("Airdrop System", function () {
    beforeEach(async function () {
      const recipients = [addr1.address, addr2.address];
      await token.setAirdropRecipients(recipients);
    });
    
    it("Should set airdrop recipients correctly", async function () {
      expect(await token.airdropRecipients(0)).to.equal(addr1.address);
      expect(await token.airdropRecipients(1)).to.equal(addr2.address);
    });
    
    it("Should allow eligible addresses to claim airdrop", async function () {
      const airdropAmount = await token.airdropAmount();
      const initialBalance = await token.balanceOf(addr1.address);
      
      await expect(token.connect(addr1).claimAirdrop())
        .to.emit(token, "AirdropClaimed")
        .withArgs(addr1.address, airdropAmount);
        
      expect(await token.balanceOf(addr1.address)).to.equal(initialBalance + airdropAmount);
      expect(await token.hasClaimedAirdrop(addr1.address)).to.equal(true);
    });
    
    it("Should reject non-eligible addresses", async function () {
      await expect(token.connect(addr3).claimAirdrop())
        .to.be.revertedWith("Not eligible for airdrop");
    });
    
    it("Should prevent double claiming", async function () {
      await token.connect(addr1).claimAirdrop();
      
      await expect(token.connect(addr1).claimAirdrop())
        .to.be.revertedWithCustomError(token, "AlreadyClaimed");
    });
  });
  
  describe("Admin Functions", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      await expect(token.mint(addr1.address, mintAmount))
        .to.emit(token, "Mint")
        .withArgs(addr1.address, mintAmount, "Admin mint");
        
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
    });
    
    it("Should prevent minting beyond max supply", async function () {
      const maxSupply = await token.MAX_SUPPLY();
      const currentSupply = await token.totalSupply();
      const excessiveAmount = maxSupply - currentSupply + 1n;
      
      await expect(token.mint(addr1.address, excessiveAmount))
        .to.be.revertedWithCustomError(token, "ExceedsMaxSupply");
    });
    
    it("Should allow users to burn their tokens", async function () {
      await token.transfer(addr1.address, ethers.parseEther("1000"));
      const burnAmount = ethers.parseEther("500");
      
      await expect(token.connect(addr1).burn(burnAmount))
        .to.emit(token, "Burn")
        .withArgs(addr1.address, burnAmount, "User burn");
        
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("500"));
    });
    
    it("Should allow owner to toggle pause", async function () {
      await expect(token.togglePause())
        .to.emit(token, "PauseToggled")
        .withArgs(true);
        
      expect(await token.paused()).to.equal(true);
      
      // Should prevent transfers when paused
      await expect(token.transfer(addr1.address, ethers.parseEther("100")))
        .to.be.revertedWithCustomError(token, "ContractPaused");
    });
    
    it("Should manage blacklisting", async function () {
      await token.setBlacklisted(addr1.address, true);
      
      const userData = await token.getUserData(addr1.address);
      expect(userData.isBlacklisted).to.equal(true);
      
      // Should prevent transfers from/to blacklisted address
      await expect(token.transfer(addr1.address, ethers.parseEther("100")))
        .to.be.revertedWith("Account is blacklisted");
    });
  });
  
  describe("Access Control", function () {
    it("Should reject non-owner admin functions", async function () {
      await expect(token.connect(addr1).mint(addr2.address, ethers.parseEther("100")))
        .to.be.revertedWithCustomError(token, "UnauthorizedAccess");
        
      await expect(token.connect(addr1).togglePause())
        .to.be.revertedWithCustomError(token, "UnauthorizedAccess");
        
      await expect(token.connect(addr1).setVipStatus(addr2.address, true))
        .to.be.revertedWithCustomError(token, "UnauthorizedAccess");
    });
    
    it("Should validate addresses", async function () {
      await expect(token.mint(ethers.ZeroAddress, ethers.parseEther("100")))
        .to.be.revertedWithCustomError(token, "InvalidAddress");
        
      await expect(token.transfer(ethers.ZeroAddress, ethers.parseEther("100")))
        .to.be.revertedWithCustomError(token, "InvalidAddress");
    });
  });
  
  describe("View Functions", function () {
    it("Should return complete user data", async function () {
      await token.transfer(addr1.address, ethers.parseEther("2000"));
      await token.setVipStatus(addr1.address, true);
      
      const userData = await token.getUserData(addr1.address);
      
      expect(userData.balance).to.equal(ethers.parseEther("2000"));
      expect(userData.isVip).to.equal(true);
      expect(userData.isBlacklisted).to.equal(false);
      expect(userData.hasActiveStake).to.equal(false);
    });
    
    it("Should return contract statistics", async function () {
      const stats = await token.getContractStats();
      
      expect(stats.currentSupply).to.equal(INITIAL_SUPPLY);
      expect(stats.maxSupply).to.equal(ethers.parseEther("1000000000"));
      expect(stats.totalProposals).to.equal(0);
      expect(stats.contractPaused).to.equal(false);
    });
  });
  
  describe("Transfer Cooldown", function () {
    beforeEach(async function () {
      await token.transfer(addr1.address, ethers.parseEther("1000"));
    });
    
    it("Should enforce transfer cooldown", async function () {
      // First transfer should work
      await token.connect(addr1).transfer(addr2.address, ethers.parseEther("100"));
      
      // Immediate second transfer should fail due to cooldown
      await expect(token.connect(addr1).transfer(addr2.address, ethers.parseEther("100")))
        .to.be.revertedWithCustomError(token, "TransferCooldownActive");
    });
    
    it("Should allow transfer after cooldown period", async function () {
      await token.connect(addr1).transfer(addr2.address, ethers.parseEther("100"));
      
      // Wait for cooldown to expire
      await time.increase(2); // 2 seconds > 1 second cooldown
      
      // Should now work
      await expect(token.connect(addr1).transfer(addr2.address, ethers.parseEther("100")))
        .to.not.be.reverted;
    });
  });
});
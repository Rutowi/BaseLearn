const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🔄 Deploying ControlStructures contract to demonstrate Solidity control flow...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");
  
  // Deploy ControlStructures
  console.log("🚀 Deploying ControlStructures contract...");
  const ControlStructures = await ethers.getContractFactory("ControlStructures");
  const controlStructures = await ControlStructures.deploy();
  
  await controlStructures.waitForDeployment();
  const controlStructuresAddress = await controlStructures.getAddress();
  
  console.log("✅ ControlStructures deployed to:", controlStructuresAddress);
  console.log("📈 Deployment transaction:", controlStructures.deploymentTransaction()?.hash);
  
  // Wait for transaction to be mined
  console.log("\n⏳ Waiting for transaction to be confirmed...");
  await controlStructures.deploymentTransaction()?.wait(2); // Wait for 2 confirmations
  
  console.log("✅ Transaction confirmed!");
  
  // Save deployment info
  const deploymentInfo = {
    network: "base-sepolia",
    contractName: "ControlStructures", 
    address: controlStructuresAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: controlStructures.deploymentTransaction()?.hash,
    blockNumber: controlStructures.deploymentTransaction()?.blockNumber,
    gasUsed: "To be verified on BaseScan",
    purpose: "Module 3: Demonstrate all Solidity control structures and error handling",
    curriculum: "Base Learn - docs.base.org/learn/control-structures/control-structures",
    features: [
      "Conditional structures: if, else if, else",
      "Iterative structures: for, while loops", 
      "Flow control: continue, break, return",
      "Error handling: require, revert, custom errors, assert",
      "Modifiers for access control and validation",
      "Complex control flow examples"
    ]
  };
  
  const deploymentPath = './deployments';
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath);
  }
  
  fs.writeFileSync(
    `${deploymentPath}/ControlStructures-base-sepolia.json`, 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log(`Contract: ControlStructures`);
  console.log(`Address: ${controlStructuresAddress}`);
  console.log(`Network: Base Sepolia (Chain ID: 84532)`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Transaction: ${controlStructures.deploymentTransaction()?.hash}`);
  console.log(`Deployment info saved to: ${deploymentPath}/ControlStructures-base-sepolia.json`);
  
  console.log("\n🌐 Next steps:");
  console.log("1. Verify contract on BaseScan:");
  console.log(`   npx hardhat verify --network base-sepolia ${controlStructuresAddress}`);
  console.log(`2. View on BaseScan: https://sepolia.basescan.org/address/${controlStructuresAddress}`);
  console.log("3. Continue to Module 4: Data Storage");
  
  console.log("\n✨ Module 3 (Control Structures) completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
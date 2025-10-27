const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("📚 Deploying BasicTypes contract to demonstrate all Solidity data types...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");
  
  // Deploy BasicTypes
  console.log("🚀 Deploying BasicTypes contract...");
  const BasicTypes = await ethers.getContractFactory("BasicTypes");
  const basicTypes = await BasicTypes.deploy();
  
  await basicTypes.waitForDeployment();
  const basicTypesAddress = await basicTypes.getAddress();
  
  console.log("✅ BasicTypes deployed to:", basicTypesAddress);
  console.log("📈 Deployment transaction:", basicTypes.deploymentTransaction()?.hash);
  
  // Test some functions after deployment
  console.log("\n🧪 Testing deployed contract functions...");
  
  // Test integer operations
  console.log("🔢 Testing integer operations:");
  console.log("- Default uint:", await basicTypes.defaultUint());
  console.log("- Large number:", await basicTypes.largeNumber());
  console.log("- Number of teams (constant):", await basicTypes.NUMBER_OF_TEAMS());
  
  // Test boolean operations
  console.log("\n✅ Testing boolean operations:");
  const boolResult = await basicTypes.booleanOperations(true, false);
  console.log("- AND result:", boolResult.andResult);
  console.log("- OR result:", boolResult.orResult);
  
  // Test address operations
  console.log("\n🏠 Testing address operations:");
  console.log("- Owner:", await basicTypes.owner());
  console.log("- Contract address:", await basicTypes.getAddress());
  
  // Test string operations
  console.log("\n📝 Testing string operations:");
  console.log("- Contract name:", await basicTypes.contractName());
  const concat = await basicTypes.concatenateStrings("Base", "Learn");
  console.log("- Concatenated strings:", concat);
  
  // Test enum operations
  console.log("\n📊 Testing enum operations:");
  console.log("- Current status:", await basicTypes.currentStatus());
  console.log("- Chosen flavor:", await basicTypes.chosenFlavor());
  
  // Test type limits
  console.log("\n⚡ Testing type limits:");
  const limits = await basicTypes.getTypeLimits();
  console.log("- Max uint8:", limits.maxUint8);
  console.log("- Min uint256:", limits.minUint256);
  
  // Save deployment info
  const deploymentInfo = {
    network: "baseSepolia",
    contractName: "BasicTypes",
    address: basicTypesAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: basicTypes.deploymentTransaction()?.hash,
    blockNumber: basicTypes.deploymentTransaction()?.blockNumber,
    gasUsed: "To be verified on BaseScan",
    purpose: "Module 2: Demonstrate all Solidity basic data types",
    curriculum: "Base Learn - docs.base.org/learn/basic-types"
  };
  
  const deploymentPath = './deployments';
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath);
  }
  
  fs.writeFileSync(
    `${deploymentPath}/BasicTypes-baseSepolia.json`, 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log(`Contract: BasicTypes`);
  console.log(`Address: ${basicTypesAddress}`);
  console.log(`Network: Base Sepolia (Chain ID: 84532)`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Transaction: ${basicTypes.deploymentTransaction()?.hash}`);
  console.log(`Deployment info saved to: ${deploymentPath}/BasicTypes-baseSepolia.json`);
  
  console.log("\n🌐 Next steps:");
  console.log("1. Verify contract on BaseScan:");
  console.log(`   npx hardhat verify --network baseSepolia ${basicTypesAddress}`);
  console.log(`2. View on BaseScan: https://sepolia.basescan.org/address/${basicTypesAddress}`);
  console.log("3. Continue to Module 3: Control Structures");
  
  console.log("\n✨ Module 2 (Basic Types) completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
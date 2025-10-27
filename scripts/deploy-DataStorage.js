const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("💾 Deploying DataStorage contract to demonstrate Solidity storage concepts...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");
  
  // Constructor parameters
  const contractName = "Base Learn Storage Demo";
  const initialAge = 25;
  const initialCars = 2; 
  const initialBalance = 1000;
  
  console.log("📝 Constructor parameters:");
  console.log("- Name:", contractName);
  console.log("- Age:", initialAge);
  console.log("- Cars:", initialCars);
  console.log("- Balance:", initialBalance);
  
  // Deploy DataStorage
  console.log("\n🚀 Deploying DataStorage contract...");
  const DataStorage = await ethers.getContractFactory("DataStorage");
  const dataStorage = await DataStorage.deploy(
    contractName,
    initialAge, 
    initialCars,
    initialBalance
  );
  
  await dataStorage.waitForDeployment();
  const dataStorageAddress = await dataStorage.getAddress();
  
  console.log("✅ DataStorage deployed to:", dataStorageAddress);
  console.log("📈 Deployment transaction:", dataStorage.deploymentTransaction()?.hash);
  
  // Wait for transaction to be mined
  console.log("\n⏳ Waiting for transaction to be confirmed...");
  await dataStorage.deploymentTransaction()?.wait(2); // Wait for 2 confirmations
  
  console.log("✅ Transaction confirmed!");
  
  // Save deployment info
  const deploymentInfo = {
    network: "base-sepolia",
    contractName: "DataStorage", 
    address: dataStorageAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: dataStorage.deploymentTransaction()?.hash,
    blockNumber: dataStorage.deploymentTransaction()?.blockNumber,
    gasUsed: "To be verified on BaseScan",
    purpose: "Module 4: Demonstrate Solidity data storage concepts and gas optimization",
    curriculum: "Base Learn - docs.base.org/learn/storage/simple-storage-sbs",
    constructorParams: {
      name: contractName,
      age: initialAge,
      cars: initialCars,
      balance: initialBalance
    },
    features: [
      "Storage vs Memory vs Stack demonstrations",
      "Variable packing optimization",
      "Gas-efficient storage patterns", 
      "Arrays and Mappings storage",
      "Constructor with parameters",
      "Storage slots and layout analysis"
    ]
  };
  
  const deploymentPath = './deployments';
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath);
  }
  
  fs.writeFileSync(
    `${deploymentPath}/DataStorage-base-sepolia.json`, 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log(`Contract: DataStorage`);
  console.log(`Address: ${dataStorageAddress}`);
  console.log(`Network: Base Sepolia (Chain ID: 84532)`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Transaction: ${dataStorage.deploymentTransaction()?.hash}`);
  console.log(`Deployment info saved to: ${deploymentPath}/DataStorage-base-sepolia.json`);
  
  console.log("\n🌐 Next steps:");
  console.log("1. Verify contract on BaseScan:");
  console.log(`   npx hardhat verify --network base-sepolia ${dataStorageAddress} "${contractName}" ${initialAge} ${initialCars} ${initialBalance}`);
  console.log(`2. View on BaseScan: https://sepolia.basescan.org/address/${dataStorageAddress}`);
  console.log("3. All modules (2-4) completed!");
  
  console.log("\n🎉 Module 4 (Data Storage) completed successfully!");
  console.log("✨ Base Learn Modules 2-4 curriculum COMPLETED!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
const hre = require("hardhat");
const fs = require('fs');

async function deployAllPriorityExercises() {
    console.log("🚀 Déploiement de TOUS les exercices prioritaires Base Learn");
    console.log("🎯 Objectif: Compléter tous les exercices Base Learn prioritaires");
    console.log("=" .repeat(60));
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying avec:", deployer.address);
    console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");
    
    const deployments = [];
    
    try {
        // Exercise 1: Already deployed
        console.log("\n📦 Exercise 1: DeployingToTestnet");
        console.log("✅ Déjà déployé à: 0xbd2A9EaCa396c209D84E5e193ea875B5370a5bC3");
        deployments.push({
            exercise: "DeployingToTestnet",
            address: "0xbd2A9EaCa396c209D84E5e193ea875B5370a5bC3",
            targetNFT: "Basic Contracts Pin"
        });
        
        // Exercise 2: Control Structures
        console.log("\n📦 Exercise 2: Control Structures");
        const ControlStructures = await hre.ethers.getContractFactory("contracts/exercises/ControlStructures.sol:ControlStructures");
        const controlStructures = await ControlStructures.deploy();
        await controlStructures.waitForDeployment();
        const controlAddress = await controlStructures.getAddress();
        
        console.log("✅ ControlStructures déployé à:", controlAddress);
        
        // Test basic functions
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        const isActive = await controlStructures.isActive();
        const owner = await controlStructures.owner();
        console.log("   📊 Status:", isActive ? "active" : "inactive");
        console.log("   👤 Owner:", owner);
        
        deployments.push({
            exercise: "ControlStructures",
            address: controlAddress,
            targetNFT: "Control Structures Pin"
        });
        
        // Exercise 3: Storage
        console.log("\n📦 Exercise 3: Storage");
        const StorageExercise = await hre.ethers.getContractFactory("StorageExercise");
        const storageExercise = await StorageExercise.deploy();
        await storageExercise.waitForDeployment();
        const storageAddress = await storageExercise.getAddress();
        
        console.log("✅ StorageExercise déployé à:", storageAddress);
        
        // Test basic functions
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        const totalValue = await storageExercise.totalValue();
        const storageOwner = await storageExercise.owner();
        console.log("   💰 Total Value:", totalValue.toString());
        console.log("   👤 Owner:", storageOwner);
        
        deployments.push({
            exercise: "StorageExercise",
            address: storageAddress,
            targetNFT: "Storage Pin"
        });
        
        // Exercise 4: Arrays
        console.log("\n📦 Exercise 4: Arrays");
        const ArraysExercise = await hre.ethers.getContractFactory("ArraysExercise");
        const arraysExercise = await ArraysExercise.deploy();
        await arraysExercise.waitForDeployment();
        const arraysAddress = await arraysExercise.getAddress();
        
        console.log("✅ ArraysExercise déployé à:", arraysAddress);
        
        // Test basic functions
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        const dynamicLength = await arraysExercise.dynamicArray(0).catch(() => null);
        const fixedArray = await arraysExercise.getFixedArray();
        console.log("   📊 Fixed Array:", fixedArray.map(n => n.toString()));
        
        deployments.push({
            exercise: "ArraysExercise",
            address: arraysAddress,
            targetNFT: "Arrays Pin"
        });
        
        // Sauvegarder toutes les informations
        const allDeployments = {
            timestamp: new Date().toISOString(),
            network: hre.network.name,
            deployer: deployer.address,
            exercises: deployments,
            baseLearnTestContracts: {
                "Deploying to a Testnet": "0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F",
                "Control Structures": "0xF4D953A3976F392aA5509612DEfF395983f22a84",
                "Storage": "0x567452C6638c0D2D9778C20a3D59749FDCaa7aB3",
                "Arrays": "0x5B0F80cA6f5bD60Cc3b64F0377f336B2B2A56CdF"
            }
        };
        
        // Sauvegarder
        const deploymentsDir = './deployments/exercises';
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true });
        }
        
        const filename = `${deploymentsDir}/all-priority-exercises-${hre.network.name}.json`;
        fs.writeFileSync(filename, JSON.stringify(allDeployments, null, 2));
        
        console.log("\n" + "=".repeat(60));
        console.log("🎉 TOUS LES EXERCICES PRIORITAIRES DÉPLOYÉS!");
        console.log("💾 Informations sauvegardées:", filename);
        
        console.log("\n📋 RÉSUMÉ DES DÉPLOIEMENTS:");
        deployments.forEach((deployment, index) => {
            console.log(`${index + 1}. ${deployment.exercise}:`);
            console.log(`   📍 ${deployment.address}`);
            console.log(`   🏆 ${deployment.targetNFT}`);
            console.log(`   🔗 https://base-sepolia.blockscout.com/address/${deployment.address}`);
        });
        
        console.log("\n🎯 PROCHAINES ÉTAPES:");
        console.log("1. Vérifiez tous les contrats sur Basescan");
        console.log("2. Interagissez avec les contrats de test Base Learn:");
        console.log("   - Basic Contracts: 0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F");
        console.log("   - Control Structures: 0xF4D953A3976F392aA5509612DEfF395983f22a84");
        console.log("   - Storage: 0x567452C6638c0D2D9778C20a3D59749FDCaa7aB3");
        console.log("   - Arrays: 0x5B0F80cA6f5bD60Cc3b64F0377f336B2B2A56CdF");
        console.log("3. Continuez avec les exercices avancés (Mappings, Structs, etc.)");
        console.log("4. Explorez les modules avancés Base Learn!");
        
        console.log("\n🚀 Base Learn Exercises - Phase 1 Terminée!");
        
    } catch (error) {
        console.error("❌ Erreur lors du déploiement:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    deployAllPriorityExercises()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = deployAllPriorityExercises;
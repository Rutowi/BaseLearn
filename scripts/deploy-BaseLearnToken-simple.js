const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Déploiement du BaseLearnToken sur Base Sepolia...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("Déploiement avec:", deployer.address);
    
    const BaseLearnToken = await ethers.getContractFactory("BaseLearnToken");
    const initialSupply = ethers.parseEther("5000000"); // 5M tokens
    
    console.log("📋 Déploiement en cours...");
    const baseLearnToken = await BaseLearnToken.deploy(initialSupply, deployer.address);
    
    console.log("⏳ Attente de la confirmation...");
    await baseLearnToken.waitForDeployment();
    
    const contractAddress = await baseLearnToken.getAddress();
    console.log("✅ BaseLearnToken déployé à:", contractAddress);
    
    console.log("\n🔗 Liens utiles:");
    console.log("- BaseScan:", `https://sepolia.basescan.org/address/${contractAddress}`);
    console.log("- Vérification:", `https://sepolia.basescan.org/address/${contractAddress}#code`);
    
    console.log("\n📝 Informations de déploiement:");
    console.log("- Adresse:", contractAddress);
    console.log("- Réseau: Base Sepolia");
    console.log("- Propriétaire:", deployer.address);
    console.log("- Supply initiale: 5,000,000 BLT");
    
    // Enregistrer l'adresse dans un fichier
    const deploymentInfo = {
        contractName: "BaseLearnToken",
        address: contractAddress,
        network: "base-sepolia",
        deployer: deployer.address,
        deploymentTime: new Date().toISOString(),
        initialSupply: "5000000",
        symbol: "BLT",
        maxSupply: "1000000000"
    };
    
    // Écrire dans le fichier de déploiements
    const fs = require('fs');
    const path = require('path');
    
    const deploymentPath = path.join(__dirname, '..', 'deployments', 'BaseLearnToken-base-sepolia.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n💾 Déploiement enregistré dans:", deploymentPath);
    console.log("🎉 Déploiement terminé avec succès!");
    
    return contractAddress;
}

main()
    .then((address) => {
        console.log("\n🎯 Adresse finale:", address);
        process.exitCode = 0;
    })
    .catch((error) => {
        console.error("❌ Erreur:", error.message);
        process.exitCode = 1;
    });
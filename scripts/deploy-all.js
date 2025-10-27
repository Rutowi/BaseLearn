const { ethers } = require("hardhat");

async function main() {
  console.log("🏪 Déploiement complet de l'écosystème Base Learn...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Déploiement avec le compte :", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Solde du compte :", ethers.formatEther(balance), "ETH");
  
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Réseau :", network.name, "Chain ID :", network.chainId.toString());
  
  const deployedContracts = {};
  
  // 1. Déployer HelloWorld
  console.log("\n1️⃣ Déploiement de HelloWorld...");
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const helloWorld = await HelloWorld.deploy("Hello, Base Learn! 🚀");
  await helloWorld.waitForDeployment();
  deployedContracts.HelloWorld = await helloWorld.getAddress();
  console.log("✅ HelloWorld déployé à :", deployedContracts.HelloWorld);
  
  // 2. Déployer BaseLearnToken
  console.log("\n2️⃣ Déploiement de BaseLearnToken...");
  const BaseLearnToken = await ethers.getContractFactory("BaseLearnToken");
  const token = await BaseLearnToken.deploy();
  await token.waitForDeployment();
  deployedContracts.BaseLearnToken = await token.getAddress();
  console.log("✅ BaseLearnToken déployé à :", deployedContracts.BaseLearnToken);
  
  // 3. Déployer BaseLearnNFT
  console.log("\n3️⃣ Déploiement de BaseLearnNFT...");
  const BaseLearnNFT = await ethers.getContractFactory("BaseLearnNFT");
  const nft = await BaseLearnNFT.deploy();
  await nft.waitForDeployment();
  deployedContracts.BaseLearnNFT = await nft.getAddress();
  console.log("✅ BaseLearnNFT déployé à :", deployedContracts.BaseLearnNFT);
  
  // Interactions de test
  console.log("\n🧪 Tests d'interaction...");
  
  // Test HelloWorld
  const message = await helloWorld.getMessage();
  console.log("📢 Message HelloWorld :", message);
  
  // Test Token
  const [tokenName, tokenSymbol, , tokenSupply] = await token.getTokenInfo();
  console.log("🪙 Token :", tokenName, "(" + tokenSymbol + ")");
  console.log("💰 Supply actuelle :", ethers.formatEther(tokenSupply), "BLT");
  
  // Test NFT
  const totalNFTs = await nft.getTotalCertificates();
  console.log("🎨 Total NFTs émis :", totalNFTs.toString());
  
  // Récompenser l'utilisateur avec des tokens pour le module 1
  console.log("\n🎁 Attribution de récompense pour le module 1...");
  try {
    await token.rewardStudent(deployer.address, 1);
    const newBalance = await token.balanceOf(deployer.address);
    console.log("✅ Récompense attribuée ! Nouveau solde :", ethers.formatEther(newBalance), "BLT");
  } catch (error) {
    console.log("⚠️ Erreur lors de l'attribution de récompense :", error.message);
  }
  
  // Émettre un certificat NFT
  console.log("\n🏆 Émission de certificat NFT...");
  try {
    const tx = await nft.issueCertificate(deployer.address, 1, "Gold");
    await tx.wait();
    const newTotal = await nft.getTotalCertificates();
    console.log("✅ Certificat émis ! Total NFTs :", newTotal.toString());
  } catch (error) {
    console.log("⚠️ Erreur lors de l'émission du certificat :", error.message);
  }
  
  // Sauvegarder les informations de déploiement
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployedContracts,
    gasUsed: {
      // Ces valeurs seront approximatives
      HelloWorld: "~400,000",
      BaseLearnToken: "~1,200,000",
      BaseLearnNFT: "~2,500,000"
    }
  };
  
  const fs = require("fs");
  const filename = `deployment-${network.name}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n📋 Résumé du déploiement :");
  console.log("┌─────────────────────┬──────────────────────────────────────────────┐");
  console.log("│ Contrat             │ Adresse                                      │");
  console.log("├─────────────────────┼──────────────────────────────────────────────┤");
  console.log(`│ HelloWorld          │ ${deployedContracts.HelloWorld}   │`);
  console.log(`│ BaseLearnToken      │ ${deployedContracts.BaseLearnToken}   │`);
  console.log(`│ BaseLearnNFT        │ ${deployedContracts.BaseLearnNFT}   │`);
  console.log("└─────────────────────┴──────────────────────────────────────────────┘");
  
  console.log("\n🔍 Pour vérifier les contrats :");
  console.log(`npx hardhat verify --network ${network.name} ${deployedContracts.HelloWorld} "Hello, Base Learn! 🚀"`);
  console.log(`npx hardhat verify --network ${network.name} ${deployedContracts.BaseLearnToken}`);
  console.log(`npx hardhat verify --network ${network.name} ${deployedContracts.BaseLearnNFT}`);
  
  console.log("\n📄 Informations sauvegardées dans :", filename);
  
  console.log("\n🎉 Déploiement complet terminé ! Tu peux maintenant :");
  console.log("   • Interagir avec tes contrats sur BaseScan");
  console.log("   • Commencer les modules d'apprentissage");
  console.log("   • Développer ton frontend");
  console.log("   • Partager tes créations avec la communauté !");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement complet :", error);
    process.exit(1);
  });
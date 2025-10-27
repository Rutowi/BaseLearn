const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 Configuration de l'environnement Base Learn");
  
  // Vérifier la connexion réseau
  const provider = ethers.provider;
  const network = await provider.getNetwork();
  console.log("🌐 Réseau connecté :", network.name, "Chain ID:", network.chainId.toString());
  
  // Obtenir les comptes
  const accounts = await ethers.getSigners();
  console.log("👤 Comptes disponibles :", accounts.length);
  
  if (accounts.length > 0) {
    const deployer = accounts[0];
    console.log("📝 Compte principal :", deployer.address);
    
    // Vérifier le solde
    const balance = await provider.getBalance(deployer.address);
    console.log("💰 Solde :", ethers.formatEther(balance), "ETH");
    
    // Vérifier si on a assez d'ETH pour déployer
    const minBalance = ethers.parseEther("0.01"); // 0.01 ETH minimum
    if (balance < minBalance) {
      console.log("⚠️  ATTENTION : Solde faible ! Tu as besoin d'au moins 0.01 ETH pour déployer.");
      
      if (network.chainId === 84532n) { // Base Sepolia
        console.log("💡 Pour obtenir des ETH de test Base Sepolia :");
        console.log("   1. Va sur https://bridge.base.org/deposit");
        console.log("   2. Connecte ton wallet");
        console.log("   3. Bridge des ETH depuis Sepolia vers Base Sepolia");
      } else if (network.chainId === 11155111n) { // Sepolia
        console.log("💡 Pour obtenir des ETH de test Sepolia :");
        console.log("   1. Va sur https://sepoliafaucet.com/");
        console.log("   2. Connecte ton wallet");
        console.log("   3. Demande des ETH gratuits");
      }
    } else {
      console.log("✅ Solde suffisant pour déployer !");
    }
  }
  
  // Vérifier les variables d'environnement
  console.log("\n🔐 Vérification des variables d'environnement :");
  
  const requiredVars = [
    "PRIVATE_KEY",
    "ALCHEMY_API_KEY", 
    "BASESCAN_API_KEY"
  ];
  
  let allVarsSet = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName} : configuré`);
    } else {
      console.log(`❌ ${varName} : manquant`);
      allVarsSet = false;
    }
  });
  
  if (!allVarsSet) {
    console.log("\n⚠️  Certaines variables d'environnement sont manquantes.");
    console.log("📝 Édite le fichier .env et ajoute les valeurs manquantes.");
    console.log("📖 Voir .env.example pour un exemple de configuration.");
  }
  
  // Tester la compilation des contrats
  console.log("\n🔨 Test de compilation des contrats...");
  try {
    await hre.run("compile");
    console.log("✅ Compilation réussie !");
  } catch (error) {
    console.log("❌ Erreur de compilation :", error.message);
  }
  
  // Informations sur les contrats disponibles
  console.log("\n📄 Contrats disponibles :");
  console.log("   • HelloWorld.sol - Premier smart contract");
  console.log("   • BaseLearnToken.sol - Token ERC-20 de récompense");
  console.log("   • BaseLearnNFT.sol - Certificats NFT");
  
  console.log("\n🚀 Configuration terminée ! Tu peux maintenant :");
  console.log("   1. Compiler : npx hardhat compile");
  console.log("   2. Tester : npx hardhat test");
  console.log("   3. Déployer : npx hardhat run scripts/deploy.js --network base-sepolia");
  
  if (network.chainId === 1337n) { // Réseau local
    console.log("\n💡 Tu es sur un réseau local. Pour tester sur Base Sepolia :");
    console.log("   npx hardhat run scripts/setup.js --network base-sepolia");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur :", error);
    process.exit(1);
  });
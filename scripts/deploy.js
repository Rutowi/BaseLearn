const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Déploiement du contrat HelloWorld...");
  
  // Obtenir le compte qui déploie
  const [deployer] = await ethers.getSigners();
  console.log("📝 Déploiement avec le compte:", deployer.address);
  
  // Obtenir le solde du compte
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Solde du compte:", ethers.formatEther(balance), "ETH");
  
  // Obtenir la factory du contrat
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  
  // Déployer le contrat
  console.log("🔄 Déploiement en cours...");
  const helloWorld = await HelloWorld.deploy();
  
  // Attendre que le déploiement soit confirmé
  await helloWorld.waitForDeployment();
  
  const contractAddress = await helloWorld.getAddress();
  console.log("✅ HelloWorld déployé à l'adresse:", contractAddress);
  
  // Tester les fonctions du contrat
  console.log("🧪 Test des fonctions...");
  
  const sayHelloResult = await helloWorld.SayHello();
  console.log("📢 SayHello() retourne:", sayHelloResult);
  
  const greeterResult = await helloWorld.Greeter("Base Learn");
  console.log("� Greeter('Base Learn') retourne:", greeterResult[0], greeterResult[1]);
  
  // Afficher les informations du réseau
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Réseau:", network.name, "Chain ID:", network.chainId.toString());
  
  // Instructions pour la vérification
  console.log("\n📋 Pour vérifier le contrat, exécute:");
  console.log(`npx hardhat verify --network ${network.name} ${contractAddress}`);
  
  // Sauvegarder l'adresse du contrat
  const fs = require("fs");
  const contractInfo = {
    address: contractAddress,
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    functions: {
      SayHello: sayHelloResult,
      Greeter: "Returns tuple (string, string)"
    }
  };
  
  fs.writeFileSync(
    `deployed-contracts-${network.name}.json`,
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("💾 Informations de déploiement sauvegardées dans deployed-contracts-" + network.name + ".json");
}

// Pattern recommandé pour les scripts Hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  });
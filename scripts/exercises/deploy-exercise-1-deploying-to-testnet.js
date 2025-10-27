const hre = require("hardhat");
const fs = require('fs');

async function main() {
    console.log("🚀 Déploiement Exercise 1: Deploying to Testnet");
    console.log("🎯 Objectif: Obtenir le Basic Contracts Pin NFT");
    
    // Obtenir le signer
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying avec:", deployer.address);
    console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");
    
    try {
        // Déployer le contrat
        console.log("\n📦 Déploiement DeployingToTestnet...");
        const DeployingToTestnet = await hre.ethers.getContractFactory("DeployingToTestnet");
        const deployingToTestnet = await DeployingToTestnet.deploy();
        
        await deployingToTestnet.waitForDeployment();
        const address = await deployingToTestnet.getAddress();
        
        console.log("✅ DeployingToTestnet déployé à:", address);
        
        // Vérifier le déploiement
        console.log("\n🔍 Vérification du déploiement...");
        const message = await deployingToTestnet.greet();
        const counter = await deployingToTestnet.getCounter();
        const isDeployed = await deployingToTestnet.isDeployed();
        const validated = await deployingToTestnet.validate();
        
        console.log("📝 Message:", message);
        console.log("🔢 Counter:", counter.toString());
        console.log("✅ Is Deployed:", isDeployed);
        console.log("✅ Validated:", validated);
        
        // Tester quelques fonctions
        console.log("\n🧪 Test des fonctions...");
        
        console.log("📈 Incrémentation du counter...");
        const incrementTx = await deployingToTestnet.increment();
        await incrementTx.wait();
        const newCounter = await deployingToTestnet.getCounter();
        console.log("🔢 Nouveau counter:", newCounter.toString());
        
        console.log("✏️  Mise à jour du message...");
        const setMessageTx = await deployingToTestnet.setMessage("Hello from Base Learn Exercise!");
        await setMessageTx.wait();
        const newMessage = await deployingToTestnet.greet();
        console.log("📝 Nouveau message:", newMessage);
        
        // Sauvegarder les informations de déploiement
        const deploymentInfo = {
            contractName: "DeployingToTestnet",
            address: address,
            deployer: deployer.address,
            network: hre.network.name,
            timestamp: new Date().toISOString(),
            blockNumber: await hre.ethers.provider.getBlockNumber(),
            exerciseNumber: 1,
            targetNFT: "Basic Contracts Pin",
            testContract: "0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F",
            functions: {
                greet: newMessage,
                counter: newCounter.toString(),
                isDeployed: isDeployed,
                validate: validated
            }
        };
        
        // Créer le dossier deployments/exercises s'il n'existe pas
        const deploymentsDir = './deployments/exercises';
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true });
        }
        
        // Sauvegarder
        const filename = `${deploymentsDir}/DeployingToTestnet-${hre.network.name}.json`;
        fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        
        console.log("\n💾 Informations sauvegardées:", filename);
        
        // Instructions pour la suite
        console.log("\n🎯 PROCHAINES ÉTAPES:");
        console.log("1. Vérifiez le contrat sur Basescan:");
        console.log(`   https://base-sepolia.blockscout.com/address/${address}`);
        console.log("\n2. Testez l'interaction avec le contrat de test:");
        console.log(`   Contrat de test: 0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F`);
        console.log("\n3. Réclamez votre Basic Contracts Pin NFT");
        console.log("   via l'interface Base Learn officielle");
        
        console.log("\n✨ Déploiement Exercise 1 TERMINÉ!");
        
    } catch (error) {
        console.error("❌ Erreur lors du déploiement:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = main;
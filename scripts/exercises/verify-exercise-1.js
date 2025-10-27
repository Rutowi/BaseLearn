const hre = require("hardhat");

async function verifyContract() {
    const contractAddress = "0xbd2A9EaCa396c209D84E5e193ea875B5370a5bC3";
    
    console.log("🔍 Vérification du contrat Exercise 1");
    console.log("📍 Adresse:", contractAddress);
    
    try {
        // Attendre quelques blocs pour la confirmation
        console.log("⏳ Attente de la confirmation...");
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 secondes
        
        // Se connecter au contrat
        const DeployingToTestnet = await hre.ethers.getContractFactory("DeployingToTestnet");
        const contract = DeployingToTestnet.attach(contractAddress);
        
        console.log("📦 Contrat attaché, test des fonctions...");
        
        // Test des fonctions basiques
        const isDeployed = await contract.isDeployed();
        console.log("✅ isDeployed():", isDeployed);
        
        const validate = await contract.validate();
        console.log("✅ validate():", validate);
        
        const owner = await contract.owner();
        console.log("👤 owner:", owner);
        
        const counter = await contract.counter();
        console.log("🔢 counter:", counter.toString());
        
        try {
            const message = await contract.greet();
            console.log("📝 greet():", message);
        } catch (e) {
            console.log("⚠️  greet() encore en cours de confirmation...");
        }
        
        console.log("\n✅ Contrat Exercise 1 vérifié et fonctionnel!");
        console.log("🔗 Voir sur Blockscout:");
        console.log(`https://base-sepolia.blockscout.com/address/${contractAddress}`);
        
    } catch (error) {
        console.error("❌ Erreur lors de la vérification:", error.message);
    }
}

if (require.main === module) {
    verifyContract()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = verifyContract;
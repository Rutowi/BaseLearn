const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Déploiement du BaseLearnToken...\n");
    
    // Get signers
    const [deployer] = await ethers.getSigners();
    
    console.log("Déploiement avec le compte:", deployer.address);
    console.log("Solde du compte:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");
    
    // Deploy BaseLearnToken
    const BaseLearnToken = await ethers.getContractFactory("BaseLearnToken");
    const initialSupply = ethers.parseEther("5000000"); // 5M tokens
    
    console.log("📋 Paramètres de déploiement:");
    console.log("- Supply initiale:", ethers.formatEther(initialSupply), "BLT");
    console.log("- Propriétaire:", deployer.address);
    console.log("- Max supply:", ethers.formatEther(ethers.parseEther("1000000000")), "BLT\n");
    
    const baseLearnToken = await BaseLearnToken.deploy(initialSupply, deployer.address);
    await baseLearnToken.waitForDeployment();
    
    const contractAddress = await baseLearnToken.getAddress();
    
    console.log("✅ BaseLearnToken déployé à l'adresse:", contractAddress);
    
    // Verify deployment
    console.log("\n📊 Vérification du déploiement:");
    console.log("- Nom:", await baseLearnToken.name());
    console.log("- Symbole:", await baseLearnToken.symbol());
    console.log("- Décimales:", await baseLearnToken.decimals());
    console.log("- Total Supply:", ethers.formatEther(await baseLearnToken.totalSupply()), "BLT");
    console.log("- Max Supply:", ethers.formatEther(await baseLearnToken.MAX_SUPPLY()), "BLT");
    console.log("- Propriétaire:", await baseLearnToken.owner());
    console.log("- Balance propriétaire:", ethers.formatEther(await baseLearnToken.balanceOf(deployer.address)), "BLT");
    
    // Test some functions
    console.log("\n🧪 Tests des fonctionnalités:");
    
    // Get user data
    const userData = await baseLearnToken.getUserData(deployer.address);
    console.log("- Données utilisateur:", {
        balance: ethers.formatEther(userData[0]),
        stakedAmount: ethers.formatEther(userData[1]),
        lastAction: userData[2].toString(),
        points: userData[3].toString(),
        isVip: userData[4]
    });
    
    // Set VIP status
    console.log("\n🎭 Test du système VIP:");
    await baseLearnToken.setVipStatus(deployer.address, true);
    const updatedUserData = await baseLearnToken.getUserData(deployer.address);
    console.log("- Statut VIP mis à jour:", updatedUserData[4]);
    
    // Test mint function
    console.log("\n💰 Test de mint:");
    const mintAmount = ethers.parseEther("1000");
    await baseLearnToken.mint(deployer.address, mintAmount);
    console.log("- Nouveau solde après mint:", ethers.formatEther(await baseLearnToken.balanceOf(deployer.address)), "BLT");
    
    console.log("\n🎉 Déploiement et tests terminés avec succès!");
    console.log("📝 Adresse du contrat:", contractAddress);
    
    return {
        baseLearnToken: contractAddress,
        name: await baseLearnToken.name(),
        symbol: await baseLearnToken.symbol(),
        totalSupply: ethers.formatEther(await baseLearnToken.totalSupply()),
        owner: deployer.address
    };
}

main()
    .then((result) => {
        console.log("\n📋 Résumé du déploiement:");
        console.log("- Contrat:", result.baseLearnToken);
        console.log("- Token:", result.name, `(${result.symbol})`);
        console.log("- Supply:", result.totalSupply, "tokens");
        console.log("- Propriétaire:", result.owner);
        process.exitCode = 0;
    })
    .catch((error) => {
        console.error("❌ Erreur lors du déploiement:", error);
        process.exitCode = 1;
    });
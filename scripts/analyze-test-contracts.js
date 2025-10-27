// Script d'analyse des contrats de test Base Learn
// Analyse du contrat: Deploying to a Testnet - 0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F

const { ethers } = require("hardhat");

async function analyzeTestContract() {
    console.log("🔍 Analyse du contrat de test: Deploying to a Testnet");
    console.log("📍 Adresse:", "0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F");
    
    // Se connecter au contrat
    const provider = new ethers.JsonRpcProvider("https://base-sepolia.g.alchemy.com/v2/Bc5wVGuoVuIsRJ4CBNh_f");
    
    try {
        // Obtenir le code du contrat
        const code = await provider.getCode("0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F");
        console.log("✅ Contrat trouvé, taille du bytecode:", code.length);
        
        // Essayer d'interagir avec des méthodes communes
        const contract = new ethers.Contract(
            "0x075eB9Dc52177Aa3492E1D26f0fDE3d729625d2F",
            [
                "function name() view returns (string)",
                "function symbol() view returns (string)", 
                "function test() view returns (bool)",
                "function validate(address) view returns (bool)",
                "function setUp() external",
                "function testBasicContract() external"
            ],
            provider
        );
        
        // Tenter d'appeler les fonctions courantes
        try {
            const name = await contract.name();
            console.log("📛 Nom:", name);
        } catch (e) {
            console.log("❌ Pas de fonction name()");
        }
        
        try {
            const symbol = await contract.symbol();
            console.log("🏷️  Symbol:", symbol);
        } catch (e) {
            console.log("❌ Pas de fonction symbol()");
        }
        
    } catch (error) {
        console.error("❌ Erreur:", error.message);
    }
}

if (require.main === module) {
    analyzeTestContract()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { analyzeTestContract };
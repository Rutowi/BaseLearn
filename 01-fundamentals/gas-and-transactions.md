# Gas et Transactions Ethereum ⛽

## Qu'est-ce que le Gas ?

Le **gas** est l'unité de mesure du travail de calcul nécessaire pour exécuter des opérations sur la blockchain Ethereum (et Base). C'est le "carburant" qui fait tourner la machine virtuelle Ethereum.

## 🔧 Analogie simple

Imagine la blockchain comme une **voiture** :
- **Gas** = Carburant nécessaire pour faire tourner le moteur
- **Gas Price** = Prix du carburant par litre
- **Gas Limit** = Taille du réservoir
- **Gas Used** = Carburant réellement consommé
- **Transaction Fee** = Gas Used × Gas Price

## ⚡ Pourquoi le gas existe-t-il ?

### 1. Prévention du spam
Sans gas, n'importe qui pourrait envoyer des millions de transactions gratuites et surcharger le réseau.

### 2. Limitation des boucles infinies
Le gas empêche les smart contracts de tourner indéfiniment et de bloquer le réseau.

### 3. Allocation des ressources
Le gas crée un marché pour l'espace de bloc - ceux qui paient plus sont prioritaires.

### 4. Rémunération des mineurs/validateurs
Les frais de gas compensent ceux qui sécurisent le réseau.

## 📊 Composants d'une transaction

### Structure de transaction
```
Transaction = {
  to: "0x...",           // Adresse de destination
  value: "1000000000",   // Montant en wei
  gasLimit: 21000,       // Gas maximum autorisé
  gasPrice: 20000000000, // Prix du gas en wei
  data: "0x...",         // Données (pour smart contracts)
  nonce: 42              // Numéro de séquence
}
```

### Calcul du coût total
```
Coût total = Gas Used × Gas Price
```

**Exemple :**
- Gas Used: 21,000 (transaction simple)
- Gas Price: 20 Gwei (20,000,000,000 wei)
- Coût total: 21,000 × 20,000,000,000 = 420,000,000,000,000 wei = 0.00042 ETH

## 🏗️ Gas selon le type d'opération

### Opérations de base
| Opération | Gas requis |
|-----------|------------|
| Transaction simple | 21,000 |
| Création de contrat | 32,000 + code |
| Stockage (SSTORE) | 20,000 (nouveau) / 5,000 (modification) |
| Lecture (SLOAD) | 2,100 |
| Addition (ADD) | 3 |
| Multiplication (MUL) | 5 |
| Hachage (KECCAK256) | 30 + 6/mot |

### Smart Contracts complexes
```solidity
// Fonction simple : ~23,000 gas
function setNumber(uint256 _number) public {
    number = _number;
}

// Fonction avec boucle : gas × nombre d'itérations
function setMultipleNumbers(uint256[] memory _numbers) public {
    for(uint i = 0; i < _numbers.length; i++) {
        numbers[i] = _numbers[i]; // ~20,000 gas par itération
    }
}
```

## 💰 Types de pricing du gas

### 1. Legacy (avant EIP-1559)
```
Transaction Fee = Gas Used × Gas Price
```

### 2. EIP-1559 (actuel)
```
Transaction Fee = Gas Used × (Base Fee + Priority Fee)
```

**Composants :**
- **Base Fee :** Prix de base dynamique, brûlé
- **Priority Fee (tip) :** Pourboire pour le mineur
- **Max Fee :** Maximum que tu es prêt à payer

## 🎯 Stratégies d'optimisation du gas

### 1. Optimisation du code Solidity

#### ❌ Code non-optimisé
```solidity
contract Inefficient {
    uint256[] public numbers;
    
    function addNumbers(uint256[] memory _numbers) public {
        for(uint i = 0; i < _numbers.length; i++) {
            numbers.push(_numbers[i]); // Storage write à chaque fois
        }
    }
}
```

#### ✅ Code optimisé
```solidity
contract Efficient {
    uint256[] public numbers;
    
    function addNumbers(uint256[] memory _numbers) public {
        uint256 length = _numbers.length; // Cache la longueur
        for(uint i = 0; i < length; i++) {
            numbers.push(_numbers[i]);
        }
    }
    
    // Encore mieux : batch operations
    function addNumbersBatch(uint256[] memory _numbers) public {
        for(uint i = 0; i < _numbers.length; i++) {
            numbers.push(_numbers[i]);
        }
    }
}
```

### 2. Types de données optimaux
```solidity
// ❌ Gaspillage de storage
struct User {
    bool isActive;     // 1 bit mais occupe 32 bytes
    uint256 id;        // 32 bytes
    bool isPremium;    // 1 bit mais occupe 32 bytes
}

// ✅ Storage optimisé
struct User {
    uint256 id;        // 32 bytes
    bool isActive;     // 1 bit
    bool isPremium;    // 1 bit - packés ensemble dans le même slot
}
```

### 3. Utilisation des events
```solidity
// ❌ Stockage coûteux
mapping(address => uint256[]) public userTransactions;

// ✅ Events moins chers
event Transaction(address indexed user, uint256 amount, uint256 timestamp);

function makeTransaction(uint256 amount) public {
    // Logique métier...
    emit Transaction(msg.sender, amount, block.timestamp);
}
```

## 🌐 Gas sur différents réseaux

### Ethereum Mainnet
- **Gas Price :** 15-100+ Gwei (variable selon congestion)
- **Transaction simple :** $5-50+
- **Smart contract :** $20-200+

### Base (Layer 2)
- **Gas Price :** ~0.001 Gwei
- **Transaction simple :** ~$0.01
- **Smart contract :** ~$0.05-0.50

### Pourquoi Base est moins cher ?
1. **Batch transactions :** Plusieurs transactions groupées
2. **Optimistic rollup :** Validation off-chain
3. **Moins de congestion :** Réseau plus récent

## 🛠️ Outils pour monitorer le gas

### 1. Gas Trackers
- [ETH Gas Station](https://ethgasstation.info/)
- [Gas Now](https://www.gasnow.org/)
- [Base Gas Tracker](https://basescan.org/gastracker)

### 2. Calculateurs
```javascript
// Estimation avec ethers.js
const gasEstimate = await contract.estimateGas.myFunction(param1, param2);
const gasPrice = await provider.getGasPrice();
const totalCost = gasEstimate.mul(gasPrice);
```

### 3. Profilers de smart contracts
- Hardhat gas reporter
- Remix gas profiler
- Tenderly simulator

## 📈 Exemple concret : DeFi Transaction

```solidity
// Transaction Uniswap swap
function swapExactETHForTokens(
    uint amountOutMin,
    address[] calldata path,
    address to,
    uint deadline
) external payable {
    // Gas breakdown approximatif :
    // - Transaction base : 21,000
    // - Calculs de swap : ~50,000
    // - Storage updates : ~40,000
    // - Events : ~2,000
    // - Total : ~113,000 gas
}
```

**Coût sur différents réseaux :**
- **Ethereum (50 Gwei) :** 113,000 × 50 × 10⁻⁹ × $2000 = $11.30
- **Base (0.001 Gwei) :** 113,000 × 0.001 × 10⁻⁹ × $2000 = $0.0002

## 🎓 Exercices pratiques

### Exercice 1 : Calculateur de gas
Calcule le coût d'une transaction avec :
- Gas used: 45,000
- Gas price: 25 Gwei
- Prix ETH: $2,000

### Exercice 2 : Optimisation
Identifie les problèmes dans ce contrat :
```solidity
contract Quiz {
    uint256[] public data;
    
    function process(uint256[] memory input) public {
        for(uint256 i = 0; i < input.length; i++) {
            data.push(input[i] * 2);
        }
    }
}
```

### Exercice 3 : Comparaison de réseaux
Compare le coût d'un swap de 1 ETH vers USDC sur :
1. Ethereum mainnet
2. Base
3. Calcule les économies en pourcentage

## 🔗 Ressources avancées

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) - Spécifications techniques
- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Nouveau modèle de pricing
- [Gas Optimization Patterns](https://github.com/dragonfly-xyz/useful-solidity-patterns)
- [Base Fee Calculator](https://basescan.org/chart/basefee)

---

**💡 Conseil pratique :** Toujours tester sur un testnet d'abord ! Le gas sur testnet est gratuit et te permet d'expérimenter sans risque financier.
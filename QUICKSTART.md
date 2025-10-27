# 🚀 Guide de Démarrage Rapide - Base Learn

## ⚡ Installation Express (5 minutes)

### 1. Prérequis
```bash
# Vérifier Node.js (version 16+)
node --version

# Si pas installé, télécharger depuis https://nodejs.org/
```

### 2. Installation des dépendances
```bash
cd /Users/achillebesnard/BaseLearn
npm install
```

### 3. Configuration de l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec tes propres clés
nano .env
```

**Variables importantes à configurer :**
```bash
# Obtenir une clé API Alchemy (gratuit)
ALCHEMY_API_KEY=your_alchemy_key_here

# Ta clé privée (TESTNET UNIQUEMENT!)
PRIVATE_KEY=your_private_key_here

# Clé API BaseScan pour la vérification
BASESCAN_API_KEY=your_basescan_key_here
```

## 🧪 Premier Test (2 minutes)

### 1. Compiler les contrats
```bash
npx hardhat compile
```

### 2. Lancer les tests
```bash
npx hardhat test
```

### 3. Déployer sur réseau local
```bash
# Terminal 1 : Démarrer un nœud local
npx hardhat node

# Terminal 2 : Déployer
npx hardhat run scripts/deploy.js --network localhost
```

## 🌐 Déploiement sur Base Sepolia

### 1. Obtenir des ETH de test
- Va sur [Base Sepolia Faucet](https://bridge.base.org/deposit)
- Connecte ton wallet
- Demande des ETH gratuits

### 2. Déployer
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

### 3. Vérifier le contrat
```bash
npx hardhat verify --network base-sepolia ADRESSE_DU_CONTRAT "Hello, Base! Bienvenue dans le monde des smart contracts! 🎉"
```

## 📖 Parcours d'Apprentissage Recommandé

### Semaine 1 : Fondamentaux
1. 📚 Lire `01-fundamentals/ethereum-applications.md`
2. ⛽ Comprendre `01-fundamentals/gas-and-transactions.md`
3. 🧪 Tester le contrat HelloWorld
4. 🎯 **Objectif :** Comprendre les bases de la blockchain

### Semaine 2 : Outils de Développement
1. 🔧 Configurer Hardhat complètement
2. 📝 Écrire des tests pour HelloWorld
3. 🚀 Déployer sur Base Sepolia
4. 🎯 **Objectif :** Maîtriser l'environnement de dev

### Semaine 3 : Solidity Avancé
1. 📊 Apprendre les types de données
2. 🏗️ Structures de contrôle
3. 💾 Gestion du stockage
4. 🎯 **Objectif :** Coder en Solidity avec confiance

### Semaine 4 : Tokens
1. 🪙 Créer un token ERC-20
2. 🎨 Créer des NFTs ERC-721
3. 🎁 Système de récompenses
4. 🎯 **Objectif :** Maîtriser l'économie token

### Semaine 5-8 : Projets Pratiques
1. 🗳️ Système de vote
2. 🏪 Marketplace NFT
3. 💰 Protocole DeFi simple
4. 🎯 **Objectif :** Construire des apps complètes

## 🛠️ Commandes Utiles

### Développement
```bash
# Compiler
npm run build

# Tester
npm run test

# Coverage des tests
npm run test:coverage

# Nettoyage
npm run clean
```

### Déploiement
```bash
# Base Sepolia (testnet)
npm run deploy:base-sepolia

# Ethereum Sepolia
npm run deploy:sepolia

# Vérification
npm run verify
```

### Frontend
```bash
# Développement frontend
npm run frontend:dev

# Build production frontend
npm run frontend:build
```

## 🎯 Checklist du Débutant

### ✅ Configuration
- [ ] Node.js installé
- [ ] Repository cloné
- [ ] Dépendances installées
- [ ] Fichier .env configuré
- [ ] Wallet configuré avec Base Sepolia

### ✅ Premier contrat
- [ ] HelloWorld compilé
- [ ] Tests passent
- [ ] Déployé sur localhost
- [ ] Déployé sur Base Sepolia
- [ ] Contrat vérifié sur BaseScan

### ✅ Compréhension
- [ ] Qu'est-ce qu'un smart contract
- [ ] Comment fonctionne le gas
- [ ] Différence Web2 vs Web3
- [ ] Comment lire BaseScan

## 🆘 Problèmes Fréquents

### ❌ "Cannot find module"
```bash
# Solution : Installer les dépendances
npm install
```

### ❌ "Insufficient funds"
```bash
# Solution : Obtenir des ETH de test
# Aller sur https://bridge.base.org/deposit
```

### ❌ "Network not supported"
```bash
# Solution : Ajouter Base Sepolia à MetaMask
# Network: Base Sepolia
# RPC: https://sepolia.base.org
# Chain ID: 84532
```

### ❌ "Private key invalid"
```bash
# Solution : Exporter la clé privée depuis MetaMask
# MetaMask > Compte > Exporter la clé privée
# ⚠️ UNIQUEMENT pour testnet !
```

## 📞 Obtenir de l'Aide

### 💬 Communauté
- [Discord Base](https://discord.gg/buildonbase)
- [Forum Ethereum](https://ethereum-magicians.org/)
- [Stack Exchange](https://ethereum.stackexchange.com/)

### 📚 Documentation
- [Base Docs](https://docs.base.org/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Solidity Docs](https://docs.soliditylang.org/)

### 🎥 Vidéos
- [Patrick Collins](https://www.youtube.com/c/PatrickCollins)
- [Dapp University](https://www.youtube.com/c/DappUniversity)

## 🎉 Prochaines Étapes

Une fois ce guide terminé :

1. **Explore les modules** dans l'ordre numérique
2. **Fait les exercices** de chaque module
3. **Construis les projets** pratiques
4. **Partage tes créations** avec la communauté
5. **Aide d'autres débutants** - enseigner renforce l'apprentissage

---

**🚀 Prêt à devenir un développeur Base ? Let's BUIDL ! 🔨**
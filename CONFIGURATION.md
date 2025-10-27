# 🔑 Guide de Configuration des Clés - Base Learn

## 1. Configuration du Wallet MetaMask

### Installer MetaMask
1. Va sur [metamask.io](https://metamask.io/)
2. Télécharge l'extension pour ton navigateur
3. Crée un nouveau wallet OU importe un existant
4. **⚠️ IMPORTANT :** Sauvegarde ta phrase de récupération en sécurité !

### Ajouter le réseau Base Sepolia
1. Ouvre MetaMask
2. Clique sur le menu réseau en haut
3. Clique "Ajouter un réseau"
4. Clique "Ajouter un réseau manuellement"
5. Entre ces informations :
   - **Nom du réseau :** Base Sepolia
   - **URL RPC :** https://sepolia.base.org
   - **ID de chaîne :** 84532
   - **Symbole monétaire :** ETH
   - **URL de l'explorateur de blocs :** https://sepolia.basescan.org

## 2. Obtenir ta Clé Privée (TESTNET UNIQUEMENT!)

### ⚠️ RÈGLES DE SÉCURITÉ IMPORTANTES :
- **JAMAIS** utiliser ta clé privée principale
- **SEULEMENT** pour les testnets
- Crée un wallet dédié aux tests
- Ne stocke JAMAIS de vrais fonds sur ce wallet

### Étapes :
1. Dans MetaMask, crée un **nouveau compte** dédié aux tests
2. Clique sur les 3 points → "Détails du compte"
3. Clique "Exporter la clé privée"
4. Entre ton mot de passe MetaMask
5. **COPIE** la clé privée (commence par 0x...)

## 3. Obtenir des ETH Gratuits sur Base Sepolia

### Option 1 : Bridge depuis Sepolia
1. Va sur [bridge.base.org](https://bridge.base.org/deposit)
2. Sélectionne "Sepolia" → "Base Sepolia"
3. Connecte ton wallet
4. Bridge au minimum 0.01 ETH

### Option 2 : Faucet Sepolia puis Bridge
1. Va sur [sepoliafaucet.com](https://sepoliafaucet.com/)
2. Entre ton adresse wallet de test
3. Demande des ETH gratuits
4. Puis utilise le bridge ci-dessus

## 4. Obtenir les Clés API

### Alchemy (Recommandé)
1. Va sur [alchemy.com](https://alchemy.com/)
2. Crée un compte gratuit
3. Crée une nouvelle app
4. Sélectionne "Base Sepolia"
5. Copie ta clé API

### BaseScan (pour vérification)
1. Va sur [basescan.org](https://basescan.org/)
2. Crée un compte
3. Va dans "API Keys"
4. Génère une nouvelle clé
5. Copie la clé API

## 5. Configuration du fichier .env

Maintenant, édite ton fichier `.env` avec tes vraies valeurs :

```bash
# Clés API
ALCHEMY_API_KEY=ton_alchemy_key_ici
BASESCAN_API_KEY=ta_basescan_key_ici

# Clé privée (TESTNET UNIQUEMENT!)
PRIVATE_KEY=0xta_cle_privee_de_test_ici

# URLs (remplace ton_alchemy_key par ta vraie clé)
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/Bc5wVGuoVuIsRJ4CBNh_f
```

## 6. Vérification

Une fois configuré, teste avec :
```bash
npx hardhat compile
npx hardhat run scripts/setup.js --network base-sepolia
```

---

**🚨 RAPPEL SÉCURITÉ :**
- Cette clé privée est SEULEMENT pour les tests
- N'y stocke JAMAIS de vrais fonds
- Ne la partage avec PERSONNE
- Crée un wallet séparé pour les tests
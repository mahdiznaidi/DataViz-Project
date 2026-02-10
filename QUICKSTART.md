# 🚀 Guide de Démarrage Rapide - AutoViz LLM Web

## 🎯 Lancement en 30 Secondes

### Méthode 1 : Python (recommandé)
```bash
cd autoviz-web
python -m http.server 8000
```
Ouvrez : http://localhost:8000

### Méthode 2 : Node.js
```bash
cd autoviz-web
npx http-server -p 8000
```
Ouvrez : http://localhost:8000

### Méthode 3 : PHP
```bash
cd autoviz-web
php -S localhost:8000
```
Ouvrez : http://localhost:8000

### Méthode 4 : Extension VS Code
1. Installez "Live Server" extension
2. Right-click sur `index.html`
3. "Open with Live Server"

## ⚡ Premier Graphique (Mode Offline)

1. **Lancez l'application**
   ```bash
   python -m http.server 8000
   ```

2. **Ouvrez le navigateur**
   - Allez sur http://localhost:8000
   
3. **Activez le mode offline**
   - Cliquez sur "Config" (en haut à droite)
   - Cochez "Mode Offline"
   - Cliquez "Sauvegarder"

4. **Testez avec les données incluses**
   - Faites défiler vers le bas
   - Glissez-déposez `test_data.csv`
   - Problématique : "Comment évoluent les ventes par région ?"
   - Cliquez "Générer 3 propositions"

5. **Admirez le résultat !**
   - 3 propositions apparaissent
   - Cliquez sur celle qui vous plaît
   - Exportez en PNG si besoin

✅ **Total : 2 minutes !**

## 🔑 Avec API (Mode Online)

### OpenRouter (Recommandé - Gratuit pour tester)

1. **Obtenez une clé API**
   - Allez sur https://openrouter.ai
   - Créez un compte
   - Générez une clé API

2. **Configurez l'application**
   - Cliquez sur "Config"
   - Base URL : `https://openrouter.ai/api/v1`
   - API Key : Votre clé
   - Modèle : `openai/gpt-4o-mini`
   - Décochez "Mode Offline"
   - Sauvegardez

3. **Testez**
   - Chargez votre CSV
   - Écrivez votre problématique
   - Générez !

### OpenAI (Plus puissant)

1. **Clé API OpenAI**
   - https://platform.openai.com/api-keys
   
2. **Configuration**
   - Base URL : `https://api.openai.com/v1`
   - API Key : Votre clé sk-...
   - Modèle : `gpt-4o-mini` ou `gpt-4o`

## 📊 Types de Données Supportés

### ✅ Formats CSV Valides

**Données de ventes :**
```csv
date,region,produit,ventes,cout
2024-01-01,Nord,A,1200,800
2024-01-02,Sud,B,950,600
```

**Données médicales :**
```csv
age,poids,taille,tension,diabete
45,75,170,120,Non
52,82,165,140,Oui
```

**Données financières :**
```csv
trimestre,revenus,depenses,profit,categorie
Q1-2024,50000,30000,20000,Tech
Q2-2024,55000,32000,23000,Tech
```

### ❌ Formats Non Supportés

- Excel (.xlsx) - Convertissez en CSV d'abord
- JSON - Utilisez un convertisseur en ligne
- XML - Convertissez en CSV
- Fichiers > 10MB - Réduisez la taille

## 🎨 Exemples de Problématiques

### 📈 Business & Ventes
```
Comment les ventes évoluent-elles par région au fil du temps ?
Quel produit génère le plus de profit par trimestre ?
Y a-t-il une saisonnalité dans nos ventes ?
```

### 🔬 Science & Recherche
```
Quelle est la corrélation entre température et croissance ?
Comment les variables indépendantes influencent le résultat ?
Y a-t-il des outliers dans les mesures ?
```

### 💰 Finance
```
Comment le portefeuille performe-t-il vs le marché ?
Quels actifs présentent le meilleur ratio risque/rendement ?
Y a-t-il des patterns dans les volumes de trading ?
```

### 👥 RH & Social
```
Comment la satisfaction évolue-t-elle par département ?
Y a-t-il des différences de performance entre équipes ?
Quels facteurs influencent le turnover ?
```

## 🚀 Déploiement en Ligne (Gratuit)

### Netlify - 2 Minutes

1. Allez sur https://app.netlify.com
2. Drag & drop le dossier `autoviz-web`
3. Attendez 30 secondes
4. ✅ Votre app est en ligne !

URL : `https://votre-app.netlify.app`

### GitHub Pages - 5 Minutes

```bash
# Dans votre terminal
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Activer GitHub Pages dans Settings
```

URL : `https://username.github.io/repo/`

### Vercel - 3 Minutes

```bash
npm i -g vercel
cd autoviz-web
vercel
```

## 🎯 Checklist de Vérification

Avant de commencer :

- [ ] Navigateur moderne (Chrome, Firefox, Safari, Edge)
- [ ] Serveur local configuré OU déployé en ligne
- [ ] Fichier CSV prêt (format valide, < 10MB)
- [ ] Mode offline activé OU clé API configurée

Si mode online :
- [ ] Clé API valide
- [ ] Base URL correcte
- [ ] Modèle disponible
- [ ] Connexion internet stable

## 🆘 Problèmes Courants

### ❌ "Le fichier ne se charge pas"
**Cause :** Ouvert en file:// au lieu de http://  
**Solution :** Lancez un serveur local

### ❌ "Erreur API 401"
**Cause :** Clé API invalide ou expirée  
**Solution :** Vérifiez votre clé dans la config

### ❌ "Timeout"
**Cause :** Serveur API lent  
**Solution :** Réessayez ou passez en mode offline

### ❌ "Le graphique est vide"
**Cause :** Données incompatibles  
**Solution :** Vérifiez que votre CSV a des colonnes numériques

## 💡 Astuces Pro

1. **Sauvegardez votre config** : Elle reste dans le navigateur
2. **Testez en offline d'abord** : Pour valider vos données
3. **Problématiques précises** : Meilleurs résultats avec l'IA
4. **Nettoyez vos CSV** : Pas de colonnes vides
5. **Utilisez les exemples** : Pour comprendre les formats

## 📚 Ressources

- **Documentation Vega-Lite** : https://vega.github.io/vega-lite/
- **OpenRouter Docs** : https://openrouter.ai/docs
- **CSV to JSON** : https://csvjson.com/
- **Générateur de données** : https://www.mockaroo.com/

## 🎓 Prochaines Étapes

1. ✅ Suivez ce guide
2. ✅ Testez avec vos propres données
3. ✅ Explorez les 3 propositions à chaque fois
4. ✅ Exportez vos meilleurs graphiques
5. ✅ Déployez en ligne pour partager

## ❓ Questions ?

- GitHub Issues : Pour bugs
- Email : mehdi@example.com
- README : Documentation complète

---

**Bon Data Viz ! 📊✨**

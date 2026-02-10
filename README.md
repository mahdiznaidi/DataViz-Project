# 📊 AutoViz LLM - Web Application

**Interface web moderne pour la génération intelligente de visualisations de données**

Une application HTML/CSS/JavaScript pure, sans dépendances backend, qui utilise des LLM pour générer automatiquement des propositions de visualisations pertinentes.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## ✨ Caractéristiques

### 🎨 Design Unique
- Interface moderne avec design brutalist et néomorphique
- Animations fluides et micro-interactions
- Thème sombre avec accents néon
- Typographie distinctive (Syne + Space Mono)
- Responsive design pour mobile et desktop

### ⚡ Fonctionnalités
- **Chargement CSV** : Drag & drop ou sélection de fichiers
- **Analyse IA** : Génération de 3 propositions via LLM
- **Mode Offline** : Fonctionne sans API pour tests rapides
- **Visualisations interactives** : Basées sur Vega-Lite
- **Export PNG** : Haute qualité directement depuis le navigateur
- **Configuration flexible** : Support OpenRouter, OpenAI, etc.

### 🚀 Avantages vs Version Streamlit
- ✅ Pas de serveur Python requis
- ✅ Déploiement sur n'importe quel hébergement web
- ✅ Interface plus rapide et réactive
- ✅ Design moderne et professionnel
- ✅ Fonctionne hors ligne (mode offline)

## 📦 Structure du Projet

```
autoviz-web/
├── index.html          # Page principale
├── styles.css          # Styles (design unique)
├── app.js              # Logique applicative
├── config.json.example # Template de configuration
├── README.md           # Documentation
└── test_data.csv       # Données de test
```

## 🚀 Installation & Utilisation

### Option 1 : Serveur Local Simple

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000`

### Option 2 : Ouvrir Directement (limitations CORS)

Double-cliquez sur `index.html` dans votre navigateur.

**Note :** Certaines fonctionnalités (chargement CSV) peuvent nécessiter un serveur local.

### Option 3 : Déployer en Ligne

Déployez sur n'importe quel hébergement statique :

- **Netlify** : Drag & drop le dossier
- **Vercel** : `vercel deploy`
- **GitHub Pages** : Push vers gh-pages branch
- **Cloudflare Pages** : Connexion GitHub automatique

## ⚙️ Configuration

### 1. Configuration API (pour mode online)

Cliquez sur "Config" dans la navigation et remplissez :

- **Base URL** : `https://openrouter.ai/api/v1` (OpenRouter) ou `https://api.openai.com/v1` (OpenAI)
- **API Key** : Votre clé API
- **Modèle** : `openai/gpt-4o-mini` ou autre

La configuration est sauvegardée dans le localStorage du navigateur.

### 2. Mode Offline

Activez le mode offline pour des propositions génériques sans API :
- Cliquez sur "Config"
- Cochez "Mode Offline"
- Sauvegardez

Parfait pour tester l'application ou quand vous n'avez pas de clé API.

## 🎯 Guide d'Utilisation

### Workflow Standard

1. **Chargez vos données**
   - Glissez-déposez votre CSV
   - Ou cliquez pour parcourir
   - Aperçu automatique des données

2. **Décrivez votre analyse**
   - Écrivez votre question/problématique
   - Utilisez les exemples pour inspiration
   - Cliquez "Générer 3 propositions"

3. **Choisissez votre visualisation**
   - Comparez les 3 propositions
   - Cliquez sur celle qui vous convient
   - Visualisation interactive instantanée

4. **Exportez**
   - Copiez la spécification Vega-Lite
   - Ou exportez en PNG haute qualité

### Exemples de Problématiques

**Exploratoires :**
```
Quelles sont les principales tendances dans mes données ?
Y a-t-il des outliers ou anomalies visibles ?
```

**Comparatives :**
```
Comment les ventes diffèrent-elles entre les régions ?
Quel produit performe le mieux sur chaque marché ?
```

**Temporelles :**
```
Comment la performance évolue-t-elle dans le temps ?
Y a-t-il des patterns saisonniers ou cycliques ?
```

**Relationnelles :**
```
Quelle est la corrélation entre prix et qualité ?
Quels facteurs influencent le plus les résultats ?
```

## 🎨 Personnalisation

### Modifier les Couleurs

Dans `styles.css`, section `:root` :

```css
:root {
    --color-primary: #00ffaa;      /* Vert néon */
    --color-secondary: #ff00aa;     /* Rose néon */
    --color-accent: #ffcc00;        /* Jaune */
}
```

### Modifier les Fonts

Dans `index.html`, section `<head>` :

```html
<link href="https://fonts.googleapis.com/css2?family=VotreFont&display=swap" rel="stylesheet">
```

Puis dans `styles.css` :

```css
:root {
    --font-display: 'VotreFont', sans-serif;
}
```

### Ajouter des Types de Graphiques

Dans `app.js`, ajoutez dans `generateOfflineProposals()` :

```javascript
{
    id: 'p4',
    title: 'Votre Nouveau Type',
    chartType: 'nouveau',
    reasoning: 'Description...',
    bestPractices: ['...'],
    spec: createNouveauSpec(...)
}
```

## 🔧 Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Animations et design moderne
- **JavaScript** : Logique applicative pure (ES6+)

### Bibliothèques (CDN)
- **Vega** : Grammaire de visualisation
- **Vega-Lite** : Visualisations déclaratives
- **Vega-Embed** : Intégration dans le DOM
- **PapaParse** : Parsing CSV côté client

### Fonts
- **Syne** : Titres (Google Fonts)
- **Space Mono** : Corps de texte (Google Fonts)

## 📊 Compatibilité

### Navigateurs Supportés
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Appareils
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablettes (iPad, Android)
- ✅ Mobiles (iOS, Android)

## 🐛 Résolution de Problèmes

### Le CSV ne se charge pas
**Solution :** Lancez avec un serveur local (pas en file://)

### "Erreur API"
**Solution :** 
- Vérifiez votre clé API dans Config
- Vérifiez le format de l'URL de base
- Ou activez le mode offline

### Le graphique ne s'affiche pas
**Solution :**
- Vérifiez la console JavaScript (F12)
- Essayez une autre proposition
- Rechargez la page

### Export PNG ne fonctionne pas
**Solution :**
- Certains bloqueurs de popup peuvent interférer
- Essayez dans une fenêtre de navigation privée

## 🆚 Comparaison avec Streamlit

| Aspect | Streamlit | Web App |
|--------|-----------|---------|
| **Installation** | Python + deps | Aucune |
| **Serveur** | Requis | Optionnel |
| **Performance** | Moyenne | Excellente |
| **Design** | Standard | Unique/Moderne |
| **Déploiement** | Complexe | Simple |
| **Offline** | Non | Oui (mode offline) |
| **Personnalisation** | Limitée | Totale |

## 🚀 Déploiement Production

### Netlify (Recommandé)

1. Créez un compte sur netlify.com
2. Drag & drop le dossier `autoviz-web`
3. Configuration automatique
4. URL personnalisée disponible

### Vercel

```bash
npm i -g vercel
cd autoviz-web
vercel
```

### GitHub Pages

```bash
# Dans votre repo
git subtree push --prefix autoviz-web origin gh-pages
```

Accès : `https://username.github.io/repo-name/`

## 📝 Licence

MIT License - Voir LICENSE pour détails

## 🤝 Contribution

Les contributions sont bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📧 Contact & Support

- **GitHub Issues** : Pour bugs et features
- **Email** : mehdi@example.com
- **Documentation** : Ce README

## 🎓 Crédits

**Design & Développement :** Mehdi  
**Technologies :** Vega-Lite, PapaParse  
**Inspiration :** Design brutalist, néomorphisme  

---

**Fait avec ❤️ et beaucoup de CSS**



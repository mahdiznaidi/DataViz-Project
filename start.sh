#!/bin/bash

# AutoViz LLM - Lanceur automatique
# Détecte et lance le meilleur serveur disponible

echo "🚀 AutoViz LLM - Web Application"
echo "================================"
echo ""

PORT=8000

# Fonction pour vérifier si le port est libre
check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $PORT déjà utilisé"
        PORT=$((PORT + 1))
        echo "📡 Essai sur le port $PORT..."
    fi
}

# Vérifier le port
check_port

# Essayer Python
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 détecté"
    echo "🌐 Lancement du serveur sur http://localhost:$PORT"
    echo ""
    echo "💡 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    python3 -m http.server $PORT
    exit 0
fi

if command -v python &> /dev/null; then
    echo "✅ Python détecté"
    echo "🌐 Lancement du serveur sur http://localhost:$PORT"
    echo ""
    echo "💡 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    python -m http.server $PORT
    exit 0
fi

# Essayer Node.js
if command -v npx &> /dev/null; then
    echo "✅ Node.js détecté"
    echo "🌐 Lancement du serveur sur http://localhost:$PORT"
    echo ""
    echo "💡 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    npx http-server -p $PORT
    exit 0
fi

# Essayer PHP
if command -v php &> /dev/null; then
    echo "✅ PHP détecté"
    echo "🌐 Lancement du serveur sur http://localhost:$PORT"
    echo ""
    echo "💡 Appuyez sur Ctrl+C pour arrêter"
    echo ""
    php -S localhost:$PORT
    exit 0
fi

# Aucun serveur trouvé
echo "❌ Aucun serveur trouvé"
echo ""
echo "Installez l'un des suivants :"
echo "  - Python 3:  https://www.python.org/downloads/"
echo "  - Node.js:   https://nodejs.org/"
echo "  - PHP:       https://www.php.net/"
echo ""
echo "Ou ouvrez index.html directement dans votre navigateur"
echo "(certaines fonctionnalités peuvent être limitées)"

exit 1

// AutoViz LLM - Application Logic

// Global State
let appState = {
    config: {
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: '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',
        model: 'openai/gpt-4o-mini',
        offlineMode: false
    },
    data: {
        raw: null,
        parsed: null,
        fileName: ''
    },
    proposals: [],
    selectedProposal: null,
    chart: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    console.log('Papa available:', typeof Papa !== 'undefined');
    console.log('Vega available:', typeof vega !== 'undefined');
    console.log('VegaLite available:', typeof vegaLite !== 'undefined');
    console.log('VegaEmbed available:', typeof vegaEmbed !== 'undefined');
    
    // Check critical elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const problemSection = document.getElementById('problemSection');
    
    console.log('Critical elements check:');
    console.log('- uploadArea:', !!uploadArea);
    console.log('- fileInput:', !!fileInput);
    console.log('- problemSection:', !!problemSection);
    
    if (typeof Papa === 'undefined') {
        console.error('PapaParse not loaded!');
        alert('Erreur: PapaParse non chargé. Veuillez recharger la page.');
        return;
    }
    
    loadConfig();
    setupEventListeners();
    showSection('home');
    
    console.log('Initialization complete');
});

// Event Listeners
function setupEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    console.log('Setting up event listeners...');
    console.log('uploadArea:', uploadArea);
    console.log('fileInput:', fileInput);
    
    if (!uploadArea || !fileInput) {
        console.error('Upload area or file input not found!');
        return;
    }
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
        console.log('Drag over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
        console.log('Drag leave');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        console.log('Files dropped:', files.length);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        console.log('Upload area clicked');
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        console.log('File input changed');
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    console.log('Event listeners set up successfully');
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = ['home', 'about', 'uploadSection', 'problemSection', 'proposalsSection', 'visualizationSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // Show requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Special handling for home
    if (sectionId === 'home') {
        document.getElementById('uploadSection').style.display = 'block';
    }
}

function scrollToUpload() {
    document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth' });
}

// Configuration
function toggleConfig() {
    const sidebar = document.getElementById('configSidebar');
    sidebar.classList.toggle('open');
}

function saveConfig() {
    appState.config.baseUrl = document.getElementById('baseUrl').value;
    appState.config.apiKey = document.getElementById('apiKey').value;
    appState.config.model = document.getElementById('model').value;
    appState.config.offlineMode = document.getElementById('offlineMode').checked;
    
    localStorage.setItem('autoviz_config', JSON.stringify(appState.config));
    
    showToast('Configuration sauvegardée', 'success');
    toggleConfig();
}

function loadConfig() {
    const saved = localStorage.getItem('autoviz_config');
    if (saved) {
        appState.config = { ...appState.config, ...JSON.parse(saved) };
        document.getElementById('baseUrl').value = appState.config.baseUrl;
        document.getElementById('apiKey').value = appState.config.apiKey;
        document.getElementById('model').value = appState.config.model;
        document.getElementById('offlineMode').checked = appState.config.offlineMode;
    }
}

// File Handling
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    console.log('handleFile called with:', file);
    
    if (!file) {
        showToast('Aucun fichier sélectionné', 'error');
        return;
    }
    
    if (!file.name.endsWith('.csv')) {
        showToast('Veuillez sélectionner un fichier CSV', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showToast('Le fichier est trop volumineux (max 10MB)', 'error');
        return;
    }
    
    // Check if Papa is loaded
    if (typeof Papa === 'undefined') {
        showToast('Erreur: PapaParse non chargé. Rechargez la page.', 'error');
        console.error('Papa is not defined');
        return;
    }
    
    appState.data.fileName = file.name;
    console.log('Parsing file:', file.name);
    
    // Show loading indicator
    showToast('Chargement du fichier...', 'success');
    
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
            console.log('Parse complete:', results);
            
            if (!results.data || results.data.length === 0) {
                showToast('Le fichier CSV est vide', 'error');
                return;
            }
            
            appState.data.raw = results.data;
            appState.data.parsed = results.data;
            
            console.log('Data loaded:', appState.data.parsed.length, 'rows');
            
            displayDataPreview();
            document.getElementById('problemSection').style.display = 'block';
            document.getElementById('problemSection').scrollIntoView({ behavior: 'smooth' });
            showToast(`✅ Fichier "${file.name}" chargé : ${results.data.length} lignes`, 'success');
        },
        error: (error) => {
            console.error('Parse error:', error);
            showToast(`❌ Erreur de lecture: ${error.message}`, 'error');
        }
    });
}

function displayDataPreview() {
    const data = appState.data.parsed;
    const preview = document.getElementById('dataPreview');
    const stats = document.getElementById('dataStats');
    const table = document.getElementById('dataTable');
    
    // Show preview
    preview.style.display = 'block';
    
    // Stats
    const columns = Object.keys(data[0] || {});
    stats.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Lignes</span>
            <span class="stat-value">${data.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Colonnes</span>
            <span class="stat-value">${columns.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Fichier</span>
            <span class="stat-value" style="font-size: 1rem;">${appState.data.fileName}</span>
        </div>
    `;
    
    // Table (first 5 rows)
    const previewData = data.slice(0, 5);
    let tableHTML = '<table><thead><tr>';
    columns.forEach(col => {
        tableHTML += `<th>${col}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    previewData.forEach(row => {
        tableHTML += '<tr>';
        columns.forEach(col => {
            tableHTML += `<td>${row[col] !== null && row[col] !== undefined ? row[col] : ''}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    table.innerHTML = tableHTML;
}

function clearData() {
    appState.data = { raw: null, parsed: null, fileName: '' };
    document.getElementById('dataPreview').style.display = 'none';
    document.getElementById('problemSection').style.display = 'none';
    document.getElementById('proposalsSection').style.display = 'none';
    document.getElementById('visualizationSection').style.display = 'none';
    document.getElementById('fileInput').value = '';
    showToast('Données effacées', 'success');
}

// Problem Examples
function setExample(text) {
    document.getElementById('problemInput').value = text;
}

// Generate Proposals
async function generateProposals() {
    const problem = document.getElementById('problemInput').value.trim();
    
    if (!problem) {
        showToast('Veuillez décrire votre problématique', 'error');
        return;
    }
    
    if (!appState.data.parsed) {
        showToast('Veuillez d\'abord charger un fichier CSV', 'error');
        return;
    }
    
    // 1. Validation de longueur minimale
    if (problem.length < 10) {
        showToast('Votre problématique est trop courte. Décrivez ce que vous souhaitez analyser (ex: "Comment évoluent les ventes par région ?")', 'error');
        return;
    }
    
    // 2. Détection de conversations générales (salutations, politesse, etc.)
    const isGreeting = /^(bonjour|salut|hello|hi|hey|coucou|bonsoir|bonne\s+journée|comment\s+(vas-tu|allez-vous|ça\s+va))/i.test(problem);
    const isPolite = /^(merci|thank\s+you|thanks|au\s+revoir|bye|à\s+bientôt|bon\s+courage)/i.test(problem);
    const isSmallTalk = /(ça\s+va|how\s+are\s+you|fine|bien|mal|fatigué|content)/i.test(problem);
    const isGeneral = /(qui\s+es-tu|qu'est-ce\s+que\s+tu|peux-tu\s+m'aider|aide-moi|c'est\s+quoi)/i.test(problem);
    
    if (isGreeting || isPolite || (isSmallTalk && problem.length < 30)) {
        showToast(
            '⚠️ Ceci semble être une conversation générale. Pour analyser vos données, posez une question analytique. Exemples:\n' +
            '• "Quelle est la répartition des ventes par région ?"\n' +
            '• "Comment le prix évolue-t-il avec la surface ?"\n' +
            '• "Combien de maisons ont plus de 3 chambres ?"',
            'warning'
        );
        return;
    }
    
    if (isGeneral && !/(données|data|fichier|csv|colonnes?|variables?)/i.test(problem)) {
        showToast(
            '💡 Pour analyser vos données, posez une question spécifique sur les colonnes de votre fichier. Regardez l\'aperçu des données ci-dessus pour voir les colonnes disponibles.',
            'warning'
        );
        return;
    }
    
    // 3. Vérifier la présence de mots-clés d'analyse de données
    const dataAnalysisKeywords = /comment|quel(le)?s?|combien|relation|évolution|évol|répartition|distribution|comparaison|compar|tendance|corrélation|corrél|analyse|montre|affiche|visualise|afficher|montrer|voir|regarder|explorer|examiner|étud|identif|observ|mesur|calcul|éval|estim/i.test(problem);
    
    if (!dataAnalysisKeywords) {
        showToast(
            '❌ Votre question doit porter sur l\'analyse de vos données. Utilisez des verbes d\'action:\n' +
            '• "Comment..." / "Quelle..." / "Combien..."\n' +
            '• "Montre-moi..." / "Affiche..." / "Visualise..."\n' +
            '• "Analyse..." / "Compare..." / "Explore..."',
            'error'
        );
        return;
    }
    
    // 4. Vérifier que la question mentionne au moins un concept lié aux données
    const columns = Object.keys(appState.data.parsed[0] || {});
    const problemLower = problem.toLowerCase();
    
    // Concepts de données génériques
    const hasDataConcepts = /(données|valeurs|nombre|quantité|montant|total|moyenne|somme|minimum|maximum|distribution|fréquence|pourcentage|proportion|ratio|taux|évolution|variation|croissance|tendance)/i.test(problem);
    
    // Ou mentionne une colonne du dataset
    const mentionsColumn = columns.some(col => {
        const colLower = col.toLowerCase().replace(/_/g, ' ');
        return problemLower.includes(colLower) || problemLower.includes(col.toLowerCase());
    });
    
    if (!hasDataConcepts && !mentionsColumn) {
        const columnsList = columns.slice(0, 5).join(', ');
        const moreColumns = columns.length > 5 ? `, et ${columns.length - 5} autres` : '';
        
        showToast(
            `💡 Votre question doit mentionner un aspect de vos données.\n\n` +
            `Colonnes disponibles: ${columnsList}${moreColumns}\n\n` +
            `Exemple: "Quelle est la répartition par ${columns[0]} ?"`,
            'warning'
        );
        return;
    }
    
    // 5. Vérifier que ce n'est pas une question trop vague
    const tooVague = /^(montre|affiche|visualise|analyse|regarde)\s*(moi)?\s*(les|des|mes)?\s*(données|data|tout|ça|ceci)?\s*$/i.test(problem);
    
    if (tooVague) {
        showToast(
            '❌ Question trop vague. Soyez plus spécifique:\n' +
            '• Quelle colonne voulez-vous analyser ?\n' +
            '• Quel type de relation cherchez-vous ?\n' +
            '• Quelle question précise posez-vous ?',
            'error'
        );
        return;
    }
    
    // UI feedback
    const btn = document.getElementById('generateBtn');
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loader').style.display = 'flex';
    btn.disabled = true;
    
    try {
        let proposals;
        
        if (appState.config.offlineMode) {
            proposals = await generateOfflineProposals(problem);
        } else {
            proposals = await generateOnlineProposals(problem);
        }
        
        appState.proposals = proposals;
        displayProposals();
        
        document.getElementById('proposalsSection').style.display = 'block';
        document.getElementById('proposalsSection').scrollIntoView({ behavior: 'smooth' });
        
        showToast('Propositions générées avec succès', 'success');
        
    } catch (error) {
        console.error('Error generating proposals:', error);
        showToast(`Erreur: ${error.message}`, 'error');
    } finally {
        btn.querySelector('.btn-text').style.display = 'block';
        btn.querySelector('.btn-loader').style.display = 'none';
        btn.disabled = false;
    }
}

async function generateOnlineProposals(problem) {
    if (!appState.config.apiKey) {
        throw new Error('Clé API manquante. Configurez-la ou activez le mode offline.');
    }
    
    const profile = profileDataset(appState.data.parsed);
    
    const systemPrompt = `You are a senior data visualization expert. Return STRICT JSON only, no markdown, no extra text. Propose charts following best practices (readability, correct chart type, avoid chartjunk).`;
    
    const userPrompt = `Problem statement:
${problem}

Dataset summary (JSON):
${JSON.stringify(profile, null, 2)}

Task:
Propose EXACTLY 3 different chart ideas.
For each:
- id: "p1"/"p2"/"p3"
- title: short
- chart_type: one of ["bar","line","scatter","histogram","boxplot","heatmap","area"]
- reasoning
- best_practices: list of concrete points
- vega_lite_spec: Vega-Lite v5 spec. Use:
  data: {"name":"table"}
  (the app will inject the real data)
Output JSON:
{"proposals":[ ...3 items... ]}`;
    
    const response = await fetch(`${appState.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${appState.config.apiKey}`
        },
        body: JSON.stringify({
            model: appState.config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' }
        })
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);
    
    if (!result.proposals || result.proposals.length !== 3) {
        throw new Error('Invalid response from API');
    }
    
    // Sanitize and validate specs
    return result.proposals.map(p => ({
        id: p.id,
        title: p.title,
        chartType: p.chart_type,
        reasoning: p.reasoning,
        bestPractices: p.best_practices || [],
        spec: sanitizeSpec(p.vega_lite_spec || {}, appState.data.parsed, p.chart_type)
    }));
}

async function generateOfflineProposals(problem) {
    // Analyze data structure
    const data = appState.data.parsed;
    const columns = Object.keys(data[0] || {});
    
    if (columns.length === 0) {
        throw new Error('Aucune colonne détectée dans les données');
    }
    
    // Classify columns more intelligently
    const columnAnalysis = {};
    columns.forEach(col => {
        const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined);
        const uniqueCount = new Set(values).size;
        const isNumeric = values.every(v => typeof v === 'number');
        
        columnAnalysis[col] = {
            isNumeric,
            uniqueCount,
            isCategorical: !isNumeric || uniqueCount < 20,
            sampleValues: values.slice(0, 5)
        };
    });
    
    const numericCols = columns.filter(col => columnAnalysis[col].isNumeric && !columnAnalysis[col].isCategorical);
    const categoricalCols = columns.filter(col => columnAnalysis[col].isCategorical);
    
    // Detect what user is asking for
    const problemLower = problem.toLowerCase();
    const askingForDistribution = /répartition|distribution|nombre|combien|count|fréquence/i.test(problem);
    const askingForComparison = /compar|différence|versus|vs|entre/i.test(problem);
    const askingForRelation = /relation|corrélation|lien|influence|impact/i.test(problem);
    const askingForEvolution = /évol|temps|temp|trend|tendance|croissance/i.test(problem);
    
    // Try to find mentioned column in the problem
    let mentionedCategorical = categoricalCols.find(col => 
        problemLower.includes(col.toLowerCase()) || 
        problemLower.includes(col.toLowerCase().replace(/_/g, ' '))
    );
    
    let mentionedNumeric = numericCols.find(col => 
        problemLower.includes(col.toLowerCase()) || 
        problemLower.includes(col.toLowerCase().replace(/_/g, ' '))
    );
    
    const proposals = [];
    
    // Proposal 1: Distribution/Count (priorité si demandé explicitement)
    if (askingForDistribution && categoricalCols.length > 0) {
        const targetCol = mentionedCategorical || categoricalCols[0];
        proposals.push({
            id: 'p1',
            title: `Répartition par ${targetCol}`,
            chartType: 'bar',
            reasoning: `Bar chart montrant le nombre d'observations pour chaque valeur de "${targetCol}". Idéal pour visualiser les distributions et identifier les catégories dominantes.`,
            bestPractices: [
                'Barres triées par fréquence décroissante',
                'Couleurs distinctes pour chaque catégorie',
                'Labels lisibles avec les comptes exacts',
                'Baseline à zéro pour éviter les distorsions'
            ],
            spec: createCountBarSpec(targetCol)
        });
    }
    
    // Proposal 2: Relation/Comparison
    if (askingForRelation && numericCols.length >= 2) {
        proposals.push({
            id: 'p2',
            title: `Relation ${numericCols[0]} vs ${numericCols[1]}`,
            chartType: 'scatter',
            reasoning: `Scatter plot révélant la corrélation entre "${numericCols[0]}" et "${numericCols[1]}". Permet d'identifier les patterns, tendances et outliers.`,
            bestPractices: [
                'Axes proportionnels et bien calibrés',
                'Transparence des points si données denses',
                'Tooltips interactifs pour exploration',
                'Légende claire si coloration par catégorie'
            ],
            spec: createScatterSpec(numericCols, categoricalCols)
        });
    } else if (categoricalCols.length >= 2) {
        proposals.push({
            id: 'p2',
            title: `Croisement ${categoricalCols[0]} × ${categoricalCols[1]}`,
            chartType: 'heatmap',
            reasoning: `Heatmap croisant "${categoricalCols[0]}" et "${categoricalCols[1]}" pour identifier les combinaisons fréquentes.`,
            bestPractices: [
                'Échelle de couleur intuitive',
                'Valeurs affichées dans les cellules',
                'Axes ordonnés logiquement'
            ],
            spec: createHeatmapSpec(categoricalCols[0], categoricalCols[1])
        });
    }
    
    // Proposal 3: Distribution numérique ou autre vue
    if (numericCols.length > 0 && proposals.length < 3) {
        const targetCol = mentionedNumeric || numericCols[0];
        proposals.push({
            id: 'p3',
            title: `Distribution de ${targetCol}`,
            chartType: 'histogram',
            reasoning: `Histogramme montrant la distribution des valeurs de "${targetCol}". Révèle la forme, le centre et la dispersion des données.`,
            bestPractices: [
                'Nombre de bins optimisé automatiquement',
                'Axes avec unités claires',
                'Pas d\'effets 3D qui compliquent la lecture',
                'Annotation des statistiques clés si pertinent'
            ],
            spec: createHistogramSpec(targetCol)
        });
    }
    
    // Fill up to 3 proposals if needed
    while (proposals.length < 3 && categoricalCols.length > 0) {
        const colIndex = proposals.length;
        if (colIndex < categoricalCols.length) {
            const col = categoricalCols[colIndex];
            proposals.push({
                id: `p${proposals.length + 1}`,
                title: `Répartition par ${col}`,
                chartType: 'bar',
                reasoning: `Distribution des valeurs de "${col}".`,
                bestPractices: ['Barres triées', 'Labels clairs', 'Comptage visible'],
                spec: createCountBarSpec(col)
            });
        } else {
            break;
        }
    }
    
    // Ensure we always have at least one proposal
    if (proposals.length === 0) {
        throw new Error('Impossible de générer des propositions. Vérifiez que votre fichier CSV contient des données exploitables.');
    }
    
    return proposals.slice(0, 3);
}

// Dataset Profiling
function profileDataset(data) {
    const columns = Object.keys(data[0] || {});
    const profile = {
        n_rows: data.length,
        n_cols: columns.length,
        columns: []
    };
    
    columns.forEach(col => {
        const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined);
        const uniqueValues = [...new Set(values)];
        
        const colInfo = {
            name: col,
            dtype: typeof values[0],
            missing: data.length - values.length,
            unique: uniqueValues.length,
            examples: values.slice(0, 3)
        };
        
        if (typeof values[0] === 'number') {
            colInfo.type = 'numeric';
            colInfo.min = Math.min(...values);
            colInfo.max = Math.max(...values);
        } else {
            colInfo.type = 'categorical';
            const counts = {};
            values.forEach(v => counts[v] = (counts[v] || 0) + 1);
            colInfo.top = Object.fromEntries(
                Object.entries(counts).slice(0, 10)
            );
        }
        
        profile.columns.push(colInfo);
    });
    
    return profile;
}

// Spec Generation Helpers
function createCountBarSpec(categoryField) {
    return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { name: 'table' },
        mark: { type: 'bar', tooltip: true },
        width: 700,
        height: 420,
        encoding: {
            x: { 
                field: categoryField, 
                type: 'nominal',
                sort: '-y',
                axis: { 
                    labelAngle: -45,
                    title: categoryField
                }
            },
            y: { 
                aggregate: 'count',
                type: 'quantitative',
                title: 'Nombre',
                axis: { grid: true }
            },
            color: {
                field: categoryField,
                type: 'nominal',
                legend: null,
                scale: { scheme: 'category20' }
            },
            tooltip: [
                { field: categoryField, type: 'nominal', title: 'Catégorie' },
                { aggregate: 'count', type: 'quantitative', title: 'Nombre' }
            ]
        }
    };
}

function createHistogramSpec(numericField) {
    return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { name: 'table' },
        mark: { type: 'bar', tooltip: true },
        width: 700,
        height: 420,
        encoding: {
            x: { 
                field: numericField, 
                type: 'quantitative',
                bin: { maxbins: 30 },
                axis: { title: numericField }
            },
            y: { 
                aggregate: 'count',
                type: 'quantitative',
                title: 'Fréquence'
            },
            tooltip: [
                { field: numericField, type: 'quantitative', bin: true, title: 'Intervalle' },
                { aggregate: 'count', type: 'quantitative', title: 'Fréquence' }
            ]
        }
    };
}

function createHeatmapSpec(xField, yField) {
    return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { name: 'table' },
        mark: { type: 'rect', tooltip: true },
        width: 700,
        height: 420,
        encoding: {
            x: { 
                field: xField, 
                type: 'nominal',
                axis: { labelAngle: -45 }
            },
            y: { 
                field: yField, 
                type: 'nominal'
            },
            color: {
                aggregate: 'count',
                type: 'quantitative',
                scale: { scheme: 'blues' },
                title: 'Nombre'
            },
            tooltip: [
                { field: xField, type: 'nominal' },
                { field: yField, type: 'nominal' },
                { aggregate: 'count', type: 'quantitative', title: 'Nombre' }
            ]
        }
    };
}

function createScatterSpec(numericCols, categoricalCols) {
    const spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { name: 'table' },
        mark: { type: 'point', tooltip: true, opacity: 0.7, size: 60 },
        width: 700,
        height: 420,
        encoding: {}
    };
    
    if (numericCols.length >= 2) {
        spec.encoding.x = { 
            field: numericCols[0], 
            type: 'quantitative',
            scale: { zero: false }
        };
        spec.encoding.y = { 
            field: numericCols[1], 
            type: 'quantitative',
            scale: { zero: false }
        };
        if (categoricalCols.length > 0) {
            spec.encoding.color = { 
                field: categoricalCols[0], 
                type: 'nominal',
                scale: { scheme: 'category20' }
            };
        }
        spec.encoding.tooltip = [
            { field: numericCols[0], type: 'quantitative' },
            { field: numericCols[1], type: 'quantitative' }
        ];
        if (categoricalCols.length > 0) {
            spec.encoding.tooltip.push({ field: categoricalCols[0], type: 'nominal' });
        }
    }
    
    return spec;
}

function createLineSpec(numericCols, categoricalCols) {
    const spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { name: 'table' },
        mark: { type: 'line', point: true, tooltip: true },
        width: 700,
        height: 420,
        encoding: {}
    };
    
    if (numericCols.length >= 2) {
        spec.encoding.x = { 
            field: numericCols[0], 
            type: 'quantitative',
            axis: { grid: false }
        };
        spec.encoding.y = { 
            field: numericCols[1], 
            type: 'quantitative'
        };
        if (categoricalCols.length > 0) {
            spec.encoding.color = { 
                field: categoricalCols[0], 
                type: 'nominal',
                scale: { scheme: 'category20' }
            };
        }
        spec.encoding.tooltip = [
            { field: numericCols[0], type: 'quantitative' },
            { field: numericCols[1], type: 'quantitative' }
        ];
        if (categoricalCols.length > 0) {
            spec.encoding.tooltip.push({ field: categoricalCols[0], type: 'nominal' });
        }
    }
    
    return spec;
}

function sanitizeSpec(spec, data, chartType) {
    spec = spec || {};
    spec.$schema = 'https://vega.github.io/schema/vega-lite/v5.json';
    spec.data = { name: 'table' };
    spec.width = spec.width || 700;
    spec.height = spec.height || 420;
    
    // Ensure encoding exists
    if (!spec.encoding || typeof spec.encoding !== 'object') {
        spec.encoding = {};
    }
    
    return spec;
}

// Display Proposals
function displayProposals() {
    const grid = document.getElementById('proposalsGrid');
    grid.innerHTML = '';
    
    appState.proposals.forEach(proposal => {
        const card = document.createElement('div');
        card.className = 'proposal-card';
        card.onclick = () => selectProposal(proposal.id);
        
        card.innerHTML = `
            <div class="proposal-header">
                <h3 class="proposal-title">${proposal.title}</h3>
                <span class="proposal-badge">${proposal.chartType}</span>
            </div>
            <p class="proposal-reasoning">${proposal.reasoning}</p>
            <div class="proposal-practices">
                <h4>Bonnes pratiques</h4>
                <ul>
                    ${proposal.bestPractices.map(bp => `<li>${bp}</li>`).join('')}
                </ul>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function selectProposal(proposalId) {
    // Update selection
    document.querySelectorAll('.proposal-card').forEach((card, idx) => {
        card.classList.remove('selected');
        if (appState.proposals[idx].id === proposalId) {
            card.classList.add('selected');
        }
    });
    
    appState.selectedProposal = appState.proposals.find(p => p.id === proposalId);
    
    // Render chart
    renderChart();
    
    // Show visualization section
    document.getElementById('visualizationSection').style.display = 'block';
    document.getElementById('visualizationSection').scrollIntoView({ behavior: 'smooth' });
}

// Chart Rendering
async function renderChart() {
    const container = document.getElementById('chartContainer');
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">Chargement de la visualisation...</p>';
    
    try {
        const spec = appState.selectedProposal.spec;
        
        // Inject data
        const specWithData = {
            ...spec,
            datasets: {
                table: appState.data.parsed
            }
        };
        
        const result = await vegaEmbed(container, specWithData, {
            theme: 'dark',
            actions: {
                export: true,
                source: false,
                compiled: false,
                editor: false
            }
        });
        
        appState.chart = result;
        
    } catch (error) {
        container.innerHTML = `<p style="color: var(--color-error);">Erreur de rendu: ${error.message}</p>`;
        console.error('Chart rendering error:', error);
    }
}

// Export Functions
function copySpec() {
    const spec = JSON.stringify(appState.selectedProposal.spec, null, 2);
    navigator.clipboard.writeText(spec).then(() => {
        showToast('Spécification copiée dans le presse-papiers', 'success');
    }).catch(err => {
        showToast('Erreur de copie: ' + err.message, 'error');
    });
}

async function exportPNG() {
    if (!appState.chart) {
        showToast('Aucun graphique à exporter', 'error');
        return;
    }
    
    try {
        // Get the view
        const view = appState.chart.view;
        
        // Export as PNG
        const canvas = await view.toCanvas();
        const url = canvas.toDataURL('image/png');
        
        // Download
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = url;
        link.click();
        
        showToast('Graphique exporté avec succès', 'success');
        
    } catch (error) {
        showToast(`Erreur d'export: ${error.message}`, 'error');
        console.error('Export error:', error);
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Support multi-line messages
    const lines = message.split('\n');
    if (lines.length > 1) {
        toast.innerHTML = lines.map(line => {
            if (line.startsWith('•')) {
                return `<div style="margin-left: 1rem;">${line}</div>`;
            }
            return `<div>${line}</div>`;
        }).join('');
    } else {
        toast.textContent = message;
    }
    
    // Add icon based on type
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : '⚠';
    const iconEl = document.createElement('span');
    iconEl.style.marginRight = '0.5rem';
    iconEl.style.fontWeight = 'bold';
    iconEl.textContent = icon;
    toast.prepend(iconEl);
    
    container.appendChild(toast);
    
    // Auto-dismiss after longer time for complex messages
    const dismissTime = lines.length > 3 ? 6000 : 4000;
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, dismissTime);
}

// Utility: Slide out animation
const style = document.createElement('style');
style.textContent = `
@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

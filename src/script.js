
// ======================================
// KOMBAT ROULETTE
// ======================================

// ELEMENTS
const participantInput = document.getElementById("participantInput");
const participantCount = document.getElementById("participantCount");
const participantStatus = document.getElementById("participantStatus");

const addBtn = document.getElementById("addBtn");
const drawBtn = document.getElementById("drawBtn");

const clearParticipantsBtn = document.getElementById("clearParticipantsBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const repeatToggle = document.getElementById("repeatToggle");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const placeholder = document.getElementById("placeholder");
const winnerDisplay = document.getElementById("winnerDisplay");

const winnerOne = document.getElementById("winnerOne");
const winnerTwo = document.getElementById("winnerTwo");

const winnerNameOne = document.getElementById("winnerNameOne");
const winnerNameTwo = document.getElementById("winnerNameTwo");

const versus = document.getElementById("versus");
const historyList = document.getElementById("historyList");

const fightersList = document.getElementById("fightersList");
const fightersListContent = document.getElementById("fightersListContent");

const fileInput = document.getElementById("fileInput");
const fileBtn = document.getElementById("fileBtn");

const app = document.getElementById("app");

const themeSelect = document.getElementById("themeSelect");

// ======================================
// TRANSLATIONS
// ======================================

const translations = {

    en: {
        subtitle: "TOURNAMENT DRAW SYSTEM",
        fullscreen: "⛶ Fullscreen",
        exitFullscreen: "✕ Exit fullscreen",

        drawLabel: "KOMBAT DRAW",
        placeholderTitle: "Who will be chosen?",
        placeholderText: "Add fighters and start the draw!",
        fighter: "FIGHTER",

        modeLabel: "Draw mode",
        singleMode: "1 Fighter",
        versusMode: "2 Fighters",
        drawButton: "⚔️ DRAW",
        drawing: "⏳ DRAWING...",
        insufficient: "NOT ENOUGH FIGHTERS",

        repeatTitle: "Allow repeated fighters",
        repeatDescription: "Disabled: drawn fighters cannot be selected again.",

        fightersTitle: "⚔️ Fighters",
        inputPlaceholder: "Paste or type fighters here...\n\nExample:\nGoku\nSuperman\nBatman\nSpider-Man",

        addButton: "+ Add list",
        clearButton: "Clear",

        importFile: "Import TXT file",

        emptyParticipants: "No fighters added.",
        participantStatus: "{total} fighter(s) registered | {available} available",

        listTitle: "View fighter list",
        listEmpty: "No fighters registered.",

        deleteTitle: "Remove fighter",

        historyTitle: "📜 History",
        clearHistory: "Clear history",
        emptyHistory: "No draws performed.",

        confirmParticipants: "Are you sure you want to remove all fighters?",
        confirmHistory: "Are you sure you want to clear the entire draw history?",
        confirmDelete: "Remove this fighter from the list?",

        inputError: "Paste or type the fighters first!",
        invalidError: "No valid fighters found!",
        insufficientError: "Not enough fighters available!",
        fullscreenError: "Unable to activate fullscreen.",
        fileError: "Unable to read this file.",
        emptyFileError: "The selected file contains no valid fighters.",
        invalidFileError: "Please select a valid TXT file.",

        drawNumber: "DRAW",
        drawnAt: "Drawn at",
        themeLabel: "Theme",
        themeRed: "Red",
        themeOrange: "Orange",
        themeGreen: "Green",
        themeLightblue: "Light Blue",
        themePurple: "Purple",
        themeYellow: "Yellow",
    },

    pt: {
        subtitle: "SISTEMA DE SORTEIO DE TORNEIOS",
        fullscreen: "⛶ Tela cheia",
        exitFullscreen: "✕ Sair da tela cheia",

        drawLabel: "SORTEIO DE COMBATE",
        placeholderTitle: "Quem será o escolhido?",
        placeholderText: "Adicione combatentes e comece o sorteio!",
        fighter: "COMBATENTE",

        modeLabel: "Modo de sorteio",
        singleMode: "1 combatente",
        versusMode: "2 combatentes",
        drawButton: "⚔️ SORTEAR",
        drawing: "⏳ SORTEANDO...",
        insufficient: "COMBATENTES INSUFICIENTES",

        repeatTitle: "Permitir combatentes repetidos",
        repeatDescription: "Desativado: quem já saiu não participa novamente.",

        fightersTitle: "⚔️ Combatentes",
        inputPlaceholder: "Cole ou digite os combatentes aqui...\n\nExemplo:\nGoku\nSuperman\nBatman\nHomem-Aranha",

        addButton: "+ Adicionar lista",
        clearButton: "Limpar",

        importFile: "Importar arquivo TXT",

        emptyParticipants: "Nenhum combatente adicionado.",
        participantStatus: "{total} combatente(s) cadastrado(s) | {available} disponível(is)",

        listTitle: "Ver lista de combatentes",
        listEmpty: "Nenhum combatente cadastrado.",

        deleteTitle: "Remover combatente",

        historyTitle: "📜 Histórico",
        clearHistory: "Limpar histórico",
        emptyHistory: "Nenhum sorteio realizado.",

        confirmParticipants: "Deseja realmente apagar todos os combatentes?",
        confirmHistory: "Deseja apagar todo o histórico de sorteios?",
        confirmDelete: "Remover este combatente da lista?",

        inputError: "Cole ou digite os combatentes primeiro!",
        invalidError: "Nenhum combatente válido encontrado!",
        insufficientError: "Não existem combatentes suficientes!",
        fullscreenError: "Não foi possível ativar a tela cheia.",
        fileError: "Não foi possível ler este arquivo.",
        emptyFileError: "O arquivo selecionado não contém combatentes válidos.",
        invalidFileError: "Selecione um arquivo TXT válido.",

        drawNumber: "SORTEIO",
        drawnAt: "Realizado às",
        themeLabel: "Tema",
        themeRed: "Vermelho",
        themeOrange: "Laranja",
        themeGreen: "Verde",
        themeLightblue: "Azul claro",
        themePurple: "Roxo",
        themeYellow: "Amarelo",
    }

};

// ======================================
// VARIABLES
// ======================================

// English is the default language
let currentLanguage = "en";

// Default draw mode: 2 fighters
let drawMode = 2;

let participants = [];
let drawnParticipants = [];
let history = [];

let isDrawing = false;
let drawTimer = null;

// ======================================
// TRANSLATION FUNCTION
// ======================================

function t(key) {
    return translations[currentLanguage][key] || key;
}

// ======================================
// LANGUAGE SELECTION
// ======================================

document.querySelectorAll(".lang-btn").forEach(button => {

    button.addEventListener("click", () => {

        currentLanguage = button.dataset.lang;

        document.documentElement.lang =
            currentLanguage === "pt" ? "pt-BR" : "en";

        document.querySelectorAll(".lang-btn").forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        updateLanguage();

    });

});

// ======================================
// THEME SYSTEM
// ======================================

function setTheme(theme) {

    const validThemes = [
        "red",
        "orange",
        "green",
        "lightblue",
        "purple",
        "yellow"
    ];

    if (!validThemes.includes(theme)) return;

    document.body.dataset.theme = theme;

    themeSelect.value = theme;

}

themeSelect.addEventListener("change", () => {

    setTheme(themeSelect.value);

});

function updateLanguage() {

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.dataset.i18n;

        element.textContent = t(key);

    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {

        const key = element.dataset.i18nPlaceholder;

        element.placeholder = t(key);

    });

    updateParticipantCount();
    updateDrawButton();
    renderHistory();
    renderFightersList();

    fullscreenBtn.textContent = document.fullscreenElement
        ? t("exitFullscreen")
        : t("fullscreen");

    // Update theme selector translations

    const themeNames = {
        red: "themeRed",
        orange: "themeOrange",
        green: "themeGreen",
        lightblue: "themeLightblue",
        purple: "themePurple",
        yellow: "themeYellow"
    };

    themeSelect.querySelectorAll("option").forEach(option => {

        option.textContent = t(themeNames[option.value]);

});

}

// ======================================
// AVAILABLE FIGHTERS
// ======================================

function getAvailableParticipants() {

    if (repeatToggle.checked) {
        return [...participants];
    }

    return participants.filter(
        name => !drawnParticipants.includes(name)
    );

}

// ======================================
// UPDATE COUNTER
// ======================================

function updateParticipantCount() {

    participantCount.textContent = participants.length;

    const available = getAvailableParticipants().length;

    if (participants.length === 0) {

        participantStatus.textContent = t("emptyParticipants");

    } else {

        participantStatus.textContent =
            t("participantStatus")
                .replace("{total}", participants.length)
                .replace("{available}", available);

    }

    updateDrawButton();

}

// ======================================
// UPDATE DRAW BUTTON
// ======================================

function updateDrawButton() {

    const available = getAvailableParticipants();

    const enough = available.length >= drawMode;

    drawBtn.disabled = !enough || isDrawing;

    if (isDrawing) {

        drawBtn.textContent = t("drawing");

    } else if (!enough) {

        drawBtn.textContent = t("insufficient");

    } else {

        drawBtn.textContent = t("drawButton");

    }

    addBtn.disabled = isDrawing;
    clearParticipantsBtn.disabled = isDrawing;
    fileBtn.disabled = isDrawing;

}

// ======================================
// ADD FIGHTERS
// ======================================

function addFighters(text) {

    const newParticipants = text
        .split(/\r?\n/)
        .map(name => name.trim())
        .filter(name => name.length > 0);

    if (newParticipants.length === 0) {
        alert(t("invalidError"));
        return false;
    }

    participants.push(...newParticipants);

    // Reset the drawn fighters for a new participant list
    drawnParticipants = [];

    updateParticipantCount();
    renderFightersList();

    // Automatically open the list after adding
    fightersList.open = true;

    return true;

}

// ======================================
// ADD LIST BY TEXT
// ======================================

addBtn.addEventListener("click", () => {

    const text = participantInput.value.trim();

    if (!text) {
        alert(t("inputError"));
        return;
    }

    if (addFighters(text)) {
        participantInput.value = "";
    }

});

// ======================================
// IMPORT TXT FILE
// ======================================

fileBtn.addEventListener("click", () => {

    if (isDrawing) return;

    fileInput.click();

});

fileInput.addEventListener("change", async () => {

    const file = fileInput.files[0];

    if (!file) return;

    // Only accept TXT files
    if (!file.name.toLowerCase().endsWith(".txt")) {

        alert(t("invalidFileError"));
        fileInput.value = "";
        return;

    }

    try {

        const text = await file.text();

        if (!text.trim()) {

            alert(t("emptyFileError"));
            return;

        }

        const success = addFighters(text);

        if (success) {
            participantInput.value = "";
        }

    } catch (error) {

        console.error("File import error:", error);
        alert(t("fileError"));

    } finally {

        // Allows selecting the same file again
        fileInput.value = "";

    }

});

// ======================================
// RENDER FIGHTER LIST
// ======================================

function renderFightersList() {

    fightersListContent.innerHTML = "";

    fightersList.hidden = participants.length === 0;

    if (participants.length === 0) return;

    participants.forEach((fighter, index) => {

        const li = document.createElement("li");

        const number = document.createElement("span");
        number.className = "fighter-number";
        number.textContent = `#${index + 1}`;

        const name = document.createElement("span");
        name.className = "fighter-name";
        name.textContent = fighter;

        // Individual delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-fighter-btn";
        deleteButton.textContent = "🗑️";
        deleteButton.title = t("deleteTitle");
        deleteButton.setAttribute("aria-label", t("deleteTitle"));

        deleteButton.disabled = isDrawing;

        deleteButton.addEventListener("click", () => {
            deleteFighter(index);
        });

        li.append(number, name, deleteButton);

        fightersListContent.appendChild(li);

    });

}

// ======================================
// DELETE INDIVIDUAL FIGHTER
// ======================================

function deleteFighter(index) {

    if (isDrawing) return;

    if (!confirm(t("confirmDelete"))) return;

    const removedFighter = participants[index];

    if (removedFighter === undefined) return;

    // Remove only the selected entry
    participants.splice(index, 1);

    // Remove the fighter from the drawn list
    // if they had already been selected
    if (!participants.includes(removedFighter)) {

        drawnParticipants = drawnParticipants.filter(
            name => name !== removedFighter
        );

    }

    updateParticipantCount();
    renderFightersList();

}

// ======================================
// CLEAR ALL FIGHTERS
// ======================================

clearParticipantsBtn.addEventListener("click", () => {

    if (participants.length === 0 || isDrawing) return;

    if (!confirm(t("confirmParticipants"))) return;

    participants = [];
    drawnParticipants = [];

    winnerDisplay.classList.remove("show");
    placeholder.style.display = "block";

    winnerNameOne.textContent = "---";
    winnerNameTwo.textContent = "---";

    fightersList.open = false;

    updateParticipantCount();
    renderFightersList();

});

// ======================================
// DRAW MODE
// ======================================

document.querySelectorAll(".mode-btn").forEach(button => {

    button.addEventListener("click", () => {

        if (isDrawing) return;

        document.querySelectorAll(".mode-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        drawMode = Number(button.dataset.mode);

        updateWinnerLayout();
        updateDrawButton();

    });

});

// ======================================
// WINNER LAYOUT
// ======================================

function updateWinnerLayout() {

    if (drawMode === 1) {

        winnerTwo.style.display = "none";
        versus.style.display = "none";

    } else {

        winnerTwo.style.display = "block";
        versus.style.display = "block";

    }

}

// ======================================
// RANDOM FIGHTER SELECTION
// ======================================

function getRandomParticipants(amount) {

    const available = getAvailableParticipants();

    const shuffled = [...available];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];

    }

    return shuffled.slice(0, amount);

}

// ======================================
// PERFORM DRAW
// ======================================

drawBtn.addEventListener("click", () => {

    if (isDrawing) return;

    const available = getAvailableParticipants();

    if (available.length < drawMode) {

        alert(t("insufficientError"));
        return;

    }

    isDrawing = true;

    updateDrawButton();
    renderFightersList();

    placeholder.style.display = "none";
    winnerDisplay.classList.add("show");

    updateWinnerLayout();

    // Random name animation
    const animation = setInterval(() => {

        const temporary = getRandomParticipants(drawMode);

        winnerNameOne.textContent = temporary[0] || "---";

        if (drawMode === 2) {
            winnerNameTwo.textContent = temporary[1] || "---";
        }

    }, 100);

    drawTimer = setTimeout(() => {

        clearInterval(animation);
        drawTimer = null;

        const winners = getRandomParticipants(drawMode);

        // Final result
        winnerNameOne.textContent = winners[0];

        if (drawMode === 2) {
            winnerNameTwo.textContent = winners[1];
        }

        // Register drawn fighters
        if (!repeatToggle.checked) {

            drawnParticipants.push(...winners);

        }

        // Reveal animation
        winnerOne.classList.remove("animate");
        winnerTwo.classList.remove("animate");

        void winnerOne.offsetWidth;

        winnerOne.classList.add("animate");

        if (drawMode === 2) {
            winnerTwo.classList.add("animate");
        }

        addToHistory(winners);

        isDrawing = false;

        updateParticipantCount();
        renderFightersList();

    }, 2200);

});

// ======================================
// DRAW HISTORY
// ======================================

function addToHistory(winners) {

    const now = new Date();

    const time = now.toLocaleTimeString(
        currentLanguage === "pt" ? "pt-BR" : "en-US",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

    history.unshift({
        winners: [...winners],
        time: time
    });

    renderHistory();

}

// ======================================
// RENDER HISTORY
// ======================================

function renderHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-history";
        empty.textContent = t("emptyHistory");

        historyList.appendChild(empty);

        return;

    }

    history.forEach((item, index) => {

        const historyItem = document.createElement("div");
        historyItem.className = "history-item";

        const number = document.createElement("div");
        number.className = "number";

        number.textContent =
            `${t("drawNumber")} #${history.length - index}`;

        const names = document.createElement("div");
        names.className = "names";

        names.textContent = item.winners.join(" VS ");

        const time = document.createElement("div");
        time.className = "time";

        time.textContent = `${t("drawnAt")} ${item.time}`;

        historyItem.append(number, names, time);

        historyList.appendChild(historyItem);

    });

}

// ======================================
// CLEAR HISTORY
// ======================================

clearHistoryBtn.addEventListener("click", () => {

    if (history.length === 0) return;

    if (!confirm(t("confirmHistory"))) return;

    history = [];

    renderHistory();

});

// ======================================
// REPEATED FIGHTERS
// ======================================

repeatToggle.addEventListener("change", () => {

    updateParticipantCount();

});

// ======================================
// FULLSCREEN
// ======================================

fullscreenBtn.addEventListener("click", async () => {

    try {

        if (!document.fullscreenElement) {

            await app.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        alert(t("fullscreenError"));

    }

});

document.addEventListener("fullscreenchange", () => {

    fullscreenBtn.textContent = document.fullscreenElement
        ? t("exitFullscreen")
        : t("fullscreen");

});

// ======================================
// INITIALIZATION
// ======================================

// Set English as default
currentLanguage = "en";

// Default theme: RED
setTheme("red");

document.documentElement.lang = "en";

document.querySelectorAll(".lang-btn").forEach(button => {

    button.classList.toggle(
        "active",
        button.dataset.lang === "en"
    );

});

// Set 2 fighters as default
drawMode = 2;

document.querySelectorAll(".mode-btn").forEach(button => {

    button.classList.toggle(
        "active",
        Number(button.dataset.mode) === 2
    );

});

updateWinnerLayout();
updateLanguage();
renderHistory();
renderFightersList();


// ======================================
// COMBAT ROULETTE
// ======================================

// ELEMENTOS
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

const app = document.getElementById("app");

// ======================================
// TRADUÇÕES
// ======================================

const translations = {

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
        emptyParticipants: "Nenhum combatente adicionado.",
        participantStatus: "{total} combatente(s) cadastrado(s) | {available} disponível(is)",

        listTitle: "Ver lista de combatentes",
        listEmpty: "Nenhum combatente cadastrado.",

        historyTitle: "📜 Histórico",
        clearHistory: "Limpar histórico",
        emptyHistory: "Nenhum sorteio realizado.",

        confirmParticipants: "Deseja realmente apagar todos os combatentes?",
        confirmHistory: "Deseja apagar todo o histórico de sorteios?",

        inputError: "Cole ou digite os combatentes primeiro!",
        invalidError: "Nenhum combatente válido encontrado!",
        insufficientError: "Não existem combatentes suficientes!",
        fullscreenError: "Não foi possível ativar a tela cheia.",

        drawNumber: "SORTEIO",
        drawnAt: "Realizado às"
    },

    en: {
        subtitle: "TOURNAMENT DRAW SYSTEM",
        fullscreen: "⛶ Fullscreen",
        exitFullscreen: "✕ Exit fullscreen",

        drawLabel: "COMBAT DRAW",
        placeholderTitle: "Who will be chosen?",
        placeholderText: "Add fighters and start the draw!",
        fighter: "FIGHTER",

        modeLabel: "Draw mode",
        singleMode: "1 fighter",
        versusMode: "2 fighters",
        drawButton: "⚔️ DRAW",
        drawing: "⏳ DRAWING...",
        insufficient: "NOT ENOUGH FIGHTERS",

        repeatTitle: "Allow repeated fighters",
        repeatDescription: "Disabled: drawn fighters cannot be selected again.",

        fightersTitle: "⚔️ Fighters",
        inputPlaceholder: "Paste or type fighters here...\n\nExample:\nGoku\nSuperman\nBatman\nSpider-Man",
        addButton: "+ Add list",
        clearButton: "Clear",
        emptyParticipants: "No fighters added.",
        participantStatus: "{total} fighter(s) registered | {available} available",

        listTitle: "View fighter list",
        listEmpty: "No fighters registered.",

        historyTitle: "📜 History",
        clearHistory: "Clear history",
        emptyHistory: "No draws performed.",

        confirmParticipants: "Are you sure you want to remove all fighters?",
        confirmHistory: "Are you sure you want to clear the entire draw history?",

        inputError: "Paste or type the fighters first!",
        invalidError: "No valid fighters found!",
        insufficientError: "Not enough fighters available!",
        fullscreenError: "Unable to activate fullscreen.",

        drawNumber: "DRAW",
        drawnAt: "Drawn at"
    }

};

let currentLanguage = "pt";

// Função de tradução
function t(key) {
    return translations[currentLanguage][key] || key;
}

// ======================================
// TROCAR IDIOMA
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

}

// ======================================
// VARIÁVEIS
// ======================================

let participants = [];
let drawnParticipants = [];
let history = [];

let drawMode = 1;
let isDrawing = false;

// ======================================
// PARTICIPANTES DISPONÍVEIS
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
// CONTADOR E STATUS
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
// ATUALIZAR BOTÃO
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

}

// ======================================
// LISTA EXPANSÍVEL DE COMBATENTES
// ======================================

function renderFightersList() {

    fightersListContent.innerHTML = "";

    if (participants.length === 0) {

        const li = document.createElement("li");
        li.textContent = t("listEmpty");

        fightersListContent.appendChild(li);

        return;
    }

    participants.forEach((fighter, index) => {

        const li = document.createElement("li");

        const number = document.createElement("span");
        number.className = "fighter-number";
        number.textContent = `#${index + 1}`;

        const name = document.createElement("span");
        name.textContent = fighter;

        li.append(number, name);

        fightersListContent.appendChild(li);

    });

}

// ======================================
// ADICIONAR COMBATENTES
// ======================================

addBtn.addEventListener("click", () => {

    const text = participantInput.value.trim();

    if (!text) {
        alert(t("inputError"));
        return;
    }

    const newParticipants = text
        .split(/\r?\n/)
        .map(name => name.trim())
        .filter(name => name.length > 0);

    if (newParticipants.length === 0) {
        alert(t("invalidError"));
        return;
    }

    participants.push(...newParticipants);

    participantInput.value = "";

    drawnParticipants = [];

    updateParticipantCount();
    renderFightersList();

    // Abre a lista automaticamente após adicionar
    fightersList.open = true;

});

// ======================================
// LIMPAR COMBATENTES
// ======================================

clearParticipantsBtn.addEventListener("click", () => {

    if (participants.length === 0) return;

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
// MODO DE SORTEIO
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
// LAYOUT DOS RESULTADOS
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
// SORTEIO ALEATÓRIO
// ======================================

function getRandomParticipants(amount) {

    const shuffled = [...getAvailableParticipants()];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];

    }

    return shuffled.slice(0, amount);

}

// ======================================
// REALIZAR SORTEIO
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

    placeholder.style.display = "none";
    winnerDisplay.classList.add("show");

    updateWinnerLayout();

    const animation = setInterval(() => {

        const temporary = getRandomParticipants(drawMode);

        winnerNameOne.textContent = temporary[0] || "---";

        if (drawMode === 2) {
            winnerNameTwo.textContent = temporary[1] || "---";
        }

    }, 100);

    setTimeout(() => {

        clearInterval(animation);

        const winners = getRandomParticipants(drawMode);

        winnerNameOne.textContent = winners[0];

        if (drawMode === 2) {
            winnerNameTwo.textContent = winners[1];
        }

        if (!repeatToggle.checked) {
            drawnParticipants.push(...winners);
        }

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

    }, 2200);

});

// ======================================
// HISTÓRICO
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
// EXIBIR HISTÓRICO
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
// LIMPAR HISTÓRICO
// ======================================

clearHistoryBtn.addEventListener("click", () => {

    if (history.length === 0) return;

    if (!confirm(t("confirmHistory"))) return;

    history = [];

    renderHistory();

});

// ======================================
// REPETIÇÃO DE COMBATENTES
// ======================================

repeatToggle.addEventListener("change", () => {

    updateParticipantCount();

});

// ======================================
// TELA CHEIA
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
// INICIALIZAÇÃO
// ======================================

updateWinnerLayout();
updateParticipantCount();
renderHistory();
renderFightersList();

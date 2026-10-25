const soulCountEl = document.getElementById("soul-count");
const soulRateEl = document.getElementById("soul-rate");
const pumpkinEl = document.getElementById("pumpkin");
const whisperEl = document.getElementById("whisper");
const shopListEl = document.getElementById("shop-list");
const resetEl = document.getElementById("reset");

const shopTitleEl = document.getElementById("shop-title");
const baseTitle = document.title;

console.log("ClickMeSpook loeaded");

const state = {
    souls: 0,
    totalSouls: 0,
    owned: {},
    clickPower: 1,
    perSecond: 0,
};

const shopButtons = {};

function ownedCount(up) {
    return state.owned[up.id] || 0;
}

const SAVE_KEY = "clickmespook-save";

let resetting = false;

function save() {
    if (resetting) return;
    const data = {
        souls: state.souls,
        totalSouls: state.totalSouls,
        owned: state.owned,
        savedAt: Date.now(),
    };
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (err) {
        console.warn("could not save", err);
    }
}

function load() {
    let data;
    try {
        data = JSON.parse(localStorage.getItem(SAVE_KEY));
    } catch (err) {
        return 0;
    }
    if (!data) return 0;

    state.souls = data.souls || 0;
    state.totalSouls = data.totalSouls || 0;
    state.owned = data.owned || {};
    recalc();

    const seconds = Math.min((Date.now() - data.savedAt) / 1000, 8 * 60 * 60);
    const earned = Math.floor(state.perSecond * seconds);
    state.souls += earned;
    state.totalSouls += earned;
    return earned;
}

function reset() {
    if (!confirm("whipe everything and start over")) return;
    resetting = true;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

function costOf(up) {
    return Math.floor(up.baseCost * Math.pow(1.15, ownedCount(up)));
}

function recalc() {
    state.clickPower = 1;
    state.perSecond = 0;
    for (const up of UPGRADES) {
        const total = up.amount * ownedCount(up);
        if (up.type === "click") {
            state.clickPower += total;
        } else {
            state.perSecond += total;
        }
    }
}

function buy(up) {
    const cost = costOf(up);
    if (state.souls < cost) return;

    state.souls -= cost;
    state.owned[up.id] = ownedCount(up) + 1;
    recalc();
    render();
}

function buildShop() {
    for (const up of UPGRADES) {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className = "upgrade";
        btn.innerHTML = 
            '<span class="up-top"><span class="up-name"></span><span class="up-cost"></span></span>' +
            '<span class="up-desc">' + up.desc + "</span>";
        btn.addEventListener("click", () => buy(up));

        li.appendChild(btn);
        shopListEl.appendChild(li);
        shopButtons[up.id] = btn;
    }
}

let whisperStage = -1;

function updateWhisper() {
    let stage = 0;
    for (let i = 0; i < WHISPERS.length; i++) {
        if (state.totalSouls >= WHISPERS[i].at) stage = i;
    }
    if (stage === whisperStage) return;

    whisperStage = stage;
    whisperEl.textContent = WHISPERS[stage].text;
    shopTitleEl.textContent = stage >= 4 ? "Feed it" : "Offering";
    document.body.style.setProperty("--creep", stage / (WHISPERS.length - 1));
}

function render() {
    updateWhisper();
    soulCountEl.textContent = Math.floor(state.souls);
    soulRateEl.textContent = state.perSecond;

    for (const up of UPGRADES) {
        const btn = shopButtons[up.id];
        const cost = costOf(up);
        btn.querySelector(".up-name").textContent = up.name + " (" + ownedCount(up) + ")";
        btn.querySelector(".up-cost").textContent = cost;
        btn.disabled = state.souls < cost;
    }
}

function showGain(event, amount) {
    const gain = document.createElement("span");
    gain.className = "gain";
    gain.textContent = "+" + amount;
    gain.style.left = event.clientX + "px";
    gain.style.top = event.clientY + "px";
    document.body.appendChild(gain);
    gain.addEventListener("animationend", () => gain.remove());
}

pumpkinEl.addEventListener("click", (event) => {
    state.souls += state.clickPower;
    state.totalSouls += state.clickPower;
    showGain(event, state.clickPower);
    render();   
});

setInterval(() => {
    const gain = state.perSecond / 10;
    state.souls += gain;
    state.totalSouls += gain;
    render();
}, 100);

resetEl.addEventListener("click", reset);

setInterval(save, 5000);
window.addEventListener("beforeunload", save);
document.addEventListener("visibilitychange", () => {
    if (document.hidden) save();
    document.title = document.hidden && state.totalSouls >= 600 ? "come back" : baseTitle;
});

buildShop();
recalc();
const earned = load();
if (earned > 0) {
    whisperEl.textContent = "While you were gone, " + earned + " souls gathered.";
}
render();
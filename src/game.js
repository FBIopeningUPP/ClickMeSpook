const soulCountEl = document.getElementById("soul-count");
const soulRateEl = document.getElementById("soul-rate");
const pumpkinEl = document.getElementById("pumpkin");
const whisperEl = document.getElementById("whisper");
const shopListEl = document.getElementById("shop-list");
const resetEl = document.getElementById("reset");

console.log("ClickMeSpook loeaded");

const state = {
    souls: 0,
    totalSouls: 0,
    clickPower: 1,
    perSecond: 0,
};

function render() {
    soulCountEl.textContent = Math.floor(state.souls);
    soulRateEl.textContent = state.perSecond;
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

render();
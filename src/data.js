const UPGRADES = [
    { id: "finger", name: "My Finger", desc: "+1 per click", type: "click", amount: 1, baseCost: 15},
    { id: "candle",    name: "Black Candle", desc: "+1 per second",  type: "auto",  amount: 1,  baseCost: 40 },
    { id: "scarecrow", name: "Scarecrow",    desc: "+5 per second",  type: "auto",  amount: 5,  baseCost: 200 },
    { id: "gravedig",  name: "Grave Digger", desc: "+5 per click",   type: "click", amount: 5,  baseCost: 500 },
    { id: "crypt",     name: "Old Crypt",    desc: "+25 per second", type: "auto",  amount: 25, baseCost: 1500 },
];

const WHISPERS = [
    { at: 0,     text: "Go on. Click it." },
    { at: 50,    text: "It likes that." },
    { at: 200,   text: "You're getting good at this." },
    { at: 600,   text: "Why are you still here?" },
    { at: 1500,  text: "It's warm. Isn't that strange?" },
    { at: 5000,  text: "It knows you're watching." },
    { at: 15000, text: "Don't close the tab. It gets lonely." },
    { at: 50000, text: "You can't stop now." },
];
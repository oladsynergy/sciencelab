let chemicalA = null;
let chemicalB = null;

// List of chemicals with tied reactions
const chemicals = [
    { id: "NaCl", color: "lightblue" },
    { id: "H2O", color: "lightgreen" },
    { id: "C6H12O6", color: "pink" },
    { id: "O2", color: "lightgray" },
    { id: "CH4", color: "orange" },
    { id: "Fe2O3", color: "red" },
    { id: "HCl", color: "lightcoral" },
    { id: "NaOH", color: "cyan" },
    { id: "C2H5OH", color: "peachpuff" },
    { id: "H2SO4", color: "yellow" },
    { id: "H2O2", color: "purple" },
    { id: "CO2", color: "darkgray" }
];

// 20 tied reactions
const tiedReactions = {
    "NaCl:H2O": { result: "NaOH + HCl", sound: "bubble", color: "lightyellow", explanation: "Sodium chloride and water produce NaOH and HCl." },
    "C6H12O6:O2": { result: "CO2 + H2O", sound: "bubble", color: "lightyellow", explanation: "Glucose and oxygen react to produce carbon dioxide and water." },
    "CH4:O2": { result: "CO2 + H2O", sound: "explosion", color: "moccasin", explanation: "Methane and oxygen explode, producing carbon dioxide and water." },
    "Fe2O3:HCl": { result: "FeCl3 + H2O", sound: "bubble", color: "beige", explanation: "Iron(III) oxide reacts with hydrochloric acid to form iron chloride and water." },
    "H2SO4:NaOH": { result: "Na2SO4 + H2O", sound: "bubble", color: "lightyellow", explanation: "Sulfuric acid reacts with sodium hydroxide to form sodium sulfate and water." },
    "H2O:H2O2": { result: "O2 + H2O", sound: "bubble", color: "lightyellow", explanation: "Hydrogen peroxide decomposes to form oxygen and water." },
    "NaOH:HCl": { result: "NaCl + H2O", sound: "bubble", color: "lightyellow", explanation: "Sodium hydroxide neutralizes hydrochloric acid to form salt and water." },
    "C2H5OH:O2": { result: "CO2 + H2O", sound: "explosion", color: "moccasin", explanation: "Ethanol combusts in oxygen to form carbon dioxide and water." }
};

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const element = document.getElementById(data);
    const beakerContent = document.getElementById("beaker-content");

    if (!chemicalA) {
        chemicalA = element.id;
        beakerContent.innerText = `Added ${chemicalA}`;
    } else if (!chemicalB) {
        chemicalB = element.id;
        beakerContent.innerText = `Added ${chemicalA} and ${chemicalB}`;
        handleReaction(chemicalA, chemicalB);
    }
}

function handleReaction(chem1, chem2) {
    const reaction = tiedReactions[`${chem1}:${chem2}`] || tiedReactions[`${chem2}:${chem1}`];

    if (reaction) {
        document.getElementById("beaker").classList.add(reaction.sound);
        document.getElementById("beaker-content").innerHTML = `${chem1} + ${chem2} → ${reaction.result}`;
        logReaction(chem1, chem2, reaction);
        playSound(reaction.sound);

        document.getElementById("beaker").style.backgroundColor = reaction.color;
    } else {
        document.getElementById("beaker-content").innerText = `No Reaction`;
    }
}

function playSound(type) {
    const bubbleSound = document.getElementById("bubble-sound");
    const explosionSound = document.getElementById("explosion-sound");

    if (type === "bubble") {
        bubbleSound.play();
    } else if (type === "explosion") {
        explosionSound.play();
    }
}

function logReaction(chemA, chemB, reaction) {
    const log = `Mixed ${chemA} and ${chemB}: ${reaction.result}. ${reaction.explanation}`;
    const logElement = document.createElement("div");
    logElement.innerText = log;
    document.getElementById("logs").appendChild(logElement);
    clearBeaker();
}

function clearBeaker() {
    document.getElementById("beaker-content").innerHTML = "";
    chemicalA = null;
    chemicalB = null;
}

function clearLogs() {
    document.getElementById("logs").innerHTML = "";
}

function refreshLab() {
    chemicalA = null;
    chemicalB = null;
    const chemicalList = document.getElementById("chemical-list");
    chemicalList.innerHTML = "";

    const selectedChemicals = getRandomChemicals(2);
    selectedChemicals.forEach(chemical => {
        const chemicalDiv = document.createElement("div");
        chemicalDiv.classList.add("chemical");
        chemicalDiv.id = chemical.id;
        chemicalDiv.draggable = true;
        chemicalDiv.ondragstart = drag;
        chemicalDiv.style.backgroundColor = chemical.color;
        chemicalDiv.innerText = chemical.id;
        chemicalList.appendChild(chemicalDiv);
    });

    clearLogs();
}

function getRandomChemicals(count) {
    const shuffled = chemicals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Initial loading of chemicals
window.onload = refreshLab;

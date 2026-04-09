// @ts-check

console.log("Here is world.js");

// @ts-ignore
const mkElt = window["mkElt"];
console.log({ mkElt });

const startEarth = 8;

const startCountry = 0.2;


const {
    canvasEarth, ctxEarth, canvasEarthSize,
    canvasStat, ctxStat, canvasStatSize,
} = buildMain();
function buildMain() {
    const canvasEarth = mkElt("canvas");
    canvasEarth.id = "canvas-earth";
    const earthSize = 300;
    canvasEarth.width = earthSize;
    canvasEarth.height = earthSize;
    canvasEarth.style.width = `${earthSize}px`;
    canvasEarth.style.height = `${earthSize}px`;
    const ctxEarth = canvasEarth.getContext('2d');

    const canvasStat = mkElt("canvas");
    canvasStat.id = "canvas-stat";
    const statSize = 80;
    canvasStat.width = statSize;
    canvasStat.height = statSize;
    canvasStat.style.width = `${statSize}px`;
    canvasStat.style.height = `${statSize}px`;
    const ctxStat = canvasStat.getContext('2d');


    const inpPopSize = mkElt("input", { type: "range", name: "pop-size", min: startCountry, max: 1, step: 0.1 });
    const valPosSize = mkElt("span", undefined, "wait...");
    const lblPopSize = mkElt("label", undefined, [
        valPosSize,
        " billion"
    ]);
    inpPopSize.addEventListener("change", evt => {
        valPosSize.textContent = inpPopSize.value;
    });
    const eltPopSize = mkElt("span", undefined, [
        "Statistical unit",
        inpPopSize,
        lblPopSize
    ]);
    eltPopSize.style = `
        display: flex;
        flex-direction: column;
    `;
    const eltControls = mkElt("span", undefined, [
        eltPopSize
    ]);
    eltControls.style = `
        padding: 8px;
        outline: 2px dotted blue;
    `;
    const eltStat = mkElt("div", undefined, [
        canvasStat,
        eltControls
    ]);
    eltStat.style = `
        outLine: 8px dotted blue;
        display: flex;
        gap: 10px;
    `;
    const eltMain = mkElt("main", undefined, [
        eltStat,
        canvasEarth
    ]);

    const body = document.body.querySelector("main");
    body?.appendChild(eltMain);
    return {
        canvasEarth, ctxEarth, canvasEarthSize: earthSize,
        canvasStat, ctxStat, canvasStatSize: statSize,
    }
}

drawStat();
// throw Error("stop");

function drawStat() {
    // debugger;
    if (ctxStat == null) throw Error("ctxStat is null"); // for ts
    console.log("Canvas size:", canvasStat.width, canvasStat.height);
    console.log("canvasStatSize =", canvasStatSize);
    const w = canvasStatSize;
    const w3 = w / 3;
    ctxStat.lineWidth = 0.5;
    ctxStat.strokeStyle = "#0008";
    [1, 2].forEach(i => {
        // vertical
        ctxStat.beginPath();
        ctxStat.moveTo(w3 * i, 0);
        ctxStat.lineTo(w3 * i, w);
        ctxStat.stroke();
        // horizontal
        ctxStat.beginPath();
        ctxStat.moveTo(0, w3 * i);
        ctxStat.lineTo(w, w3 * i);
        ctxStat.stroke();

    });
}



/** @param {number} popBillion @returns {number} */
function population2radius(popBillion) {
    return popBillion * canvasEarthSize * 0.3 / 8;
}




// Start the animation
animate();

/*
{
    // debugger;
    const red = { color: "red" };
    const blue = { color: "skyblue", start: -30 };
    const yellow = { color: "yellow" };
    const green = { color: "green" };
    const white = { color: "white", align: "right", kerning: -5 };
    addCircularText("default", 100, 100, 70, canvas, { ...red });
    addCircularText("!inside", 100, 100, 70, canvas, { ...blue, textInside: false });
    addCircularText("!inward", 100, 100, 70, canvas, { ...yellow, inwardFacing: false });
    addCircularText("!inward,!inside", 100, 100, 70, canvas, { ...green, inwardFacing: false, textInside: false });
    addCircularText("1.6rem", 100, 100, 70, canvas, { ...white, fSize: "1.6rem" });
    // addCircularText("24px", 100, 100, 70, canvas, { ...white, fSize: "24px" });
}
*/


/**
 * @param {number} cX
 * @param {number} cY
 * @param {number} radius
 * @param {Object} [opts]
 * @param {number} [opts.width]
 * @param {string} [opts.color]
 * @param {string} [opts.fill]
 * @throws
 */
function drawCircle(cX, cY, radius, opts = {}) {
    const {
        width = 1,
        color = "red",
        fill = undefined,
        ...rest
    } = opts;
    if (Object.keys(rest).length > 0) {
        const unknownKeys = Object.keys(rest).join(", ");
        const msg = `drawCircle, unknown keys: ${unknownKeys}`;
        console.error(msg);
        debugger;
        throw Error(msg);
    }

    if (!ctxEarth) return; // dummy for ts
    ctxEarth.beginPath();
    ctxEarth.arc(cX, cY, radius, 0, Math.PI * 2);
    if (fill) {
        ctxEarth.fillStyle = fill;
        ctxEarth.fill();
    }
    ctxEarth.lineWidth = width;
    if (color) { ctxEarth.strokeStyle = color; }
    ctxEarth.stroke();
}
/**
 * @param {number} cX
 * @param {number} cY
 * @param {number} billion
 * @param {Object} opts
 * @param {number} opts.width
 * @param {string} opts.color
 * @param {string} [opts.fill]
 */

function drawPopulation(cX, cY, billion, opts) {
    drawCircle(cX, cY, population2radius(billion), opts);
}
function drawFixed() {
    if (!canvasEarth) return; // dummy for ts

    // Earth now
    const cXearth = canvasEarthSize * 0.5;
    const cYearth = canvasEarthSize * 0.5;
    drawPopulation(cXearth, cYearth, startEarth, { width: 1, color: "goldenrod", fill: "goldenrod" })

    // Country now
    const cXcountry = canvasEarthSize * 0.4;
    const cYcountry = canvasEarthSize * 0.4;
    drawPopulation(cXcountry, cYcountry, startCountry, { width: 1, color: "red", fill: "red" })

    // Mean selection
    // drawPopulation(cXcountry, cYcountry, startCountry * 10, { width: 2, color: "black" });
    // Max
}

let gridSizePopulation = 1;
function drawGrid() {
    const gridSize = population2radius(gridSizePopulation);
    canvasEarth


}

function animate() {
    if (!ctxEarth) return; // dummy for ts
    ctxEarth.clearRect(0, 0, canvasEarthSize, canvasEarthSize);
    drawFixed();

    // 3. Schedule the next frame
    // requestAnimationFrame(animate);
}




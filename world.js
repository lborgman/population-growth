// @ts-check

console.log("Here is world.js");

// @ts-ignore
const mkElt = window["mkElt"];
console.log({ mkElt });

/*
const idCanvasEarth = 'canvas-earth';
const canvasEarth = (document.getElementById(idCanvasEarth));
if (!canvasEarth) { debugger; throw Error(`Did not find "${idCanvasEarth}"`); }
const bcrEarth = canvasEarth.getBoundingClientRect();
canvasEarth.width = bcrEarth.width;
canvasEarth.height = bcrEarth.height;
const canvasEarthSize = canvasEarth.width;
const ctxEarth = canvasEarth.getContext('2d');
if (ctxEarth == null) { debugger; throw Error(`ctxEarth is null`); }
*/

/*
const idCanvasStat = 'canvas-stat';
const canvasStat = (document.getElementById(idCanvasStat));
if (!canvasStat) { debugger; throw Error(`Did not find "${idCanvasStat}"`); }
const bcrStat = canvasStat.getBoundingClientRect();
canvasStat.width = bcrStat.width;
canvasStat.height = bcrStat.height;
const canvasStatSize = canvasStat.width;
const ctxStat = canvasStat.getContext('2d');
if (ctxStat == null) { debugger; throw Error(`ctxStat is null`); }
*/

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
    const eltMain = mkElt("main", undefined, [
        canvasStat,
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



const startEarth = 8;
const cXearth = canvasEarthSize * 0.5;
const cYearth = canvasEarthSize * 0.5;

const startCountry = 0.2;
const cXcountry = canvasEarthSize * 0.4;
const cYcountry = canvasEarthSize * 0.4;

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
    drawPopulation(cXearth, cYearth, startEarth, { width: 1, color: "goldenrod", fill: "goldenrod" })
    // Country now
    drawPopulation(cXcountry, cYcountry, startCountry, { width: 1, color: "red", fill: "red" })
    // Mean selection
    drawPopulation(cXcountry, cYcountry, startCountry * 10, { width: 2, color: "black" });
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




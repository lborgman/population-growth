// @ts-check
const WORLD_VER = "0.0.1";
console.log(`here is world.js, module, ${WORLD_VER}`);
if (document.currentScript) { throw "world.js is not loaded as module"; }

// @ts-ignore
const mkElt = window["mkElt"];
console.log({ mkElt });

const modXY = await import("canvas-xy");
console.log({ modXY });


/** @typedef {number} NumHumans */
/** @type {NumHumans} */ const startEarth = 8;
/** @type {NumHumans} */ const startCountry = 0.2;


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
    console.log({ ctxStat });

    const startPopSize = 1; // FIX-ME:
    const inpStatPopSize = mkElt("input", {
        type: "range", name: "pop-size",
        min: startCountry, max: startEarth, value: startPopSize, step: 0.1
    });
    inpStatPopSize.value = startPopSize; // Needed. Looks like a bug in the HTML spec.

    // const valStatPopSize = mkElt("span", undefined, startPopSize.toFixed(1));
    const valStatPopSize = mkElt("span");
    const lblStatPopSize = mkElt("label", undefined, [
        valStatPopSize,
        " billion humans"
    ]);
    inpStatPopSize.addEventListener("change", () => {
        updateStatValues();
    });
    setTimeout(() => { updateStatValues(); }); // FIX-ME:
    function updateStatValues() {
        const billions =/** @type {NumHumans} */ parseFloat(inpStatPopSize.value);
        drawStat(billions);
        valStatPopSize.textContent = billions.toFixed(1);
    }
    const eltPopSize = mkElt("span", undefined, [
        "Statistical grid",
        inpStatPopSize,
        lblStatPopSize
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
        outline: 1px dashed blue;
    `;
    const eltStat = mkElt("div", undefined, [
        canvasStat,
        eltControls
    ]);
    eltStat.style = `
        outLine: 4px dotted red;
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

drawStat(startEarth);
// throw Error("stop");

/**
 * 
 * @param {NumHumans} statBillions 
 */
export function drawStat(statBillions) {
    // debugger;
    console.log({ ctxStat });
    if (ctxStat == null) throw Error("ctxStat is null"); // for ts
    ctxStat.clearRect(0, 0, canvasStatSize, canvasStatSize);


    // console.log("Canvas size:", canvasStat.width, canvasStat.height);
    // console.log("canvasStatSize =", canvasStatSize);
    const w = canvasStatSize;
    const w3 = w / 3;

    drawCountryInStat();
    drawGrid();
    function drawCountryInStat() {
        // FIX-ME: area
        // FIX-ME: maybe square instead of circle??
        // FIX-ME: Did I get the math correct now? (No! I do not have time to fix it at the moment...)
        const radius = w3 * Math.sqrt(startCountry / statBillions);
        ctxStat.beginPath();
        ctxStat.arc(w / 2, w / 2, radius, 0, Math.PI * 2);
        ctxStat.fillStyle = "red";
        ctxStat.fill();
        ctxStat.lineWidth = 1;
        ctxStat.strokeStyle = "orange";
        ctxStat.stroke();
    }
    function drawGrid() {
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
}



/** @param {number} popBillion @returns {number} */
function population2radius(popBillion) {
    return popBillion * canvasEarthSize * 0.3 / 8;
}




// Start the animation
animate();



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




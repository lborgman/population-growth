// @ts-check
const WORLD_VER = "0.0.1";
console.log(`here is world.js, module, ${WORLD_VER}`);
if (document.currentScript) { throw "world.js is not loaded as module"; }

// @ts-ignore
const mkElt = window["mkElt"];

const modXY = await import("canvas-xy");

const canvasTimeId = "canvas-time";

/** @typedef {number} NumHumans */
// https://worldpopulationhistory.org/map/2050/mercator/1/0/25/
// https://worldpopulationhistory.org/
// https://worldpopulationhistory.org/source-credits/
// https://guardian.ng/nigerian/how-many-kids-does-the-average-nigerian-have/
/** @type {NumHumans} */ const startEarth = 8;
/** @type {NumHumans} */ const startPartGrowing = 0.25;
/** @type {string} */ const colorPartGrowing = "#900";
/** @type {NumHumans} */ const startAfrica = 1.5;

let yearGeneration = 23;
let countryFertility = 6; // Children per woman


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
    // console.log({ ctxStat });

    const startPopSize = 1; // FIX-ME:
    const inpStatPopSize = mkElt("input", {
        type: "range", name: "pop-size",
        min: startPartGrowing, max: startAfrica, value: startAfrica, step: 0.1
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
    const eltGridSize = mkElt("span", undefined, [
        "Statistical grid",
        inpStatPopSize,
        lblStatPopSize
    ]);
    eltGridSize.id = "grid-size";
    const eltStat = mkElt("p", undefined, [
        canvasStat,
        eltGridSize
    ]);
    eltStat.id = "elt-stat";

    const canvasTime = mkElt("canvas");
    canvasTime.id = canvasTimeId;
    const eltTime = mkElt("div", undefined, canvasTime);
    eltTime.id = "time";
    // eltTime.append("TIME diagram");

    const eltResult = mkElt("div", undefined, [
        mkElt("h2", undefined, "Result:"),
        eltTime,
        canvasEarth
    ]);
    eltResult.id = "result";

    const rangeFertility = mkElt("input", {
        type: "range",
        min: 2, max: 7, value: countryFertility, step: 0.1
    });
    const spanFertility = mkElt("span", undefined, countryFertility.toFixed(1));
    const lblFertility = mkElt("label", undefined, [
        "Children per woman: ",
        spanFertility,
        rangeFertility,
    ]);
    lblFertility.style = `
        display: flex;
        gap: 10px;
    `;


    const rangeGeneration = mkElt("input", {
        type: "range",
        min: 20, max: 25, value: yearGeneration, step: 0.1
    });
    const spanGeneration = mkElt("span", undefined, yearGeneration.toFixed(1));
    const lblGeneration = mkElt("label", undefined, [
        "Year per generation: ",
        spanGeneration,
        rangeGeneration,
    ]);
    lblGeneration.style = `
        display: flex;
        gap: 10px;
    `;

    const eltAssuming = mkElt("div", undefined, [
        lblFertility,
        lblGeneration
    ]);
    eltAssuming.style = `
        display: flex;
        flex-direction: column;
        gap: 15px;
    `;
    const eltAssume = mkElt("p", undefined, [
        mkElt("h2", undefined, "Assume:"),
        // eltStat
        mkElt("p", undefined, [
            `
            Example: Africa.
            Population 1.5 billion.
            Africa has a fast growing part of at least 250 million.
            Let us look at
            `,
            mkElt("span", { style: `color:${colorPartGrowing};` }, "that part"),
            ":"
        ]),
        eltAssuming
    ]);
    eltAssume.id = "assumptions";
    eltAssume.addEventListener("change", () => {
        yearGeneration = parseFloat(rangeGeneration.value);
        spanGeneration.textContent = yearGeneration.toFixed(1);

        countryFertility = parseFloat(rangeFertility.value);
        spanFertility.textContent = countryFertility.toFixed(1);

        console.log("eltAssume change", { countryFertility, yearGeneration });
        drawXY();
    });

    const eltMain = mkElt("main", undefined, [
        eltAssume,
        eltResult
    ]);

    const body = document.body.querySelector("main");
    body?.appendChild(eltMain);
    return {
        canvasEarth, ctxEarth, canvasEarthSize: earthSize,
        canvasStat, ctxStat, canvasStatSize: statSize,
    }
}

// drawStat(startEarth);
// throw Error("stop");
drawXY();

function drawXY() {
    // console.log({ modXY });
    const canvasTime = /** @type {HTMLCanvasElement} */ (document.getElementById(canvasTimeId));
    if (!canvasTime) {
        debugger;
        throw Error(`Could not find "${canvasTimeId}"`);
    }
    const bcr = canvasTime.getBoundingClientRect();
    canvasTime.width = bcr.width;
    canvasTime.height = bcr.height;

    // const firstXY = getXY(2025, 2045, 2065);
    const firstXY = getXY(2025, 2025 + yearGeneration, 2065);
    const optsXY = {
        dotRadius: -1,
        maxY: 2.1,
        minX: 2025,
        dataLineColor: colorPartGrowing,
        paddingTop: 50,
    }
    const objDiagram = modXY.drawXYDiagram(canvasTime, firstXY, optsXY);

    const dataFirstYears = getXY(2025, 2025, 2025 + yearGeneration);
    modXY.drawDataXY(dataFirstYears, canvasTime.getContext("2d"), {
        dataLineWidth: 40,
        dataLineColor: "#aa06",
        // dataLineColor: "blue",
        dotRadius: -1,
        dotColor: "red",
        toCanvasX: objDiagram.toCanvasX,
        toCanvasY: objDiagram.toCanvasY,
    });



    // @ts-ignore
    const ctx = canvasTime.getContext("2d");

    const xB = objDiagram.toCanvasX(2025);
    const yB = objDiagram.toCanvasY(objDiagram.maxY);
    ctx.font = "16px Arial, sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("Billions of Humans per Year", xB, yB - 15);

    // Current population

    const x1 = objDiagram.toCanvasX(objDiagram.minX);
    const x2 = objDiagram.toCanvasX(objDiagram.maxX);
    const y = objDiagram.toCanvasY(startAfrica);
    ctx.strokeStyle = "#311";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();

    ctx.font = "14px Arial, sans-serif";
    ctx.fillStyle = "#311";
    ctx.fillText("Africa population today", x1 + 10, y - 15);
}

/**
 * 
 * @param {number} firstYear 
 * @param {number} yrStart 
 * @param {number} yrEnd 
 * @returns 
 */
function getXY(firstYear, yrStart, yrEnd) {
    // const countryFactorYear = Math.pow(2.75, 1 / 20);
    // const countryFactorYear = Math.pow(2.75, 1 / yearGeneration);
    const countryFactorYear = Math.pow(countryFertility / 2, 1 / yearGeneration);
    console.log({ countryFactorYear });
    const countryYX = [];
    for (let x = yrStart; x <= yrEnd; x++) {
        // const y = startPartGrowing * Math.pow(countryFactorYear, x - (yrStart - firstYear));
        const y = startPartGrowing
            * Math.pow(countryFactorYear, x - (yrStart))
            * Math.pow(countryFactorYear, (yrStart - firstYear))
            ;
        countryYX.push({ x, y });
        // console.log("y", y);
    }
    console.log({ firstYear, yrStart, yrEnd, countryYX });
    return countryYX;
}

/**
 * 
 * @param {NumHumans} statBillions 
 */
export function drawStat(statBillions) {
    // debugger;
    // console.log({ ctxStat });
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
        // FIX-ME: maybe square instead of circle?
        // FIX-ME: Did I get the math correct now? (No! I do not have time to fix it at the moment...)
        const radius = w3 * Math.sqrt(startPartGrowing / statBillions);
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
    drawPopulation(cXcountry, cYcountry, startPartGrowing, { width: 1, color: "red", fill: "red" })

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




// @ts-check

console.log("Here is world.js");


const idCanvasEarth = 'canvas-earth';
const canvasEarth = /** @type {HTMLCanvasElement|null} */ (document.getElementById(idCanvasEarth));
if (!canvasEarth) { debugger; throw Error(`Did not find "${idCanvasEarth}"`); }
const bcrEarth = canvasEarth.getBoundingClientRect();
canvasEarth.width = bcrEarth.width;
canvasEarth.height = bcrEarth.height;
const canvasEarthSize = canvasEarth.width;
const ctxEarth = canvasEarth.getContext('2d');
if (ctxEarth == null) { debugger; throw Error(`ctxEarth is null`); }

const idCanvasStat = 'canvas-stat';
const canvasStat = /** @type {HTMLCanvasElement|null} */ (document.getElementById(idCanvasStat));
if (!canvasStat) { debugger; throw Error(`Did not find "${idCanvasStat}"`); }
const bcrStat = canvasStat.getBoundingClientRect();
canvasStat.width = bcrStat.width;
canvasStat.height = bcrStat.height;
const canvasStatSize = canvasStat.width;
const ctxStat = canvasStat.getContext('2d');
if (ctxStat == null) { debugger; throw Error(`ctxStat is null`); }


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



/**
 * Rounded text
 * https://html5graphics.blogspot.com/2015/03/html5-canvas-rounded-text.html
 * 
 * @param {string} text The text to be displayed in circular fashion
 * @param {number} diameter The diameter of the circle
 * @param {number} cX
 * @param {number} cY
 * @param {HTMLCanvasElement} canvas
 * 
 * @param {Object} [opts]
 * @param {number} [opts.start] In degrees, 0 degrees is the top of the circle
 * @param {string} [opts.align] Positions text to left right or center of startAngle
 * @param {boolean} [opts.textInside] true to show inside the diameter. False to show outside
 * @param {boolean} [opts.inwardFacing] true for base of text facing inward. false for outward
 * @param {string} [opts.fName] name of font family
 * @param {string} [opts.fSize] size of font (1rem, 16px)
 * @param {number} [opts.kerning] expand/compact gap between letters, in pixels
 * @param {string} [opts.color] text color
 * @throws
 */
function addCircularText(text, diameter, cX, cY, canvas, opts = {}) {
    const {
        start = 0,
        align = "center",
        textInside = true,
        inwardFacing = true,
        fName = "sans-serif",
        fSize = "16px",
        kerning = 0,
        color = "black",
        ...rest
    } = opts;

    {
        /**
         * @param {any} v 
         * @param {string} wantType 
         * @throws
         */
        const myAssert = (v, wantType) => {
            if (typeof wantType != "string") {
                throw Error(`bad wantType "${typeof wantType}`);
            }
            const tofV = typeof v;
            if (wantType != tofV) {
                const msg = `Expected type "${wantType}", got "${tofV}"`;
                console.error(msg);
                debugger;
                throw Error(msg);
            }
        }
        myAssert(text, "string");
        myAssert(cX, "number");
        myAssert(cY, "number");
    }

    const ctxRef = canvas.getContext('2d');
    if (!ctxRef) {
        const msg = `canvas.getContext("2d") is null`;
        console.error(msg);
        debugger;
        throw Error(msg);
    }

    if (!["left", "right", "center"].includes(align)) {
        const msg = `Bad align: "${align}"`;
        console.error(msg);
        debugger;
        throw Error(msg);
    }

    const clockwise = align == "right" ? 1 : -1; // draw clockwise for aligned right. Else Anticlockwise
    let startAngle = start * (Math.PI / 180); // convert to radians
    const textHeight = getTextHeight();
    function getTextHeight() {
        const div = document.createElement("div");
        div.innerHTML = text;
        div.style.position = 'absolute';
        div.style.top = '-10000px';
        div.style.left = '-10000px';
        div.style.fontFamily = fName;
        div.style.fontSize = fSize;
        document.body.appendChild(div);
        const textHeight = div.offsetHeight;
        document.body.removeChild(div);
        return textHeight;
    }

    // in cases where we are drawing outside diameter,
    // expand diameter to handle it
    if (!textInside) diameter += textHeight * 2;

    // mainCanvas.width = diameter;
    // mainCanvas.height = diameter;

    // omit next line for transparent background
    // mainCanvas.style.backgroundColor = 'lightgray'; 
    ctxRef.fillStyle = color;
    ctxRef.font = fSize + ' ' + fName;

    // Reverse letters for align Left inward, align right outward 
    // and align center inward.
    if (((["left", "center"].indexOf(align) > -1) && inwardFacing) || (align == "right" && !inwardFacing)) text = text.split("").reverse().join("");

    // Setup letters and positioning
    // ctxRef.translate(diameter / 2, diameter / 2); // Move to center
    ctxRef.translate(cX, cY); // Move to center

    // FIX-ME:
    // startAngle += (Math.PI * !inwardFacing); // Rotate 180 if outward
    ctxRef.textBaseline = 'middle'; // Ensure we draw in exact center
    ctxRef.textAlign = 'center'; // Ensure we draw in exact center

    // rotate 50% of total angle for center alignment
    if (align == "center") {
        for (var j = 0; j < text.length; j++) {
            var charWid = ctxRef.measureText(text[j]).width;
            startAngle += ((charWid + (j == text.length - 1 ? 0 : kerning)) / (diameter / 2 - textHeight)) / 2 * -clockwise;
        }
    }

    // Phew... now rotate into final start position
    ctxRef.rotate(startAngle);

    // Now for the fun bit: draw, rotate, and repeat
    for (let j = 0; j < text.length; j++) {
        const charWid = ctxRef.measureText(text[j]).width; // half letter
        // rotate half letter
        ctxRef.rotate((charWid / 2) / (diameter / 2 - textHeight) * clockwise);
        // draw the character at "top" or "bottom" 
        // depending on inward or outward facing
        ctxRef.fillText(text[j], 0, (inwardFacing ? 1 : -1) * (0 - diameter / 2 + textHeight / 2));

        ctxRef.rotate((charWid / 2 + kerning) / (diameter / 2 - textHeight) * clockwise); // rotate half letter
    }
    ctxRef.rotate(0);
    // Return it
    // return (mainCanvas);
    ctxRef.setTransform(1, 0, 0, 1, 0, 0);
}
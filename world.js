// @ts-check

console.log("Here is world.js");

const fixedCircles = [
    {
        x: 100, y: 100,
        // vx: 3.5, vy: -2.8,
        radius: 25,
        // fill: '#ff0088',
        stroke: { color: "white", width: 5 }
    },
    /*
    {
        x: 40, y: 30,
        vx: -2.1, vy: 4.2,
        radius: 18,
        fill: '#00ccff'
    },
    {
        x: 60, y: 20,
        vx: 1.8, vy: -3.5,
        radius: 30,
        fill: '#ffcc00'
    },
    */
];

const defaultLineWidth = 10;

const idCanvas = 'circles-canvas';
const canvas =
    /** @type {HTMLCanvasElement|null} */
    (document.getElementById(idCanvas));
if (!canvas) {
    debugger;
    throw Error(`Did not find "${idCanvas}"`);
}
// const body = document.querySelector("body");
// const bBcr = body.getBoundingClientRect();
// console.log({ body, bBcr });
const cBcr = canvas.getBoundingClientRect();
console.log({ cBcr });
// debugger;
canvas.width = cBcr.width;
canvas.height = cBcr.height;
const canvasW = canvas.width;

/** @param {number} popBillion @returns {number} */
function population2radius(popBillion) {
    return popBillion * canvasW * 0.3 / 8;
}


const ctx = canvas.getContext('2d');
if (ctx == null) {
    debugger;
    throw Error(`ctx is null`);
}

const startEarth = 8;
const cXearth = canvasW * 0.5;
const cYearth = canvasW * 0.5;

const startCountry = 0.2;
const cXcountry = canvasW * 0.4;
const cYcountry = canvasW * 0.4;

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

    if (!ctx) return; // dummy for ts
    ctx.beginPath();
    ctx.arc(cX, cY, radius, 0, Math.PI * 2);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    ctx.lineWidth = width;
    if (color) { ctx.strokeStyle = color; }
    ctx.stroke();
}
/**
 * @param {number} cX
 * @param {number} cY
 * @param {number} billion
 * @param {Object} opts
 * @param {number} opts.width
 * @param {string} opts.color
 * @param {string} opts.fill
 */

function drawPopulation(cX, cY, billion, opts) {
    drawCircle(cX, cY, population2radius(billion), opts);
}
function drawFixed() {
    if (!canvas) return; // dummy for ts
    // Start
    drawPopulation(cXearth, cYearth, startEarth, { width: 1, color: "goldenrod", fill: "goldenrod" })
    // Country
    drawPopulation(cXcountry, cYcountry, startCountry, { width: 1, color: "red", fill: "red" })
    // Mean selection
    drawPopulation(cXcountry, cYcountry, startCountry * 10, { width: 2, color: "black" , fill: undefined});
    // Max
}
function animate() {
    if (!ctx) return; // dummy for ts
    if (!canvas) return; // dummy for ts

    // 1. Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFixed();
    return;

    // 2. Update and draw each circle
    for (let i = 0; i < fixedCircles.length; i++) {
        const c = fixedCircles[i];

        // Draw fixed circles
        const stroke = c.stroke;
        drawCircle(c.x, c.y, c.radius, 10, stroke.color, undefined);

        /*
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        const fill = c.fill;
        if (fill) {
            ctx.fillStyle = c.fill;
            ctx.fill();
        }
        // const stroke = c.stroke;
        if (stroke) {
            const { color, width } = stroke;
            const w = width != undefined ? width : defaultLineWidth;
            console.log({ color, width, w });
            ctx.strokeStyle = color;
            ctx.lineWidth = w;
            ctx.stroke();
        }
        */
    }

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
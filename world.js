// @ts-check

console.log("Here is world.js");

const fixedCircles = [
    {
        x: 100, y: 100,
        // vx: 3.5, vy: -2.8,
        radius: 25,
        // fill: '#ff0088',
        stroke: { color: "greenyellow", width: 5 }
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


const ctx = canvas.getContext('2d');
if (ctx == null) {
    debugger;
    throw Error(`ctx is null`);
}


// Start the animation
// animate();

{
    let cX, cY;
    debugger;
    addCircularText("test of text", 100, cX, cY, canvas,
        {
            color: "red",
        }
    );
}

function animate() {
    if (!ctx) return; // dummy for ts
    if (!canvas) return; // dummy for ts

    // 1. Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Update and draw each circle
    for (let i = 0; i < fixedCircles.length; i++) {
        const c = fixedCircles[i];

        // Update position
        // c.x += c.vx;
        // c.y += c.vy;

        // Optional: add some friction or other behaviors here

        // Draw fixed circles
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        const fill = c.fill;
        if (fill) {
            ctx.fillStyle = c.fill;
            ctx.fill();
        }

        const stroke = c.stroke;
        if (stroke) {
            const { color, width } = stroke;
            const w = width != undefined ? width : defaultLineWidth;
            console.log({ color, width, w });
            ctx.strokeStyle = color;
            ctx.lineWidth = w;
            ctx.stroke();
        }
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
 * @param {string} [opts.fSize] size of font
 * @param {number} [opts.kerning] expand/compact gap between letters, in pixels
 * @param {string} [opts.color] text color
 * @throws
 */
// function getCircularText(text, diameter, startAngle, align, textInside, inwardFacing, fName, fSize, kerning) {
function addCircularText(text, diameter, cX, cY, canvas, opts) {
    const {
        start = 0,
        align = "center",
        textInside = true,
        inwardFacing = true,
        fName = "sans-serif",
        fSize = "16px",
        kerning = 0,
        color = "black"
    } = opts | {};
    /*
    // text:         The text to be displayed in circular fashion
    // diameter:     The diameter of the circle around which the text will
    //               be displayed (inside or outside)
    // startAngle:   In degrees, Where the text will be shown. 0 degrees
    //               if the top of the circle
    // align:        Positions text to left right or center of startAngle
    // textInside:   true to show inside the diameter. False to show outside
    // inwardFacing: true for base of text facing inward. false for outward
    // fName:        name of font family. Make sure it is loaded
    // fSize:        size of font family. Don't forget to include units
    // kearning:     0 for normal gap between letters. positive or
    //               negative number to expand/compact gap in pixels
    //------------------------------------------------------------------------
    */

    ////// declare and intialize canvas, reference, and useful variables

    // align = align.toLowerCase();
    // var mainCanvas = document.createElement('canvas');
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
    ctxRef.translate(diameter / 2, diameter / 2); // Move to center
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
}
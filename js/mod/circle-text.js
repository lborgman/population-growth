// @ts-check
const CIRCLE_TEXT_VER = "0.0.1";
console.log(`here is circle-text.js, module, ${CIRCLE_TEXT_VER}`);
if (document.currentScript) { throw "circle-text.js is not loaded as module"; }

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
export function addCircularText(text, diameter, cX, cY, canvas, opts = {}) {
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

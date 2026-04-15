// @ts-check
const CANVAS_XY_VER = "0.0.1";
console.log(`here is canvas-xy.js, module, ${CANVAS_XY_VER}`);
if (document.currentScript) { throw "canvas-xy.js is not loaded as module"; }


/** @typedef {any[]} DataXY */ // FIX-ME:

/**
 * @param {HTMLCanvasElement} canvas 
 * @param {DataXY} dataXY
 *
 * @param {Object} [opts]
 * 
 * @param {string} [opts.axisColor]
 * @param {number} [opts.axisLineWidth]
 * 
 * param {boolean} [opts.connectDots]
 * 
 * @param {number} [opts.dataLineWidth]
 * @param {string} [opts.dataLineColor]
 * 
 * @param {number} [opts.dotRadius]
 * @param {string} [opts.dotColor]
 * 
 * @param {number} [opts.gridCount]
 * @param {string} [opts.gridColor]
 * @param {number} [opts.gridLineWidth]
 * 
 * @param {string} [opts.labelColor]
 * @param {number} [opts.padding]
 * @param {number} [opts.paddingTop]
 */
export function drawXYDiagram(canvas, dataXY, opts = {}) {
    const defaultLineWidt = 1.5;
    const rootColor = getCurrentColor();
    const defaultGridColor = withAlpha(rootColor, 0.1);
    const defaultAxisColor = withAlpha(rootColor, 0.5);
    const defaultLabelColor = withAlpha(rootColor, 0.8);
    const defaultPadding = 30;
    const {
        axisColor = defaultAxisColor,
        axisLineWidth = defaultLineWidt,

        dataLineWidth = defaultLineWidt,
        dataLineColor = "#f00f",

        dotRadius = 4,
        dotColor = "#378ADD",

        gridCount = 4,
        // gridColor = "#cccccc",
        gridColor = defaultGridColor,
        gridLineWidth = defaultLineWidt,

        // labelColor = "#666666",
        labelColor = defaultLabelColor,

        minY = 0,
        maxY,
        minX,

        padding = defaultPadding,
        paddingTop = padding,
        ...rest
    } = opts;
    if (Object.keys(rest).length > 0) {
        const msg = `Unknown options: ${Object.keys(rest).join(", ")}`;
        console.error(msg);
        debugger;
        throw Error(msg);
    }

    if (!canvas) throw Error(`canvas is "${canvas}"`);
    if (!(canvas instanceof HTMLCanvasElement)) throw Error("canvas is not HTMLCanvasElement");

    const ctx = canvas.getContext("2d");
    if (!(ctx instanceof CanvasRenderingContext2D)) throw Error("ctx is not CanvasRenderingContext2D");

    // Check data format
    dataXY.forEach(p => {
        const { x, y, ...rest } = p;
        const restKeys = Object.keys(rest);
        if (restKeys.length > 0) {
            debugger;
            throw Error("Bad dataXY");
        }
        const tofX = typeof x;
        if (tofX != "number") {
            debugger;
            throw Error("Bad dataXY");
        }
        const tofY = typeof y;
        if (tofY != "number") {
            debugger;
            throw Error("Bad dataXY");
        }
    });

    const W = canvas.width;
    const H = canvas.height;
    // Clear
    ctx.clearRect(0, 0, W, H);

    // Compute data bounds
    const xs = dataXY.map(p => p.x);
    const ys = dataXY.map(p => p.y);
    // const minX = opts.minX ?? Math.min(...xs);
    const maxX = opts.maxX ?? Math.max(...xs);
    // const maxY = opts.maxY ?? Math.max(...ys);
    const ourMaxY = maxY ?? Math.max(...ys);
    const ourMinX = minX ?? Math.min(...xs);

    const yMarkers = calculateNiceMarkers(maxY, gridCount - 0);
    const yMarkW = Math.max(...yMarkers.map(val => ctx.measureText(val.toFixed(1)).width));
    console.log({ yMarkers, yMarkW });

    // Map data coords → canvas pixels
    const toCanvasX = x => yMarkW + padding + ((x - ourMinX) / (maxX - ourMinX)) * (W - padding * 2);
    const toCanvasY = y => H - padding - ((y - minY) / (ourMaxY - minY)) * (H - padding - paddingTop);

    drawAxisAndGrid();
    drawDataXY(dataXY, ctx,
        {
            dataLineWidth,
            dataLineColor,
            dotRadius,
            dotColor,
            toCanvasX,
            toCanvasY,
        }
    );


    return {
        toCanvasX, toCanvasY,
        minX, maxX,
        minY, maxY,
        dataLineWidth,
        dotRadius,
    }

    function drawAxisAndGrid() {
        if (!(ctx instanceof CanvasRenderingContext2D)) throw Error("bad ctx");
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = gridLineWidth;

        const w0 = ctx.measureText("0").width * 1.2;
        for (let i = 0, len = yMarkers.length; i < len; i++) {
            const yVal = yMarkers[i];
            const cy = toCanvasY(yVal);

            // Horizontal grid lines
            ctx.beginPath();
            ctx.moveTo(padding + yMarkW, cy);
            ctx.lineTo(W - padding , cy);
            ctx.stroke();

            // Y-axis labels
            ctx.fillStyle = labelColor;
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.textAlign = "left";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            // ctx.fillText(yVal.toFixed(1), padding - yMarkW, cy);
            ctx.fillText(yVal.toFixed(1), padding + yMarkW - w0, cy);
        }

        // Draw vertical grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = gridLineWidth;
        for (let i = 0; i <= gridCount; i++) {
            const xVal = minX + (i / gridCount) * (maxX - minX);
            const cx = toCanvasX(xVal);

            // Vertical grid line
            ctx.beginPath();
            ctx.moveTo(cx, paddingTop);
            ctx.lineTo(cx, H - padding);
            ctx.stroke();

            // X-axis labels
            ctx.fillStyle = labelColor;
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(xVal.toFixed(0), cx, H - padding + 18);

        }

        // Draw axes
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = axisLineWidth;
        ctx.beginPath();
        // Vertical
        ctx.moveTo(padding + yMarkW, paddingTop);
        ctx.lineTo(padding + yMarkW, H - padding);
        // Horizontal
        ctx.lineTo(W - padding + yMarkW, H - padding);
        ctx.stroke();
    }


}

/**
 * @param {DataXY} dataXY
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} [optsDrawXY]
 * @param {number} [optsDrawXY.dataLineWidth]
 * @param {string} [optsDrawXY.dataLineColor]
 * @param {number} [optsDrawXY.dotRadius]
 * @param {string} [optsDrawXY.dotColor]
 * @param {function} [optsDrawXY.toCanvasX]
 * @param {function} [optsDrawXY.toCanvasY]
 */
export function drawDataXY(dataXY, ctx, optsDrawXY = {}) {
    const {
        dataLineWidth,
        dataLineColor,
        dotRadius,
        dotColor,
        toCanvasX,
        toCanvasY,
        ...rest
    } = optsDrawXY;
    if (Object.keys(rest).length > 0) {
        const msg = `Unknown options: ${Object.keys(rest).join(", ")}`;
        console.error(msg);
        debugger;
        throw Error(msg);
    }
    if (typeof dataLineWidth == "undefined") throw Error("dataLineWidth is required");
    if (typeof dataLineColor == "undefined") throw Error("dataLineColor is required");
    if (typeof dotRadius == "undefined") throw Error("dotRadius is required");
    if (typeof dotColor == "undefined") throw Error("dotColor is required");
    if (typeof toCanvasX == "undefined") throw Error("toCanvasX is required");
    if (typeof toCanvasY == "undefined") throw Error("toCanvasY is required");

    // Data lines
    if (dataLineWidth > 0 && dataXY.length > 1) {
        // ctx.strokeStyle = dotColor;
        ctx.strokeStyle = dataLineColor;
        ctx.lineWidth = dataLineWidth;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(dataXY[0].x), toCanvasY(dataXY[0].y));
        for (let i = 1; i < dataXY.length; i++) {
            ctx.lineTo(toCanvasX(dataXY[i].x), toCanvasY(dataXY[i].y));
        }
        ctx.stroke();
    }

    // Data dots
    ctx.fillStyle = dotColor;
    if (dotRadius > 0) {
        for (const point of dataXY) {
            ctx.beginPath();
            ctx.arc(toCanvasX(point.x), toCanvasY(point.y), dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/**
 * Takes an rgb() or rgba() string and returns a new rgba() string with the desired opacity.
 * @param {string} rgbString - e.g. "rgb(51, 51, 51)" or "rgba(51, 51, 51, 0.8)"
 * @param {number} alpha - opacity from 0 (transparent) to 1 (opaque)
 * @returns {string} - e.g. "rgba(51, 51, 51, 0.5)"
 */
function withAlpha(rgbString, alpha = 0.5) {
    // Normalize: remove whitespace and handle both rgb() and rgba()
    const cleaned = rgbString.trim();

    // If it's already rgba(), replace the existing alpha
    if (cleaned.startsWith('rgba')) {
        return cleaned.replace(/rgba?\(([^)]+)\)/, (_, values) => {
            const parts = values.split(',').map(v => v.trim());
            // Keep r, g, b and replace/add alpha
            return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
        });
    }

    // For rgb() → convert to rgba()
    if (cleaned.startsWith('rgb')) {
        return cleaned
            .replace('rgb', 'rgba')
            .replace(')', `, ${alpha})`);
    }

    // Fallback (in case something unexpected)
    return `rgba(0, 0, 0, ${alpha})`;
}
function getCurrentColor(element = document.documentElement) {
    return getComputedStyle(element).color;
}

//#region /////// Nice axis markers intervals
// https://chat.deepseek.com/share/7mlvpu8o3dphl6q0yo
function calculateNiceMarkers(max, numMarkers) {
    if (max <= 0) throw Error(`max == ${max} < 0`);

    // Calculate raw interval (4 intervals for 5 markers)
    const rawInterval = max / numMarkers;

    // Find the nice interval (1, 2, or 5 × 10^k)
    const niceInterval = getNiceInterval(rawInterval);

    // Calculate markers starting from 0
    const markers = [];
    for (let i = 0; i < numMarkers; i++) {
        markers.push(i * niceInterval);
    }

    return markers;
}
function getNiceInterval(rawInterval) {
    // Get the order of magnitude (power of 10)
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));

    // Calculate normalized value (1-10 range)
    const normalized = rawInterval / magnitude;

    // Choose the closest nice number: 1, 2, or 5
    let niceNormalized;
    if (normalized <= 1.5) {
        niceNormalized = 1;
    } else if (normalized <= 3.5) {
        niceNormalized = 2;
    } else {
        niceNormalized = 5;
    }

    // Return the nice interval
    return niceNormalized * magnitude;
}
////////////////////////////////
//#endregion

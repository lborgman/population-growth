// @ts-check
const CANVAS_XY_VER = "0.0.1";
console.log(`here is canvas-xy.js, module, ${CANVAS_XY_VER}`);
if (document.currentScript) { throw "canvas-xy.js is not loaded as module"; }



/**
 * @param {HTMLCanvasElement} canvas 
 * @param {any} dataXY  -- FIX-ME:
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
 */
export function drawXYDiagram(canvas, dataXY, opts = {}) {
    const defaultLineWidt = 1.5;
    const {
        // connectDots = true,
        axisColor = "#999999",
        axisLineWidth = defaultLineWidt,

        dataLineWidth = defaultLineWidt,
        // dataLineColor = "red",
        dataLineColor = "#f00f",

        dotRadius = 4,
        dotColor = "#378ADD",

        gridCount = 4,
        gridColor = "#cccccc",
        gridLineWidth = defaultLineWidt,

        labelColor = "#666666",
        padding = 50,
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
    const minX = opts.minX ?? Math.min(...xs);
    const maxX = opts.maxX ?? Math.max(...xs);
    const minY = opts.minY ?? Math.min(...ys);
    const maxY = opts.maxY ?? Math.max(...ys);

    // Map data coords → canvas pixels
    const toCanvasX = x => padding + ((x - minX) / (maxX - minX)) * (W - padding * 2);
    const toCanvasY = y => H - padding - ((y - minY) / (maxY - minY)) * (H - padding * 2);

    // Draw grid lines
    // const gridCount = opts.gridCount ?? 5;
    ctx.strokeStyle = gridColor;
    // ctx.lineWidth = 0.5;
    ctx.lineWidth = gridLineWidth;
    for (let i = 0; i <= gridCount; i++) {
        const xVal = minX + (i / gridCount) * (maxX - minX);
        const yVal = minY + (i / gridCount) * (maxY - minY);
        const cx = toCanvasX(xVal);
        const cy = toCanvasY(yVal);

        // Vertical grid line
        ctx.beginPath();
        ctx.moveTo(cx, padding);
        ctx.lineTo(cx, H - padding);
        ctx.stroke();

        // Horizontal grid line
        ctx.beginPath();
        ctx.moveTo(padding, cy);
        ctx.lineTo(W - padding, cy);
        ctx.stroke();

        // X-axis labels
        ctx.fillStyle = labelColor;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(xVal.toFixed(0), cx, H - padding + 18);

        // Y-axis labels
        ctx.textAlign = "right";
        ctx.fillText(yVal.toFixed(0), padding - 8, cy + 4);
    }

    // Draw axes
    // ctx.strokeStyle = opts.axisColor ?? "#999999";
    ctx.strokeStyle = axisColor;
    // ctx.lineWidth = 1.5;
    ctx.lineWidth = axisLineWidth;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, H - padding);
    ctx.lineTo(W - padding, H - padding);
    ctx.stroke();

    // Optionally connect dots with lines
    // if (connectDots && dataXY.length > 1) {
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

    // Draw dots
    ctx.fillStyle = dotColor;
    if (dotRadius > 0) {
        for (const point of dataXY) {
            ctx.beginPath();
            ctx.arc(toCanvasX(point.x), toCanvasY(point.y), dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
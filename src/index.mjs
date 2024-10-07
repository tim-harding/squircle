/**
 * @typedef {Object} Point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 */

/**
 * Register the squircle CSS Paint worklet.
 *
 * @param {string} workletUrl URL of the squircle paint worklet
 */
export function register(workletUrl) {
  if (!CSS || !CSS.registerProperty) return;

  CSS.registerProperty({
    name: "--squircle-radius",
    syntax: "<length>",
    inherits: false,
    initialValue: "0px",
  });

  CSS.registerProperty({
    name: "--squircle-border-width",
    syntax: "<length>",
    inherits: false,
    initialValue: "0px",
  });

  CSS.registerProperty({
    name: "--squircle-fill",
    syntax: "<color>",
    inherits: true,
    initialValue: "transparent",
  });

  CSS.registerProperty({
    name: "--squircle-border-color",
    syntax: "<color>",
    inherits: true,
    initialValue: "transparent",
  });

  /* @ts-ignore */
  if (!CSS.paintWorklet) return;
  /* @ts-ignore */
  CSS.paintWorklet.addModule(workletUrl);
}

/**
 * Creates a path to be used with the SVG `d` attribute
 *
 * @param {number} x Top-left corner x-coordinate
 * @param {number} y Top-left corner y-coordinate
 * @param {number} width Rectangle width
 * @param {number} height Rectangle height
 * @param {number} radius Border radius
 * @returns {string}
 */
export function path(x, y, width, height, radius) {
  const iterator = points(x, y, width, height, radius);
  const { x: initialX, y: initialY } = iterator.next().value ?? { x: 0, y: 0 };
  let out = `M ${initialX} ${initialY} `;
  for (const { x, y } of iterator) {
    out += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return out;
}

/**
 * Draws a squircle to the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x Top-left corner x-coordinate
 * @param {number} y Top-left corner y-coordinate
 * @param {number} width Rectangle width
 * @param {number} height Rectangle height
 * @param {number} radius Border radius
 */
export function paint(ctx, x, y, width, height, radius) {
  const iterator = points(x, y, width, height, radius);
  const { x: initialX, y: initialY } = iterator.next().value ?? { x: 0, y: 0 };
  ctx.beginPath();
  ctx.moveTo(initialX, initialY);
  for (const { x, y } of iterator) {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * Generates the points for a squircle
 *
 * @param {number} x Top-left corner x-coordinate
 * @param {number} y Top-left corner y-coordinate
 * @param {number} width Rectangle width
 * @param {number} height Rectangle height
 * @param {number} radius Border radius
 * @yields {Point}
 */
export function* points(x, y, width, height, radius) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const l = Math.min(w, h) / 2;
  const r = Math.max(0, Math.min(radius, l));
  const segments = Math.ceil(Math.sqrt(r)) * 4;
  const exponent = r / l;
  const indexToParameter = Math.PI / 2 / segments;

  for (let i = 0; i < 4; i++) {
    const sideX = i === 0 || i === 3 ? 0 : 1;
    const sideY = i < 2 ? 0 : 1;
    const odd = i % 2;
    const even = 1 - odd;
    const rotateX = (sideX * 2 - 1) * l;
    const rotateY = (sideY * 2 - 1) * l;
    const m11 = rotateY * even;
    const m21 = rotateY * odd;
    const m12 = rotateX * odd;
    const m22 = rotateX * even;
    const m13 = w * sideX + l * (1 - sideX * 2) + x;
    const m23 = h * sideY + l * (1 - sideY * 2) + y;

    for (let i = 0; i < segments + 1; i++) {
      const t = i * indexToParameter;
      const x0 = Math.cos(t) ** exponent;
      const y0 = Math.sin(t) ** exponent;
      const x = x0 * m11 + y0 * m12 + m13;
      const y = x0 * m21 + y0 * m22 + m23;
      yield { x, y };
    }
  }
}

/**
 * @typedef {{ x: number, y: number }} Point
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
  const { x: xInit, y: yInit } = iterator.next().value ?? { x: 0, y: 0 };
  ctx.beginPath();
  ctx.moveTo(xInit, yInit);
  for (const { x, y } of iterator) {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * Iterates the points for a squircle
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
    const left = i > 0 && i < 3;
    const top = i > 1;
    const offsetX = (left ? l : w - l) + x;
    const offsetY = (top ? l : h - l) + y;
    const rotateX = l * (left ? -1 : 1);
    const rotateY = l * (top ? -1 : 1);
    const odd = i % 2;
    const even = 1 - odd;
    const m11 = rotateY * even;
    const m21 = rotateY * odd;
    const m12 = rotateX * odd;
    const m22 = rotateX * even;

    for (const { x: x0, y: y0 } of cornerPoints(
      segments,
      indexToParameter,
      exponent,
    )) {
      const x = x0 * m11 + y0 * m12 + offsetX;
      const y = x0 * m21 + y0 * m22 + offsetY;
      yield { x, y };
    }
  }
}

/**
 * Iterates the points for a single squircle corner. Points are bounded by the
 * the first quartile unit square and are generated from (1,0) to (0,1).
 *
 * @param {number} segments Number of line segments
 * @param {number} indexToParameter Scalar to convert from the loop index in
 * 0..segments+1 to a parameter in 0..pi/2 for the parametric superellipse
 * formula
 * @param {number} exponent Power to raise circle coordinates to in the
 * parametric superellipse formula
 * @yields {Point}
 */
export function* cornerPoints(segments, indexToParameter, exponent) {
  yield { x: 1, y: 0 };
  for (let i = 1; i < segments; i++) {
    const t = i * indexToParameter;
    const x = Math.cos(t) ** exponent;
    const y = Math.sin(t) ** exponent;
    yield { x, y };
  }
  yield { x: 0, y: 1 };
}

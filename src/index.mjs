/**
 * @typedef {Object} Point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 *
 * @typedef {Object} Matrix2x2 A rotation matrix, indexed by row then column
 * @property {number} m11
 * @property {number} m21
 * @property {number} m12
 * @property {number} m22
 *
 * @typedef {Object} CornerArguments
 * @property {number} segments Number of line segments
 * @property {number} indexToParameter Scalar to convert from an index in
 * 0..segments+1 to a parameter in 0..pi/2 for the parametric superellipse
 * equation
 * @property {number} exponent Exponent for the parametric superellipse equation
 *
 * @typedef {{ w: number, h: number, l: number, r: number}} ClampedArguments
 * @property {number} w Rectangle width
 * @property {number} h Rectangle height
 * @property {number} l Half length of the shorter rectangle side
 * @property {radius} r Corner radius
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
 * @param {number} x Top-left corner x-coordinate
 * @param {number} y Top-left corner y-coordinate
 * @param {number} width Rectangle width
 * @param {number} height Rectangle height
 * @param {number} radius Border radius
 * @returns {string}
 */
export function polygon(x, y, width, height, radius) {
  let out = "polygon(";
  const { w, h, l, r } = clampArguments(width, height, radius);
  const { segments, exponent, indexToParameter } = cornerParameters(r, l);
  const q0 = cornerPoints(segments, indexToParameter, exponent);
  for (const { x: x0, y: y0 } of q0) {
    const x = ((1 - x0) * radius).toFixed(2);
    const y = ((1 - y0) * radius).toFixed(2);
    out += `calc(100% - ${x}px) calc(100% - ${y}px), `;
  }
  out += "0% 100%, 0% 0%, 100% 0%)";
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
  const { w, h, l, r } = clampArguments(width, height, radius);
  const { segments, exponent, indexToParameter } = cornerParameters(r, l);

  for (let i = 0; i < 4; i++) {
    const { x: sideX, y: sideY } = side(i);
    const m13 = translate1D(sideX, x, w, l);
    const m23 = translate1D(sideY, y, h, l);
    let { m11, m21, m12, m22 } = rotateScale(sideX, sideY, l);

    for (const { x: x0, y: y0 } of cornerPoints(
      segments,
      indexToParameter,
      exponent,
    )) {
      const x = x0 * m11 + y0 * m12 + m13;
      const y = x0 * m21 + y0 * m22 + m23;
      yield { x, y };
    }
  }
}

/**
 * @param {number} width Rectangle width
 * @param {number} height Rectangle height
 * @param {number} radius Corner radius
 * @returns {ClampedArguments}
 */
function clampArguments(width, height, radius) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const l = Math.min(w, h) / 2;
  const r = Math.max(0, Math.min(radius, l));
  return { w, h, l, r };
}

/**
 * @param {number} r Corner radius
 * @param {number} l Half length of shorter side
 * @returns {CornerArguments}
 */
function cornerParameters(r, l) {
  const segments = Math.ceil(Math.sqrt(r)) * 4;
  const exponent = r / l;
  const indexToParameter = Math.PI / 2 / segments;
  return { segments, exponent, indexToParameter };
}

/**
 * Corner translation for one axis
 *
 * @param {number} side Output of `side` for the given axis
 * @param {number} x Base offset
 * @param {number} w Length of the given side
 * @param {number} l Half length of the shorter side
 * @returns {number}
 */
function translate1D(side, x, w, l) {
  return w * side + l * (1 - side * 2) + x;
}

/**
 * Calculates which side of the graph the given corner is on
 *
 * @param {number} i Quadrant index
 * @return {Point} x=0 => right, x=1 => left, y=0 => top, y=1 => bottom
 */
function side(i) {
  const right = i === 0 || i === 3;
  const top = i < 2;
  const x = right ? 0 : 1;
  const y = top ? 0 : 1;
  return { x, y };
}

/**
 * Creates a matrix to rotate and scale corner points
 *
 * @param {number} x x-axis side
 * @param {number} y y-axis side
 * @param {number} l Scale factor
 * @returns {Matrix2x2}
 */
function rotateScale(x, y, l) {
  const rotation = rotate(x, y);
  rotation.m11 *= l;
  rotation.m21 *= l;
  rotation.m12 *= l;
  rotation.m22 *= l;
  return rotation;
}

/**
 * Creates a matrix to rotate corner
 *
 * @param {number} x x-axis side
 * @param {number} y y-axis side
 * @returns {Matrix2x2}
 */
function rotate(x, y) {
  const odd = x ^ y;
  const even = 1 - odd;
  const rotateX = x * 2 - 1;
  const rotateY = y * 2 - 1;
  const m11 = rotateY * even;
  const m21 = rotateY * odd;
  const m12 = rotateX * odd;
  const m22 = rotateX * even;
  return { m11, m21, m12, m22 };
}

/**
 * Iterates the points for a single squircle corner. Points are bounded by the
 * the first quadrant unit square and are generated from (1,0) to (0,1).
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

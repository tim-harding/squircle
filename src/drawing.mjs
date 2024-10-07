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

// The properties `--squircle-fill` and `--squircle-border-color` are already
// parsed by the CSS engine and come to us in one of two forms:
//
// - rgba(64, 191, 191, 0.5)
// - rgb(64, 191, 191)
//
// We want to skip drawing the fill or border only if it is fully transparent,
// which this regex checks for. Not sure if this is totally necessary or if
// canvas already skips transparent fills, but it seems worth including for
// safety.
const TRANSPARENT = /^rgba\(\d+, \d+, \d+, 0\)$/;

/**
 * Paints a squircle onto the canvas
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x Top-left corner x-coordinate
 * @param {number} y Top-left corner y-coordinate
 * @param {number} width Rectangle width
 * @param {number} height Rectangle height
 * @param {number} radius Border radius
 * @param {number} borderWidth Border stroke thickness
 * @param {string} fill Fill color
 * @param {string} borderColor Border stroke color
 */
export function paint(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  borderWidth,
  fill,
  borderColor,
) {
  const isFillTransparent = TRANSPARENT.test(fill);
  const isFillVisible = !isFillTransparent;

  const isBorderTransparent = TRANSPARENT.test(borderColor);
  const isBorderVisible = borderWidth > 0 && !isBorderTransparent;

  draw(ctx, x, y, width, height, radius);
  ctx.clip();

  if (isFillVisible) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fill();
  }

  if (isBorderVisible) {
    draw(
      ctx,
      x + borderWidth,
      y + borderWidth,
      width - borderWidth * 2,
      height - borderWidth * 2,
      radius - borderWidth / Math.SQRT2,
    );
    ctx.fillStyle = borderColor;
    ctx.fill("evenodd");
  }
}

/**
 * Adds a squircle path to the canvas
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x Top-left corner x-coordinate
 * @param {number} y Top-left corner y-coordinate
 * @param {number} width Rectangle width
 * @param {number} height Rectangle height
 * @param {number} radius Border radius
 */
export function draw(ctx, x, y, width, height, radius) {
  const iterator = points(x, y, width, height, radius);
  const { x: initialX, y: initialY } = iterator.next().value ?? { x: 0, y: 0 };
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

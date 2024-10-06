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
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const l = Math.min(w, h) / 2;
  const r = Math.max(0, Math.min(radius, l));
  const segments = Math.ceil(Math.sqrt(r)) * 4;
  const n = r / l;
  const denominator = Math.PI / 2 / segments;

  ctx.beginPath();
  ctx.moveTo(w + x, h - l + y);
  for (let i = 0; i < 4; i++) {
    const left = i > 0 && i < 3;
    const top = i > 1;
    const offset_x = (left ? l : w - l) + x;
    const offset_y = (top ? l : h - l) + y;
    const odd = i % 2;
    const even = 1 - odd;
    const rotate_sign_y = left ? -1 : 1;
    const rotate_sign_x = top ? -1 : 1;
    const rotate_y = rotate_sign_x * l;
    const rotate_x = rotate_sign_y * l;
    const m11 = rotate_y * even;
    const m21 = rotate_y * odd;
    const m12 = rotate_x * odd;
    const m22 = rotate_x * even;

    for (let j = 0; j < segments + 1; j++) {
      const t = j * denominator;
      const x0 = Math.cos(t) ** n;
      const y0 = Math.sin(t) ** n;
      const x = x0 * m11 + y0 * m12 + offset_x;
      const y = x0 * m21 + y0 * m22 + offset_y;
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

/**
 * @typedef {CanvasRenderingContext2D} PaintRenderingContext2D
 */

/**
 * @typedef {Object} PaintSize
 * @property {number} width
 * @property {number} height
 */

/*
float n = chf("n");
n = 1/f@r;

float t = @P.y;
float ct = cos(t);
float st = sin(t);
float i = 2/n;

float x = pow(ct, i);
float y = pow(st, i);
@P = set(x,y,0);

float dx = -i * st * pow(ct, i-1);
float dy = i * ct * pow(st, i-1);
@N = set(dx, dy, 0);
*/

/**
 * @param {number} r Radius
 * @param {number} s Segments
 */
function superellipse_parametric(r, s) {
  const r2 = 2 * r;
  const r21 = r2 - 1;
  const n = 1 / r;
  const out = new Array(4);
  for (let i = 0; i < s + 1; i++) {
    const t = i / s;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    const x = ct ** r2;
    const y = st ** r2;
    const dx = -r2 * st * ct ** r21;
    const dy = r2 * ct * st ** r21;
  }
}

const SEGMENTS = 4;
const CACHE = new Float32Array((SEGMENTS + 1) * 2);

class Squircle {
  static get contextOptions() {
    return { alpha: false };
  }

  static get inputProperties() {
    return ["--radius"];
  }

  /**
   * @param {PaintRenderingContext2D} ctx
   * @param {PaintSize} size
   * @param {Map<string, any>} props
   */
  paint(ctx, size, props) {
    const { width: w, height: h } = size;
    /** @type {CSSUnitValue} */
    const radius = props.get("--radius");
    // const r = Math.min(radius.value, w / 2, h / 2);

    const r = 32;

    const den = Math.PI / 2 / SEGMENTS;
    ctx.fillStyle = "white";
    ctx.moveTo(w, h - r);
    for (let i = 1; i < SEGMENTS + 1; i++) {
      const t = i * den;
      const x = Math.cos(t) ** 1 * r + w - r;
      const y = Math.sin(t) ** 1 * r + h - r;
      ctx.lineTo(x, y);
    }

    for (let i = SEGMENTS; i < SEGMENTS * 2 + 1; i++) {
      const t = i * den;
      const x = Math.cos(t) ** 1 * r + r;
      const y = Math.sin(t) ** 1 * r + h - r;
      ctx.lineTo(x, y);
    }

    for (let i = SEGMENTS * 2; i < SEGMENTS * 3 + 1; i++) {
      const t = i * den;
      const x = Math.cos(t) ** 1 * r + r;
      const y = Math.sin(t) ** 1 * r + r;
      ctx.lineTo(x, y);
    }

    for (let i = SEGMENTS * 3; i < SEGMENTS * 4 + 1; i++) {
      const t = i * den;
      const x = Math.cos(t) ** 1 * r + w - r;
      const y = Math.sin(t) ** 1 * r + r;
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
  }
}

registerPaint("squircle", Squircle);

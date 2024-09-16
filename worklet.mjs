/**
 * @typedef {CanvasRenderingContext2D} PaintRenderingContext2D
 */

/**
 * @typedef {Object} PaintSize
 * @property {number} width
 * @property {number} height
 */

const SEGMENTS = 3;

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
    const l = Math.min(w, h) / 2;
    const r = Math.min(radius.value, l);
    const n = r / l;
    const den = Math.PI / 2 / SEGMENTS;

    ctx.moveTo(w, h - l);
    for (let i = 1; i < SEGMENTS; i++) {
      const t = i * den;
      const x = Math.cos(t) ** n * l + w - l;
      const y = Math.sin(t) ** n * l + h - l;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w - l, h);

    ctx.lineTo(l, h);
    for (let i = SEGMENTS + 1; i < SEGMENTS * 2; i++) {
      const t = i * den;
      const x = -((-Math.cos(t)) ** n) * l + l;
      const y = Math.sin(t) ** n * l + h - l;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(0, h - l);

    ctx.lineTo(0, l);
    for (let i = SEGMENTS * 2 + 1; i < SEGMENTS * 3; i++) {
      const t = i * den;
      const x = -((-Math.cos(t)) ** n) * l + l;
      const y = -((-Math.sin(t)) ** n) * l + l;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(l, 0);

    ctx.lineTo(w - l, 0);
    for (let i = SEGMENTS * 3 + 1; i < SEGMENTS * 4; i++) {
      const t = i * den;
      const x = Math.cos(t) ** n * l + w - l;
      const y = -((-Math.sin(t)) ** n) * l + l;
      ctx.lineTo(x, y);
    }

    ctx.fillStyle = "white";
    ctx.closePath();
    ctx.fill();
  }
}

registerPaint("squircle", Squircle);

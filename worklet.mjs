/**
 * @typedef {CanvasRenderingContext2D} PaintRenderingContext2D
 */

/**
 * @typedef {Object} PaintSize
 * @property {number} width
 * @property {number} height
 */

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
   * @param {Map<string, CSSUnitValue>} props
   */
  paint(ctx, size, props) {
    const { width: w, height: h } = size;
    const l = Math.min(w, h) / 2;
    const radius = props.get("--radius");
    const r = Math.min(radius.value, l);
    const segments = Math.ceil(Math.sqrt(r)) * 4;
    const n = r / l;
    const den = Math.PI / 2 / segments;

    ctx.moveTo(w, h - l);
    ctx.resetTransform();
    for (let i = 0; i < 4; i++) {
      const left = i > 0 && i < 3;
      const top = i > 1;
      const offset_x = left ? l : w - l;
      const offset_y = top ? l : h - l;
      const o = i % 2;
      const e = 1 - o;
      const rotate_sign_y = left ? -1 : 1;
      const rotate_sign_x = top ? -1 : 1;
      const m11 = e * rotate_sign_x;
      const m21 = o * rotate_sign_x;
      const m12 = o * rotate_sign_y;
      const m22 = e * rotate_sign_y;
      ctx.setTransform(m11, m21, m12, m22, offset_x, offset_y);
      for (let j = 0; j < segments + 1; j++) {
        const t = j * den;
        const x = Math.cos(t) ** n * l;
        const y = Math.sin(t) ** n * l;
        ctx.lineTo(x, y);
      }
    }

    ctx.fillStyle = "white";
    ctx.closePath();
    ctx.fill();
  }
}

registerPaint("squircle", Squircle);

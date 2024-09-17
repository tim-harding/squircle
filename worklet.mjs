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
    return { alpha: true };
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
    const { width, height } = size;
    const radius = props.get("--radius").value;

    const fills = [
      ["blue", 0],
      ["red", 8],
    ];

    for (let fill = 0; fill < 2; fill++) {
      const [fillColor, borderWidth] = fills[fill];
      const w = Math.max(0, width - borderWidth * 2);
      const h = Math.max(0, height - borderWidth * 2);
      const l = Math.min(w, h) / 2;
      const r = Math.max(0, Math.min(radius - borderWidth * Math.SQRT1_2, l));
      const segments = Math.ceil(Math.sqrt(r)) * 4;
      const n = r / l;
      const den = Math.PI / 2 / segments;

      ctx.beginPath();
      ctx.resetTransform();
      ctx.moveTo(w + borderWidth, h - l + borderWidth);
      for (let i = 0; i < 4; i++) {
        const left = i > 0 && i < 3;
        const top = i > 1;
        const offset_x = (left ? l : w - l) + borderWidth;
        const offset_y = (top ? l : h - l) + borderWidth;
        const o = i % 2;
        const e = 1 - o;
        const rotate_sign_y = left ? -1 : 1;
        const rotate_sign_x = top ? -1 : 1;
        const m11 = e * rotate_sign_x * l;
        const m21 = o * rotate_sign_x * l;
        const m12 = o * rotate_sign_y * l;
        const m22 = e * rotate_sign_y * l;
        ctx.setTransform(m11, m21, m12, m22, offset_x, offset_y);
        for (let j = 0; j < segments + 1; j++) {
          const t = j * den;
          const x = Math.cos(t) ** n;
          const y = Math.sin(t) ** n;
          ctx.lineTo(x, y);
        }
      }

      ctx.fillStyle = fillColor;
      ctx.closePath();
      ctx.fill();
    }
  }
}

registerPaint("squircle", Squircle);

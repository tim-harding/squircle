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
   * @param {Map<string, any>} props
   */
  paint(ctx, size, props) {
    const { width: w, height: h } = size;
    /** @type {CSSUnitValue} */
    const radius = props.get("--radius");
    const r = Math.min(radius.value, w / 2, h / 2);
    const wr = w - r;
    const hr = h - r;
    ctx.fillStyle = "white";
    ctx.moveTo(r, 0);
    ctx.lineTo(wr, 0);
    ctx.lineTo(w, r);
    ctx.lineTo(w, hr);
    ctx.lineTo(wr, h);
    ctx.lineTo(r, h);
    ctx.lineTo(0, hr);
    ctx.lineTo(0, r);
    ctx.closePath();
    ctx.fill();
  }
}

registerPaint("squircle", Squircle);

/**
 * @typedef {CanvasRenderingContext2D} PaintRenderingContext2D
 */

/**
 * @typedef {Object} PaintSize
 * @property {number} width
 * @property {number} height
 */

const fills = [
  ["", 0],
  ["", 0],
];

class Squircle {
  static get contextOptions() {
    return { alpha: true };
  }

  static get inputProperties() {
    return [
      "--squircle-radius",
      "--squircle-fill",
      "--squircle-border-width",
      "--squircle-border-color",
    ];
  }

  /**
   * @param {PaintRenderingContext2D} ctx
   * @param {PaintSize} size
   * @param {Map<string, CSSUnitValue>} props
   */
  paint(ctx, size, props) {
    const { width, height } = size;
    const radius = props.get("--squircle-radius").value;
    const fill = props.get("--squircle-fill");
    const borderWidth = props.get("--squircle-border-width").value;
    const borderColor = props.get("--squircle-border-color");

    console.log(fill);

    const drawBorder = borderWidth !== "0" && borderColor !== "transparent";
    const drawFill = fill !== "transparent";

    function paint(borderOffset) {
      const w = Math.max(0, width - borderOffset * 2);
      const h = Math.max(0, height - borderOffset * 2);
      const l = Math.min(w, h) / 2;
      const r = Math.max(0, Math.min(radius - borderOffset * Math.SQRT1_2, l));
      const segments = Math.ceil(Math.sqrt(r)) * 4;
      const n = r / l;
      const den = Math.PI / 2 / segments;

      ctx.beginPath();
      ctx.resetTransform();
      ctx.moveTo(w + borderOffset, h - l + borderOffset);
      for (let i = 0; i < 4; i++) {
        const left = i > 0 && i < 3;
        const top = i > 1;
        const offset_x = (left ? l : w - l) + borderOffset;
        const offset_y = (top ? l : h - l) + borderOffset;
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

      ctx.closePath();
      ctx.fill();
    }

    if (drawBorder) {
      ctx.fillStyle = borderColor;
      paint(0);
    }

    if (drawFill) {
      ctx.fillStyle = fill;
      paint(borderWidth);
    }
  }
}

registerPaint("squircle", Squircle);

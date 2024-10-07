import { draw } from "./index.mjs";

// The properties `--squircle-fill` and `--squircle-border-color` are already
// parsed by the CSS engine and come to us in one of two forms:
//
// - rgba(64, 191, 191, 0.5)
// - rgb(64, 191, 191)
//
// We want to skip drawing the fill or border only if it is fully transparent,
// which this regex checks for.
const TRANSPARENT = /^rgba\(\d+, \d+, \d+, 0\)$/;

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
   * @param {Map<string, any>} props
   */
  paint(ctx, size, props) {
    const { width, height } = size;
    const radius = propUnit(props, "--squircle-radius");
    const borderWidth = propUnit(props, "--squircle-border-width");
    const fill = propString(props, "--squircle-fill");
    const borderColor = propString(props, "--squircle-border-color");

    const isFillTransparent = TRANSPARENT.test(fill);
    const isFillVisible = !isFillTransparent;

    const isBorderTransparent = TRANSPARENT.test(borderColor);
    const isBorderVisible = borderWidth > 0 && !isBorderTransparent;

    draw(ctx, 0, 0, width, height, radius);
    ctx.clip();

    if (isFillVisible) {
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, width, height);
    }

    if (isBorderVisible) {
      ctx.lineWidth = borderWidth * 2;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    }
  }
}

/**
 * @param {Map<string, any>} props
 * @param {string} name
 * @returns {number}
 */
function propUnit(props, name) {
  const prop = props.get(name);
  return prop instanceof CSSUnitValue ? prop.value : 0;
}

/**
 * @param {Map<string, any>} props
 * @param {string} name
 * @returns {string}
 */
function propString(props, name) {
  const prop = props.get(name);
  return prop instanceof CSSStyleValue ? prop.toString() : "";
}

/* @ts-ignore */
registerPaint("squircle", Squircle);

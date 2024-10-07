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
    const isBorderVisible = !isBorderTransparent && borderWidth > 0;

    draw(
      ctx,
      borderWidth / 2,
      borderWidth / 2,
      width - borderWidth,
      height - borderWidth,
      radius - borderWidth / 2 / Math.SQRT2,
    );

    if (isFillVisible) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (isBorderVisible) {
      ctx.lineWidth = borderWidth;
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

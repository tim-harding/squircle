import { paint } from "@/drawing";

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
      "--squircle-background-color",
      "--squircle-border-radius",
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
    const fill = propString(props, "--squircle-background-color");
    const radius = propUnit(props, "--squircle-border-radius");
    const borderWidth = propUnit(props, "--squircle-border-width");
    const borderColor = propString(props, "--squircle-border-color");
    paint(ctx, 0, 0, width, height, radius, borderWidth, fill, borderColor);
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

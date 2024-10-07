import SquircleHoudini from "./squircle-houdini.js";
import SquircleCanvas from "./squircle-canvas.js";

export * from "./drawing.mjs";

/**
 * @typedef {Object} Point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 */

/**
 * Register the squircle CSS Paint worklet.
 *
 * @param {string} workletUrl URL of the squircle paint worklet
 */
export function register(workletUrl) {
  if (!CSS.registerProperty) return;

  CSS.registerProperty({
    name: "--squircle-background-color",
    syntax: "<color>",
    inherits: false,
    initialValue: "transparent",
  });

  CSS.registerProperty({
    name: "--squircle-border-radius",
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
    name: "--squircle-border-color",
    syntax: "<color>",
    inherits: false,
    initialValue: "transparent",
  });

  /* @ts-ignore */
  if (!CSS.paintWorklet) return;
  /* @ts-ignore */
  CSS.paintWorklet.addModule(workletUrl);
}

/**
 * Creates a custom element that uses the Paint API if available or an HTML
 * canvas if not.
 *
 * Usage:
 * ```js
 * createCustomElement('my-squircle')
 * ```
 * ```html
 * <my-squircle
 *     radius="16"
 *     fill="#deadbeef"
 *     border-width="4"
 *     border-color="#cafebabe"
 * ></my-squircle>
 * ```
 *
 * @param {string} name
 */
export function createCustomElement(name) {
  const isPaintSupported = CSS.supports("background", "paint(id)");
  const component = isPaintSupported ? SquircleHoudini : SquircleCanvas;
  customElements.define(name, component);
}

import SquircleHoudini from "@/squircle-houdini";
import SquircleCanvas from "@/squircle-canvas";
import workletUrl from "@/worklet.js?url";
import styles from "@/index.css?inline";

export * from "./drawing.js";

/**
 * @typedef {Object} Point
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 */

/**
 * Register the squircle CSS Paint worklet.
 */
export function register() {
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.append(style);

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
  /* @ts-ignore */
  const isPaintSupported = !!CSS.paintWorklet;
  const component = isPaintSupported ? SquircleHoudini : SquircleCanvas;
  customElements.define(name, component);
}

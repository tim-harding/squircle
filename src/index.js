import SquircleHoudini from "@/squircle-houdini";
import SquircleCanvas from "@/squircle-canvas";
import workletUrl from "@/worklet.js?worker&url";
import styles from "@/index.css?inline";

export * from "./drawing.js";

function registerInner() {
  let isRegistered = false;
  return function () {
    if (isRegistered) return;
    isRegistered = true;

    const style = document.createElement("style");
    style.textContent = styles;
    document.head.append(style);

    /* @ts-ignore */
    if (!CSS.paintWorklet) return;
    /* @ts-ignore */
    CSS.paintWorklet.addModule(workletUrl);
  };
}

/**
 * Register the squircle CSS Paint worklet.
 */
export const register = registerInner();

/**
 * Creates a custom element that uses the Paint API if available or an HTML
 * canvas if not.
 *
 * Usage:
 * ```js
 * createCustomElement()
 * ```
 * ```html
 * <ce-squircle
 *     background-color="#deadbeef"
 *     border-radius="16"
 *     border-width="4"
 *     border-color="#cafebabe"
 * ></ce-squircle>
 * ```
 */
export function createCustomElement() {
  if (customElements.get("ce-squircle")) return;
  register();
  /* @ts-ignore */
  const isPaintSupported = !!CSS.paintWorklet;
  const component = isPaintSupported ? SquircleHoudini : SquircleCanvas;
  customElements.define("ce-squircle", component);
}

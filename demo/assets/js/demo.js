import { Tester, Corner, Control } from "./tester.js";

const IS_PAINT_SUPPORTED = CSS.supports("background", "paint(id)");

function main() {
  loadSquircleComponent();
  loadPaintWorklet();
  customElements.define("th-tester", Tester);
  customElements.define("th-tester-corner", Corner);
  customElements.define("th-tester-control", Control);
}

async function loadPaintWorklet() {
  if (!IS_PAINT_SUPPORTED) return;
  const { register } = await import(
    "https://unpkg.com/superellipse-squircle@0.1.6/index.mjs"
  );
  register("https://unpkg.com/superellipse-squircle@0.1.6/worklet.min.js");
}

async function loadSquircleComponent() {
  const promise = IS_PAINT_SUPPORTED
    ? import("./squircle-houdini.js")
    : import("./squircle-canvas.js");
  const module = await promise;
  customElements.define("th-squircle", module.default);
}

main();

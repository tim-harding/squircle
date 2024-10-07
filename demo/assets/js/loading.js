const IS_PAINT_SUPPORTED = CSS.supports("background", "paint(id)");

const { promise, resolve } = Promise.withResolvers();
export const loaded = promise;

export async function load() {
  await Promise.all([
    loadSquircleComponent(),
    loadPaintWorklet(),
    loadComponents(),
  ]);
  console.log("loaded");
  resolve(undefined);
}

async function loadComponents() {
  const promises = [
    import("./tester.js"),
    import("./drag-area.js"),
    import("./control.js"),
    import("./corner.js"),
  ].map((promise) =>
    promise.then(({ NAME, Component }) => {
      console.log(NAME);
      customElements.define(NAME, Component);
    }),
  );
  await Promise.all(promises);
  console.log("loaded components");
}

async function loadPaintWorklet() {
  if (!IS_PAINT_SUPPORTED) return;
  const { register } = await import(
    "https://unpkg.com/superellipse-squircle@0.1.7/index.mjs"
  );
  register("https://unpkg.com/superellipse-squircle@0.1.7/worklet.min.js");
  console.log("Loaded worklet");
}

async function loadSquircleComponent() {
  const promise = IS_PAINT_SUPPORTED
    ? import("./squircle-houdini.js")
    : import("./squircle-canvas.js");
  const module = await promise;
  customElements.define("th-squircle", module.default);
  console.log("Loaded squircle");
}

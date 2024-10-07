const IS_PAINT_SUPPORTED = CSS.supports("background", "paint(id)");

function main() {
  loadSquircleComponent();
  loadPaintWorklet();
  const modulePromises = [
    import("./tester.js"),
    import("./drag-area.js"),
    import("./control.js"),
    import("./corner.js"),
  ];
  Promise.all(modulePromises).then((modules) => {
    for (const module of modules) {
      const { NAME, Component } = module;
      customElements.define(NAME, Component);
    }
  });
}

async function loadPaintWorklet() {
  if (!IS_PAINT_SUPPORTED) return;
  const { register } = await import(
    "https://unpkg.com/superellipse-squircle@0.1.7/index.mjs"
  );
  register("https://unpkg.com/superellipse-squircle@0.1.7/worklet.min.js");
}

async function loadSquircleComponent() {
  const promise = IS_PAINT_SUPPORTED
    ? import("./squircle-houdini.js")
    : import("./squircle-canvas.js");
  const module = await promise;
  customElements.define("th-squircle", module.default);
}

main();

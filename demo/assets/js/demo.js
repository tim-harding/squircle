function main() {
  const isPaintSupported = CSS.supports("background", "paint(id)");
  if (isPaintSupported) {
    import("https://unpkg.com/superellipse-squircle@0.1.6/index.mjs").then(
      ({ register }) => {
        register(
          "https://unpkg.com/superellipse-squircle@0.1.6/worklet.min.js",
        );
      },
    );
    import("./squircle-houdini.js").then(({ default: SquircleHoudini }) => {
      customElements.define("th-squircle", SquircleHoudini);
    });
  } else {
    import("./squircle-canvas.js").then(({ default: SquircleCanvas }) => {
      customElements.define("th-squircle", SquircleCanvas);
    });
  }
}

main();

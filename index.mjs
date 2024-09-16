export function register() {
  if (!CSS || !CSS.registerProperty || !CSS.paintWorklet) return;

  CSS.registerProperty({
    name: "--radius",
    syntax: "<length>",
    inherits: false,
    initialValue: "0px",
  });

  CSS.registerProperty({
    name: "--segments",
    syntax: "<number>",
    inherits: true,
    initialValue: "16",
  });

  CSS.paintWorklet.addModule("/worklet.mjs");
}

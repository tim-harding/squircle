export function register() {
  if (!CSS || !CSS.registerProperty || !CSS.paintWorklet) return;
  CSS.registerProperty({
    name: "--radius",
    syntax: "<length>",
    inherits: false,
    initialValue: "0px",
  });
  CSS.paintWorklet.addModule("/worklet.mjs");
}

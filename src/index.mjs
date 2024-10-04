/**
 * Register the squircle CSS Paint worklet.
 *
 * @param {string} workletUrl The url where the worklet is being served. This
 * cannot be imported like a normal JavaScript module.
 */
export function register(workletUrl) {
  if (!CSS || !CSS.registerProperty || !CSS.paintWorklet) return;

  CSS.registerProperty({
    name: "--squircle-radius",
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
    name: "--squircle-fill",
    syntax: "<color>",
    inherits: true,
    initialValue: "transparent",
  });

  CSS.registerProperty({
    name: "--squircle-border-color",
    syntax: "<color>",
    inherits: true,
    initialValue: "transparent",
  });

  CSS.paintWorklet.addModule(workletUrl);
}

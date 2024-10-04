/**
 * Register the squircle CSS Paint worklet.
 *
 * @param {string} workletUrl The url where the worklet is being served. This
 * cannot be imported like a normal JavaScript module.
 *
 * @param {boolean} usePrefix Whether to prefix property names with 'squircle-'.
 * Defaults to true.
 */
export function register(workletUrl, usePrefix = true) {
  if (!CSS || !CSS.registerProperty) return;
  const prefix = usePrefix ? "squircle-" : "";

  CSS.registerProperty({
    name: `--${prefix}radius`,
    syntax: "<length>",
    inherits: false,
    initialValue: "0px",
  });

  CSS.registerProperty({
    name: `--${prefix}border-width`,
    syntax: "<length>",
    inherits: false,
    initialValue: "0px",
  });

  CSS.registerProperty({
    name: `--${prefix}fill`,
    syntax: "<color>",
    inherits: true,
    initialValue: "transparent",
  });

  CSS.registerProperty({
    name: `--${prefix}border-color`,
    syntax: "<color>",
    inherits: true,
    initialValue: "transparent",
  });

  if (!CSS.paintWorklet) return;
  CSS.paintWorklet.addModule(workletUrl);
}

export function register() {
  if (!CSS) return;
  if (!CSS.paintWorklet) return;
  if (!CSS.paintWorklet.addModule) return;
  CSS.paintWorklet.addModule("/worklet.mjs");
}

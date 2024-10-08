const { promise, resolve } = Promise.withResolvers();
export const loaded = promise;

export async function load() {
  await Promise.all([loadPaintWorklet(), loadComponents()]);
  resolve(undefined);
}

async function loadComponents() {
  const promises = [
    import("./tester.js"),
    import("./drag-area.js"),
    import("./control.js"),
    import("./corner.js"),
    import("./theme-button.js"),
  ].map((promise) =>
    promise.then(({ NAME, Component }) => {
      customElements.define(NAME, Component);
    }),
  );
  await Promise.all(promises);
}

async function loadPaintWorklet() {
  const { register, createCustomElement } = await import(
    "superellipse-squircle"
  );
  register("superellipse-squircle/worklet.mjs");
  createCustomElement("th-squircle");
}
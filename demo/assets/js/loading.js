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
  ].map((promise) =>
    promise.then(({ NAME, Component }) => {
      customElements.define(NAME, Component);
    }),
  );
  await Promise.all(promises);
}

async function loadPaintWorklet() {
  const { register, createCustomElement } = await import(
    "https://unpkg.com/superellipse-squircle@0.1.9/index.mjs"
  );
  register("https://unpkg.com/superellipse-squircle@0.1.9/worklet.min.js");
  createCustomElement("th-squircle");
}

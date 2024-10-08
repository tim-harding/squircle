/**
 * @this {any}
 * @param {any} target
 * @param {string} name
 * @param {any} handler
 */
export function listenPassive(target, name, handler) {
  target.addEventListener(name, handler.bind(this), {
    passive: true,
  });
}

import { listenPassive } from "../shared.js.js";
import { loaded } from "./js/loading.jss";

export class Corner extends HTMLElement {
  #isPressed = false;
  #side = "";

  get side() {
    return this.#side;
  }

  /**
   * @param {string} value
   */
  set x(value) {
    this.style.left = value;
  }

  /**
   * @param {string} value
   */
  set y(value) {
    this.style.top = value;
  }

  static get observedAttributes() {
    return ["side"];
  }

  constructor() {
    super();
    const listen = listenPassive.bind(this, this);
    const listenDoc = listenPassive.bind(this, document);
    listen("mousedown", this._handleMouseDown);
    listenDoc("mouseup", this._handleMouseUp);
    listenDoc("mousemove", this._handleMouseMove);
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "side": {
        this.#side = newValue;
        loaded.then(() => {
          const event = new CustomEvent("th-corner__register", {
            bubbles: true,
          });
          this.dispatchEvent(event);
        });
        break;
      }
    }
  }

  _handleMouseDown() {
    this.#isPressed = true;
  }

  _handleMouseUp() {
    this.#isPressed = false;
  }

  /**
   * @param {MouseEvent} mouseEvent
   */
  _handleMouseMove(mouseEvent) {
    if (!this.#isPressed) return;
    const { clientX: x, clientY: y } = mouseEvent;
    const event = new CustomEvent("th-corner__update", {
      detail: { x, y, side: this.#side },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }
}

export const NAME = "th-corner";
export const Component = Corner;

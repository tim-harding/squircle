import { listenPassive } from "pages/shared";

export class Control extends HTMLElement {
  #aspect = "";

  static get observedAttributes() {
    return ["aspect"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const input = this.querySelector("input");
    if (!(input instanceof HTMLInputElement)) {
      console.warn("Expected input element");
      return;
    }

    const listen = listenPassive.bind(this, input);
    listen("input", this._handleChange);

    this._emitChange(input);
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "aspect": {
        this.#aspect = newValue;
        break;
      }
    }
  }

  /**
   * @param {InputEvent} event
   */
  _handleChange(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    this._emitChange(input);
  }

  /**
   * @param {HTMLInputElement} input
   */
  _emitChange(input) {
    const value = input.value;
    const event = new CustomEvent("th-control__change", {
      detail: {
        value: input.type === "range" ? `${value}px` : value,
        aspect: this.#aspect,
      },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }
}

export const NAME = "th-control";
export const Component = Control;

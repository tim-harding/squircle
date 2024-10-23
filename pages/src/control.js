import { listenPassive, state } from "pages/shared";

export class Control extends HTMLElement {
  _aspect = "";

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

    input.addEventListener("touchstart", (e) => {
      e.stopPropagation();
    });
    input.addEventListener("touchmove", (e) => {
      e.stopPropagation();
    });

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
        this._aspect = newValue;
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
    switch (this._aspect) {
      case "border-radius": {
        state.radius = parseFloat(value);
        break;
      }

      case "border-width": {
        state.borderWidth = parseFloat(value);
        break;
      }

      case "fill": {
        state.fill = value;
        break;
      }

      case "border-color": {
        state.borderColor = value;
        break;
      }
    }
  }
}

export const NAME = "th-control";
export const Component = Control;

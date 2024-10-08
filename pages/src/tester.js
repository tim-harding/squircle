import { listenPassive } from "pages/shared";
import "pages/control";
import "pages/drag-area";

// TODO: Rounded rect toggle

export class Tester extends HTMLElement {
  /** @type {HTMLElement?} */
  _squircle = null;

  constructor() {
    super();
    const listen = listenPassive.bind(this, this);
    listen("th-control__change", this._handleControlChange);
  }

  connectedCallback() {
    this._squircle = this.querySelector("th-squircle");
  }

  /**
   * @param {CustomEvent} event
   */
  _handleControlChange(event) {
    const squircle = this._squircle;
    if (squircle === null) return;
    const { aspect, value } = event.detail;
    squircle.setAttribute(aspect, value);
  }
}

export const NAME = "th-tester";
export const Component = Tester;

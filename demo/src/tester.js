import { listenPassive } from "../shared.js.js";
import "../control.js.js";
import "./js/drag-area.jss";

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

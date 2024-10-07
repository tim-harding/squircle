import { listenPassive } from "./shared.js";
import { Corner } from "./corner.js";

const SIDE_OFFSET = 32;

// TODO: Resize observer and move handler accordingly

export class DragArea extends HTMLElement {
  _l = SIDE_OFFSET;
  _r = 0;
  _t = SIDE_OFFSET;
  _b = 0;
  /** @type {HTMLElement?} */
  _squircle = null;

  constructor() {
    super();
    const listen = listenPassive.bind(this, this);
    listen("th-corner__update", this._handleCornerUpdate);
    listen("th-corner__register", this._handleCornerRegister);
  }

  connectedCallback() {
    const { clientWidth: w, clientHeight: h } = this;
    this._r = w - SIDE_OFFSET;
    this._b = h - SIDE_OFFSET;

    this._squircle = this.querySelector("th-squircle");
    this._updateSquircleCorners();
  }

  /**
   * @param {CustomEvent} event
   */
  _handleCornerRegister(event) {
    const corner = event.target;
    if (!(corner instanceof Corner)) return;

    switch (corner.side) {
      case "top-left": {
        corner.x = `${this._l}px`;
        corner.y = `${this._t}px`;
        break;
      }

      case "bottom-right": {
        corner.x = `${this._r}px`;
        corner.y = `${this._b}px`;
        break;
      }

      default: {
        console.warn(`Unexpected corner side: ${corner.side}`);
        break;
      }
    }
  }

  /**
   * @param {CustomEvent} event
   */
  _handleCornerUpdate(event) {
    const corner = event.target;
    if (!(corner instanceof Corner)) return;

    const { x: xSelf, y: ySelf, width, height } = this.getBoundingClientRect();
    const { side, x: xViewport, y: yViewport } = event.detail;

    const x = Math.max(0, Math.min(width, xViewport - xSelf));
    const y = Math.max(0, Math.min(height, yViewport - ySelf));

    corner.x = `${x}px`;
    corner.y = `${y}px`;

    switch (side) {
      case "top-left": {
        this._l = x;
        this._t = y;
        break;
      }

      case "bottom-right": {
        this._r = x;
        this._b = y;
        break;
      }
    }

    this._updateSquircleCorners();
  }

  _updateSquircleCorners() {
    const { _l: l, _r: r, _t: t, _b: b } = this;
    const xMin = Math.min(l, r);
    const xMax = Math.max(l, r);
    const yMin = Math.min(t, b);
    const yMax = Math.max(t, b);
    const width = xMax - xMin;
    const height = yMax - yMin;

    const squircle = this._squircle;
    if (squircle === null) return;
    squircle.style.left = `${xMin}px`;
    squircle.style.top = `${yMin}px`;
    squircle.style.width = `${width}px`;
    squircle.style.height = `${height}px`;
  }
}

export const NAME = "th-drag-area";
export const Component = DragArea;

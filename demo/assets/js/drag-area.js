import { listenPassive } from "./shared.js";
import { Corner } from "./corner.js";

const SIDE_OFFSET = 32;

export class DragArea extends HTMLElement {
  _l = SIDE_OFFSET;
  _r = 0;
  _t = SIDE_OFFSET;
  _b = 0;
  _width = 0;
  _height = 0;
  /** @type {HTMLElement?} */
  _squircle = null;
  /** @type {Corner?} */
  _topLeft = null;
  /** @type {Corner?} */
  _bottomRight = null;

  constructor() {
    super();
    const listen = listenPassive.bind(this, this);
    listen("th-corner__update", this._handleCornerUpdate);
    listen("th-corner__register", this._handleCornerRegister);
  }

  connectedCallback() {
    const { clientWidth: w, clientHeight: h } = this;
    this._width = w;
    this._height = h;
    this._r = w - SIDE_OFFSET;
    this._b = h - SIDE_OFFSET;

    this._squircle = this.querySelector("th-squircle");
    this._updateSquircleCorners();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const sizes = entry.borderBoxSize ?? entry.contentBoxSize;
        if (sizes) {
          const [{ inlineSize, blockSize }] = sizes;
          this._width = inlineSize;
          this._height = blockSize;
        } else {
          const { width, height } = entry.contentRect;
          this._width = width;
          this._height = height;
        }

        this._l = Math.min(this._l, this._width);
        this._r = Math.min(this._r, this._width);
        this._t = Math.min(this._t, this._height);
        this._b = Math.min(this._b, this._height);

        this._updateSquircleCorners();

        if (this._topLeft !== null) {
          this._topLeft.x = `${this._l}px`;
          this._topLeft.y = `${this._t}px`;
        }

        if (this._bottomRight !== null) {
          this._bottomRight.x = `${this._r}px`;
          this._bottomRight.y = `${this._b}px`;
        }
      }
    });
    observer.observe(this);
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
        this._topLeft = corner;
        break;
      }

      case "bottom-right": {
        corner.x = `${this._r}px`;
        corner.y = `${this._b}px`;
        this._bottomRight = corner;
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

import { paint } from "@/index";

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

export class DragArea extends HTMLElement {
  /** @type {Point} */
  _p0 = { x: 1 / 16, y: 1 / 16 };
  /** @type {Point} */
  _p1 = { x: 15 / 16, y: 15 / 16 };
  /** @type {HTMLCanvasElement?} */
  _canvas = null;
  /** @type {CanvasRenderingContext2D?} */
  _context = null;

  constructor() {
    super();
  }

  connectedCallback() {
    const canvas = this.querySelector("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    this._canvas = canvas;

    let prevDpr = devicePixelRatio;
    window.addEventListener("resize", () => {
      if (devicePixelRatio != prevDpr) {
        const canvas = this._canvas;
        if (!canvas) return;
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        this._redraw();
      }
      prevDpr = devicePixelRatio;
    });

    const observer = new ResizeObserver((events) => {
      for (const event of events) {
        let w, h;
        if (event.contentBoxSize) {
          w = event.contentBoxSize[0].inlineSize;
          h = event.contentBoxSize[0].blockSize;
        } else {
          w = event.contentRect.width;
          h = event.contentRect.height;
        }
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        this._redraw();
      }
    });
    observer.observe(this);

    this._context = this._canvas.getContext("2d");
    this._redraw();
  }

  _redraw() {
    const canvas = this._canvas;
    const ctx = this._context;
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    let { x: x0, y: y0 } = this._p0;
    let { x: x1, y: y1 } = this._p1;

    x0 *= width;
    x1 *= width;
    y0 *= height;
    y1 *= height;

    ctx.reset();
    ctx.beginPath();
    ctx.ellipse(x0, y0, 16, 16, 0, 0, 2 * Math.PI, false);
    ctx.ellipse(x1, y1, 16, 16, 0, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();

    paint(
      ctx,
      Math.min(x0, x1),
      Math.min(y0, y1),
      Math.abs(x0 - x1),
      Math.abs(y0 - y1),
      16,
      6,
      "green",
      "blue",
    );
  }

  /**
   * @param {CustomEvent} event
   */
  _handleCornerUpdate(event) {
    const { x: xSelf, y: ySelf, width, height } = this.getBoundingClientRect();
    const { side, x: xViewport, y: yViewport } = event.detail;
    const x = Math.max(0, Math.min(width, xViewport - xSelf));
    const y = Math.max(0, Math.min(height, yViewport - ySelf));
  }
}

export const NAME = "th-drag-area";
export const Component = DragArea;

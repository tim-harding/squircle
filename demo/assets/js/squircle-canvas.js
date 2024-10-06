import { paint } from "https://unpkg.com/superellipse-squircle@0.1.6/index.mjs";

export default class SquircleCanvas extends HTMLElement {
  /** @type {number} */
  _radius = 0;
  /** @type {string} */
  _fill = "transparent";
  /** @type {number} */
  _borderWidth = 0;
  /** @type {string} */
  _borderColor = "transparent";
  /** @type {number} */
  _animationFrame = -1;
  /** @type {CanvasRenderingContext2D?} */
  _context = null;

  static observedAttributes = [
    "radius",
    "fill",
    "border-width",
    "border-color",
  ];

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("th-squircle");

    const canvas = document.createElement("canvas");
    this.appendChild(canvas);

    const ctx = canvas.getContext("2d", {
      colorSpace: "display-p3",
    });

    if (ctx === null) {
      console.error("Could not get canvas 2D context");
      return;
    }

    this._context = ctx;
    this._width = 0;
    this._height = 0;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const sizes = entry.borderBoxSize ?? entry.contentBoxSize;
        if (sizes) {
          const [{ inlineSize, blockSize }] = sizes;
          this._width = inlineSize;
          this._height = blockSize;
        } else {
          const rect = entry.contentRect;
          this._width = rect.width;
          this._height = rect.height;
        }
        this._width = Math.round(this._width);
        this._height = Math.round(this._height);
        canvas.width = Math.round(this._width);
        canvas.height = Math.round(this._height);
        ctx.scale(devicePixelRatio, devicePixelRatio);
        draw(ctx, this._width, this._height);
      }
    });
    observer.observe(this);
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "radius": {
        this._radius = Number.parseFloat(newValue);
        break;
      }

      case "fill": {
        this._fill = newValue;
        break;
      }

      case "border-width": {
        this._borderWidth = Number.parseFloat(newValue);
        break;
      }

      case "border-color": {
        this._borderColor = newValue;
        break;
      }

      default: {
        return;
      }
    }

    this._scheduleRedraw();
  }

  _scheduleRedraw() {
    if (this._animationFrame < 0) return;

    const context = this._context;
    if (context === null) return;

    this._animationFrame = requestAnimationFrame(() => {
      this._animationFrame = -1;
      draw(context, this._width, this._height);
    });
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function draw(ctx, width, height) {
  ctx.reset();
  ctx.fillStyle = "black";
  paint(ctx, 0, 0, width, height, 10);
}

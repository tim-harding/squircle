import { paint } from "https://unpkg.com/superellipse-squircle@0.1.7/index.mjs";

export default class SquircleCanvas extends HTMLElement {
  _radius = 0;
  _fill = "transparent";
  _borderWidth = 0;
  _borderColor = "transparent";
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
        this._draw();
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
    if (this._animationFrame >= 0) return;

    const context = this._context;
    if (context === null) return;

    this._animationFrame = requestAnimationFrame(() => {
      this._animationFrame = -1;
      this._draw();
    });
  }

  _draw() {
    let {
      _context: ctx,
      _width: w,
      _height: h,
      _radius: r,
      _fill: fill,
      _borderWidth: bw,
      _borderColor: bc,
    } = this;
    if (ctx === null) return;

    const l = Math.min(w, h) / 2;
    r = Math.min(l, r);

    ctx.reset();

    if (bc !== "transparent" && bw > 0) {
      paint(ctx, 0, 0, w, h, r);
      ctx.fillStyle = this._borderColor;
      ctx.fill();
    }

    if (fill !== "transparent") {
      paint(
        ctx,
        bw,
        bw,
        w - bw * 2,
        h - bw * 2,
        r - this._borderWidth / Math.SQRT2,
      );
      ctx.fillStyle = fill;
      ctx.fill();
    }
  }
}

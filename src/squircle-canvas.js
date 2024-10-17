import { paint } from "@/drawing";

export default class SquircleCanvas extends HTMLElement {
  _radius = 0;
  _fill = "rgba(0, 0, 0, 0)";
  _borderWidth = 0;
  _borderColor = "rgba(0, 0, 0, 0)";
  _animationFrame = -1;
  /** @type {CanvasRenderingContext2D?} */
  _context = null;

  static observedAttributes = [
    "background-color",
    "border-radius",
    "border-width",
    "border-color",
  ];

  constructor() {
    super();
  }

  connectedCallback() {
    const canvas = document.createElement("canvas");
    this.appendChild(canvas);

    const ctx = canvas.getContext("2d", {});

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
        this._width = Math.floor(this._width);
        this._height = Math.floor(this._height);
        canvas.width = Math.floor(this._width);
        canvas.height = Math.floor(this._height);
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
      case "border-radius": {
        this._radius = Number.parseFloat(newValue);
        break;
      }

      case "background-color": {
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
    this._animationFrame = requestAnimationFrame(() => {
      this._animationFrame = -1;
      this._draw();
    });
  }

  _draw() {
    const { _context: ctx } = this;
    if (ctx === null) return;

    ctx.reset();
    paint(
      ctx,
      0,
      0,
      this._width,
      this._height,
      this._radius,
      this._borderWidth,
      this._fill,
      this._borderColor,
    );
  }
}

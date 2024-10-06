import {
  register,
  paint,
} from "https://unpkg.com/superellipse-squircle@0.1.6/index.mjs";

const IS_PAINT_SUPPORTED = CSS.supports("background", "paint(id)");

function main() {
  register("https://unpkg.com/superellipse-squircle@0.1.6/worklet.min.js");
  customElements.define("th-squircle", Squircle);
}

class Squircle extends HTMLElement {
  /** @type {number} */
  _radius = 0;
  /** @type {string} */
  _fill = "transparent";
  /** @type {number} */
  _borderWidth = 0;
  /** @type {string} */
  _borderColor = "transparent";

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

    if (IS_PAINT_SUPPORTED) {
      this.classList.add("squircle");
    } else {
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
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "radius": {
        if (IS_PAINT_SUPPORTED) {
          this.style.setProperty("--squircle-radius", newValue);
        } else {
          this._radius = Number.parseFloat(newValue);
        }
        break;
      }

      case "fill": {
        if (IS_PAINT_SUPPORTED) {
          this.style.setProperty("--squircle-fill", newValue);
        } else {
          this._fill = newValue;
        }
        break;
      }

      case "border-width": {
        if (IS_PAINT_SUPPORTED) {
          this.style.setProperty("--squircle-border-width", newValue);
        } else {
          this._borderWidth = Number.parseFloat(newValue);
        }
        break;
      }

      case "border-color": {
        if (IS_PAINT_SUPPORTED) {
          this.style.setProperty("--squircle-border-color", newValue);
        } else {
          this._borderColor = Number.parseFloat(newValue);
        }
        break;
      }

      default: {
        console.warn(`Unknown attribute ${name}`);
        return;
      }
    }

    if (!IS_PAINT_SUPPORTED) {
      this._scheduleRedraw();
    }
  }

  _scheduleRedraw() {
    if (this._animationFrame) return;
    this._animationFrame = requestAnimationFrame(() => {
      this._animationFrame = null;
      draw(this._context, this._width, this._height);
    });
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} dt Delta time in milliseconds
 * @param {number} width
 * @param {number} height
 */
function draw(ctx, width, height) {
  ctx.reset();
  ctx.fillStyle = "black";
  paint(ctx, 0, 0, width, height, 10);
}

main();

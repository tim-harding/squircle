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
  static observedAttributes = [];

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

      let width = 0;
      let height = 0;

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const sizes = entry.borderBoxSize ?? entry.contentBoxSize;
          if (sizes) {
            const [{ inlineSize, blockSize }] = sizes;
            width = inlineSize;
            height = blockSize;
          } else {
            const rect = entry.contentRect;
            width = rect.width;
            height = rect.height;
          }
          width = Math.round(width);
          height = Math.round(height);
          canvas.width = Math.round(width);
          canvas.height = Math.round(height);
          ctx.scale(devicePixelRatio, devicePixelRatio);
          draw(ctx, width, height);
        }
      });
      observer.observe(this);
    }
  }

  //attributeChangedCallback(name, oldValue, newValue) {}
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

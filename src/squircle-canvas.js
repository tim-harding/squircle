import { paint } from "@/drawing";

const stylesString = `
body {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "fill";
  padding: 0rem;
  margin: 0rem;
  width: 100%;
  height: 100%;
}

.canvas {
  grid-area: fill;
  width: 100%;
  height: 100%;
  contain: strict;
}

canvas {
  width: 100%;
  height: 100%;
}

.content {
  grid-area: fill;
  z-index: 1;
}
`;

const styles = new CSSStyleSheet();
styles.replace(stylesString);

const templateString = `
<div class="canvas">
  <canvas></canvas>
</div>
<div class="content">
  <slot></slot>
</div>
`;

const template = new DocumentFragment();
template.append(
  new DOMParser().parseFromString(templateString, "text/html").body,
);

export default class SquircleCanvas extends HTMLElement {
  _radius = 0;
  _fill = "rgba(0, 0, 0, 0)";
  _borderWidth = 0;
  _borderColor = "rgba(0, 0, 0, 0)";
  _animationFrame = -1;
  _width = 0;
  _height = 0;
  _shadow;
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
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.setAttribute("impl", "canvas");
    this._shadow.adoptedStyleSheets = [styles];

    this._shadow.appendChild(template.cloneNode(true));
    const canvas = this._shadow.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {});

    if (ctx === null) {
      console.error("Could not get canvas 2D context");
      return;
    }

    this._context = ctx;
    this._width = 0;
    this._height = 0;

    let dprPrevious = devicePixelRatio;
    window.addEventListener("resize", () => {
      if (devicePixelRatio !== dprPrevious) {
        this._width = Math.round(canvas.clientWidth * devicePixelRatio);
        this._height = Math.round(canvas.clientHeight * devicePixelRatio);
        canvas.width = this._width;
        canvas.height = this._height;
        this._draw();
      }
      dprPrevious = devicePixelRatio;
    });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const sizes = entry.borderBoxSize ?? entry.contentBoxSize;
        let w, h;
        if (sizes) {
          const [{ inlineSize, blockSize }] = sizes;
          w = inlineSize;
          h = blockSize;
        } else {
          const rect = entry.contentRect;
          w = rect.width;
          h = rect.height;
        }
        w = Math.round(w * devicePixelRatio);
        h = Math.round(h * devicePixelRatio);
        this._width = w;
        this._height = h;
        canvas.width = w;
        canvas.height = h;
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
      this._radius * devicePixelRatio,
      this._borderWidth * devicePixelRatio,
      this._fill,
      this._borderColor,
    );
  }
}

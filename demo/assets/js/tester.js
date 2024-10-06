/**
 * @typedef {"top-left" | "bottom-right"} Side
 * @typedef {{ x: number, y: number, side: Side }} CornerEventProps
 * @typedef {CustomEvent<CornerEventProps>} CornerEvent
 *
 * @typedef {{ value: string, aspect: string }} ControlEventProps
 * @typedef {CustomEvent<ControlEventProps>} ControlEvent
 */

export class Tester extends HTMLElement {
  /** @type {HTMLElement?} */
  _squircle = null;

  constructor() {
    super();
  }

  connectedCallback() {
    this._squircle = this.querySelector("th-squircle");
  }
}

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
    listen("th-control__change", this._handleControlChange);
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

    switch (corner._side) {
      case "top-left": {
        corner.setAttribute("x", `${this._l}px`);
        corner.setAttribute("y", `${this._t}px`);
        break;
      }

      case "bottom-right": {
        corner.setAttribute("x", `${this._r}px`);
        corner.setAttribute("y", `${this._b}px`);
        break;
      }

      default: {
        console.warn(`Unexpected corner side: ${corner._side}`);
        break;
      }
    }
  }

  /**
   * @param {CornerEvent} event
   */
  _handleCornerUpdate(event) {
    const corner = event.target;
    if (!(corner instanceof Corner)) return;

    const { x: xSelf, y: ySelf, width, height } = this.getBoundingClientRect();
    const { side, x: xViewport, y: yViewport } = event.detail;

    const x = Math.max(0, Math.min(width, xViewport - xSelf));
    const y = Math.max(0, Math.min(height, yViewport - ySelf));

    corner.setAttribute("x", `${x}px`);
    corner.setAttribute("y", `${y}px`);

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
    const x = this._l;
    const y = this._t;
    const w = this._r - x;
    const h = this._b - y;

    const squircle = this._squircle;
    if (squircle === null) return;
    squircle.style.left = `${x}px`;
    squircle.style.top = `${y}px`;
    squircle.style.width = `${w}px`;
    squircle.style.height = `${h}px`;
  }

  /**
   * @param {ControlEvent} event
   */
  _handleControlChange(event) {
    console.log(event);
  }
}

export class Corner extends HTMLElement {
  _isPressed = false;
  _side = "";

  static get observedAttributes() {
    return ["side", "x", "y"];
  }

  constructor() {
    super();
    const listen = listenPassive.bind(this, this);
    const listenDoc = listenPassive.bind(this, document);
    listen("mousedown", this._handleMouseDown);
    listenDoc("mouseup", this._handleMouseUp);
    listenDoc("mousemove", this._handleMouseMove);
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "side": {
        this._side = newValue;
        const event = new CustomEvent("th-corner__register", { bubbles: true });
        this.dispatchEvent(event);
        break;
      }

      case "x": {
        this.style.left = newValue;
        break;
      }

      case "y": {
        this.style.top = newValue;
        break;
      }
    }
  }

  _handleMouseDown() {
    this._isPressed = true;
  }

  _handleMouseUp() {
    this._isPressed = false;
  }

  /**
   * @param {MouseEvent} mouseEvent
   */
  _handleMouseMove(mouseEvent) {
    if (!this._isPressed) return;
    const { clientX: x, clientY: y } = mouseEvent;
    const event = new CustomEvent("th-corner__update", {
      detail: { x, y, side: this._side },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }
}

export class Control extends HTMLElement {
  _aspect = "";

  static get observedAttributes() {
    return ["aspect"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const input = this.querySelector("input");
    if (!(input instanceof HTMLInputElement)) {
      console.warn("Expected input element");
      return;
    }

    const listen = listenPassive.bind(this, this);
    listen("change", this._handleChange);
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "aspect": {
        this._aspect = newValue;
        break;
      }
    }
  }

  /**
   * @param {InputEvent} inputEvent
   */
  _handleChange(inputEvent) {
    const target = inputEvent.target;
    if (!(target instanceof HTMLInputElement)) return;
    const value = target.value;
    const event = new CustomEvent("th-control__change", {
      detail: { value, aspect: this._aspect },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }
}

/**
 * @this {any}
 * @param {any} target
 * @param {string} name
 * @param {any} handler
 */
function listenPassive(target, name, handler) {
  target.addEventListener(name, handler.bind(this), {
    passive: true,
  });
}

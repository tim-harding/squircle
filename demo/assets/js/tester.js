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

export class DragArea extends HTMLElement {
  _l = SIDE_OFFSET;
  _r = 0;
  _t = SIDE_OFFSET;
  _b = 0;
  /** @type {HTMLElement?} */
  _squircle = null;

  constructor() {
    super();
    const listen = listenPassive.bind(this);
    listen("th-corner__update", this._handleCornerUpdate);
    listen("th-corner__register", this._handleCornerRegister);
    listen("th-control__change", this._handleControlChange);
  }

  connectedCallback() {
    this._squircle = this.querySelector("th-squircle");
  }

  /**
   * @param {CustomEvent} event
   */
  _handleCornerRegister(event) {
    const corner = event.target;
    if (!(corner instanceof Corner)) {
      console.warn("Expected a corner element");
      return;
    }

    switch (corner._side) {
      case "top-left": {
        corner.setAttribute("y", `${this._t}px`);
        corner.setAttribute("x", `${this._l}px`);
        break;
      }

      case "bottom-right": {
        const { clientWidth: w, clientHeight: h } = this;
        this._r = w - SIDE_OFFSET;
        this._b = h - SIDE_OFFSET;
        corner.setAttribute("y", `${this._b}px`);
        corner.setAttribute("x", `${this._r}px`);
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
    console.log(event);
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
    const listen = listenPassive.bind(this);
    listen("mousedown", this._handleMouseDown);
    listen("mouseup", this._handleMouseUp);
    listen("mousemove", this._handleMouseMove);
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
    const { movementX: x, movementY: y } = mouseEvent;
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

    const listen = listenPassive.bind(this);
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
 * @this {HTMLElement}
 * @param {string} name
 * @param {any} handler
 */
function listenPassive(name, handler) {
  this.addEventListener(name, handler.bind(this), {
    passive: true,
  });
}

/**
 * @typedef {"top-left" | "bottom-right"} Position
 * @typedef {{ x: number, y: number, position: Position }} CornerEventProps
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
    const listen = listenPassive.bind(this);
    listen("th-tester-corner", this._handleCorner);
    listen("th-tester-control", this._handleControl);
  }

  connectedCallback() {
    this._squircle = this.querySelector("th-squircle");
  }

  /**
   * @param {CornerEvent} event
   */
  _handleCorner(event) {
    console.log(event);
  }

  /**
   * @param {ControlEvent} event
   */
  _handleControl(event) {
    console.log(event);
  }
}

export class Corner extends HTMLElement {
  _isPressed = false;
  _position = "";

  static get observedAttributes() {
    return ["position"];
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
      case "position": {
        this._position = newValue;
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
    const event = new CustomEvent("th-tester-corner", {
      detail: { x, y, position: this._position },
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
    const event = new CustomEvent("th-tester-control", {
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

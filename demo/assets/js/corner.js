import { listenPassive } from "./shared.js";
import { NAME as NAME_DRAG_AREA } from "./drag-area.js";

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
        customElements.whenDefined(NAME_DRAG_AREA).then(() => {
          const event = new CustomEvent("th-corner__register", {
            bubbles: true,
          });
          this.dispatchEvent(event);
        });
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

export const NAME = "th-corner";
export const Component = Corner;

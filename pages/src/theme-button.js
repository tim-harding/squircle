import { listenPassive } from "pages/shared";

export class ThemeButton extends HTMLElement {
  _isLight = true;
  /** @type {ElementInternals} */
  _internals;

  constructor() {
    super();
    const listen = listenPassive.bind(this, this);
    listen("click", this._handleClick);
    listen("keypress", this._handleKey);
    this._internals = this.attachInternals();
    this._internals.role = "button";
    this._internals.ariaPressed = "true";
  }

  /**
   * @param {MouseEvent} _
   */
  _handleClick(_) {
    this._toggleTheme();
  }

  /**
   * @param {KeyboardEvent} event
   */
  _handleKey(event) {
    switch (event.key) {
      case "Enter": {
        this._toggleTheme();
        break;
      }
    }
  }

  _toggleTheme() {
    this._isLight = !this._isLight;
    this._internals.ariaPressed = `${this._isLight}`;
    const toAdd = this._isLight ? "theme-latte" : "theme-frappe";
    const toRemove = this._isLight ? "theme-frappe" : "theme-latte";
    document.body.classList.add(toAdd);
    document.body.classList.remove(toRemove);
    this.classList.toggle("dark");
  }
}

export const Component = ThemeButton;
export const NAME = "th-theme-button";

export default class SquircleHoudini extends HTMLElement {
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
    this.setAttribute("impl", "houdini");
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    const propertyName = `--squircle-${name}`;

    switch (name) {
      case "background-color":
      case "border-color": {
        this.style.setProperty(propertyName, newValue);
        break;
      }

      case "border-radius":
      case "border-width": {
        this._setNumericStyle(propertyName, newValue);
        break;
      }
    }
  }

  /**
   * @param {string} name
   * @param {string} valueString
   */
  _setNumericStyle(name, valueString) {
    const value = Number.parseFloat(valueString);
    if (Number.isNaN(value)) {
      this.style.removeProperty(name);
    } else {
      this.style.setProperty(name, `${value}px`);
    }
  }
}

export default class SquircleHoudini extends HTMLElement {
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
    this.classList.add("squircle");
  }

  /**
   * @param {string} name
   * @param {string} _
   * @param {string} newValue
   */
  attributeChangedCallback(name, _, newValue) {
    this.style.setProperty(`--squircle-${name}`, newValue);
  }
}

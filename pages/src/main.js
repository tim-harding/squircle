import { createCustomElement, register } from "@/index.js";
import { Control } from "pages/control.js";
import { ThemeButton } from "pages/theme-button.js";
import { state } from "pages/shared";

function main() {
  register();
  createCustomElement();
  customElements.define("th-control", Control);
  customElements.define("th-theme-button", ThemeButton);

  const squircle = document.querySelector("ce-squircle");
  if (!squircle) return;
  state.subscribe(() => {
    squircle.setAttribute("background-color", state.fill);
    squircle.setAttribute("border-radius", `${state.radius}`);
    squircle.setAttribute("border-width", `${state.borderWidth}`);
    squircle.setAttribute("border-color", state.borderColor);
  });
}

main();

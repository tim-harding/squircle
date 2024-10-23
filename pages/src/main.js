import { createCustomElement, register } from "@/index.js";
import { Tester } from "pages/tester.js";
import { DragArea } from "pages/drag-area.js";
import { Control } from "pages/control.js";
import { ThemeButton } from "pages/theme-button.js";

function main() {
  register();
  createCustomElement();
  customElements.define("th-tester", Tester);
  customElements.define("th-drag-area", DragArea);
  customElements.define("th-control", Control);
  customElements.define("th-theme-button", ThemeButton);
}

main();

import { DragArea } from "pages/drag-area.js";
import { Control } from "pages/control.js";
import { ThemeButton } from "pages/theme-button.js";

function main() {
  customElements.define("th-drag-area", DragArea);
  customElements.define("th-control", Control);
  customElements.define("th-theme-button", ThemeButton);
}

main();

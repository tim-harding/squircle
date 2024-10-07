import { register, path } from "/src/index.mjs";

register("/src/worklet.mjs");

const svg = document.getElementById("squircle-svg");
const d = path(0, 0, 512, 256, 32);
svg.setAttribute("d", d);

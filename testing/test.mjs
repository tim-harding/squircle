import { register, path, polygon } from "/src/index.mjs";

register("/src/worklet.mjs");

const svg = document.getElementById("squircle-svg");
const d = path(0, 0, 512, 256, 32);
svg.setAttribute("d", d);

const clipped = document.getElementById("clipped");
const clip = polygon(0, 0, 512, 256, 64);
console.log(clip);
clipped.style.clipPath = clip;

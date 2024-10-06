import { register } from "https://unpkg.com/superellipse-squircle@0.1.6/index.mjs";

function main() {
  register("https://unpkg.com/superellipse-squircle@0.1.6/worklet.min.js");

  const canvas = document.getElementById("squircle-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error("Missing canvas");
    return;
  }

  const ctx = canvas.getContext("2d", {
    colorSpace: "display-p3",
    alpha: false,
  });
  if (ctx === null) {
    console.error("Could not get canvas 2D context");
    return;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const [w, h] = entrySize(entry);
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);
      draw(ctx, 0);
    }
  });
  observer.observe(canvas);

  let lastUpdate = Date.now();
  function updateAndDraw() {
    const now = Date.now();
    const dt = now - lastUpdate;
    lastUpdate = now;
    draw(ctx, dt);
  }

  function drawLoop() {
    updateAndDraw();
    requestAnimationFrame(drawLoop);
  }

  drawLoop();
}

/**
 * @param {ResizeObserverEntry} entry
 */
function entrySize(entry) {
  if (entry.borderBoxSize) {
    const [{ inlineSize: w, blockSize: h }] = entry.borderBoxSize;
    return [w, h];
  } else if (entry.contentBoxSize) {
    const [{ inlineSize: w, blockSize: h }] = entry.contentBoxSize;
    return [w, h];
  } else {
    const { width: w, height: h } = entry.contentRect;
    return [w, h];
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} dt Delta time in milliseconds
 */
function draw(ctx, dt) {
  ctx.reset();
  ctx.fillStyle = "white";
  ctx.ellipse(100, 100, 24, 24, 0, 0, 2 * Math.PI);
  ctx.fill();
}

main();

class Highlight {
  static get contextOptions() {
    return { alpha: true };
  }

  /**
   * @param {OffscreenCanvasRenderingContext2D} ctx
   */
  paint(ctx) {
    ctx.fillStyle = "hsl(55 90% 60% / 100%)";
    ctx.fillRect(0, 15, 200, 20); /* order: x, y, w, h */
  }
}

registerPaint("headerHighlight", Highlight);

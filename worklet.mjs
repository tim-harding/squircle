class Squircle {
  static get contextOptions() {
    return { alpha: true };
  }

  /**
   * @param {OffscreenCanvasRenderingContext2D} ctx
   */
  paint(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 15, 200, 20);
  }
}

registerPaint("squircle", Squircle);

class Squircle {
  static get contextOptions() {
    return { alpha: true };
  }

  /**
   * @param {OffscreenCanvasRenderingContext2D} ctx
   */
  paint(ctx, size) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, size.width, size.height);
  }
}

registerPaint("squircle", Squircle);

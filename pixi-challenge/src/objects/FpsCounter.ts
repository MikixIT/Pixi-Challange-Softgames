import { Text, TextStyle } from "pixi.js";
import type { IDestroyOptions } from "pixi.js";
import { app } from "../core/app";

export class FpsCounter extends Text {
  private lastTime = performance.now();
  private frameCount = 0;

  constructor() {
    super(
      "FPS: 0",
      new TextStyle({
        fontSize: 16,
        fill: "#00ff00",
        fontFamily: "monospace",
      })
    );

    this.x = 10;
    this.y = 10;

    app.ticker.add(this.updateFps, this);
  }

  private updateFps(): void {
    this.frameCount++;
    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / delta);
      this.text = `FPS: ${fps}`;
      this.lastTime = now;
      this.frameCount = 0;
    }
  }

  destroy(options?: boolean | IDestroyOptions): void {
    app.ticker.remove(this.updateFps, this);
    super.destroy(options);
  }
}

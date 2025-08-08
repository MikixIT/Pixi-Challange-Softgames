import { Application } from "pixi.js";
import { initDevtools } from "@pixi/devtools";

export const app = new Application({
  resizeTo: window,
  backgroundColor: 0x000000,
  antialias: true,
});
document.body.appendChild(app.view as unknown as HTMLCanvasElement);
initDevtools({ app });

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

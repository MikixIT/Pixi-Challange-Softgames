import "./styles/global.css";
import { Assets } from "pixi.js";
import { showMenu } from "./scenes/MenuScene";

async function start() {
  await Assets.load({ alias: "card", src: "assets/CardTexture.png" });

  showMenu();
}

window.addEventListener("load", start);

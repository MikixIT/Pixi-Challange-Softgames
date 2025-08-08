import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { app } from "../core/app";
import { BackButton } from "../objects/BackButton";
import { showMenu } from "./MenuScene";
import { AceStackManager } from "../objects/AceStackManager";
import { FpsCounter } from "../objects/FpsCounter";
import { gsap } from "gsap";

export function showAceScene() {
  const scene = new Container();
  app.stage.removeChildren();
  app.stage.addChild(scene);

  const background = new Graphics();
  background.beginFill(0x0a0a0f);
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();
  scene.addChild(background);

  const gradientOverlay = new Graphics();
  gradientOverlay.beginFill(0x16213e, 0.3);
  gradientOverlay.drawRect(0, 0, app.screen.width, app.screen.height);
  gradientOverlay.endFill();
  scene.addChild(gradientOverlay);

  const title = new Text(
    "Ace of Shadows",
    new TextStyle({
      fill: [0x4ecdc4, 0x44a08d],
      fontSize: 56,
      fontWeight: "bold",
      letterSpacing: 8,
      dropShadow: true,
      dropShadowColor: 0x4ecdc4,
      dropShadowDistance: 4,
      dropShadowBlur: 8,
      stroke: "#0a0a0f",
      strokeThickness: 2,
    })
  );

  title.anchor.set(0.5);
  title.position.set(app.screen.width / 2, 80);
  scene.addChild(title);

  gsap.to(title, {
    alpha: 0.7,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
  });

  const subtitle = new Text(
    "Automated Card Flow System",
    new TextStyle({
      fill: "#7fb3d3",
      fontSize: 20,
      fontStyle: "italic",
      letterSpacing: 2,
    })
  );

  subtitle.anchor.set(0.5);
  subtitle.position.set(app.screen.width / 2, 130);
  subtitle.alpha = 0.8;
  scene.addChild(subtitle);

  const manager = new AceStackManager(scene);

  const fpsCounter = new FpsCounter();
  fpsCounter.position.set(app.screen.width - 150, 20);
  scene.addChild(fpsCounter);

  const backButton = new BackButton(() => {
    gsap.killTweensOf(scene.children);
    gsap.killTweensOf(title);

    if (manager.destroy) {
      manager.destroy();
    }

    app.stage.removeChild(scene);
    scene.destroy({ children: true });
    showMenu();
  });

  backButton.position.set(50, 50);
  scene.addChild(backButton);

  gsap.fromTo(
    scene,
    { alpha: 0 },
    { alpha: 1, duration: 1, ease: "power2.out" }
  );
}

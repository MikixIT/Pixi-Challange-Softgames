import { Container, Text, TextStyle, Graphics } from "pixi.js";
import { app } from "../core/app";
import { gsap } from "gsap";
import { showAceScene } from "./AceScene";
import { showMagicScene } from "./MagicScene";
import { showPhoenixScene } from "./PhoenixScene";

export function showMenu() {
  const scene = new Container();
  app.stage.removeChildren();
  app.stage.addChild(scene);

  const background = new Graphics();
  background
    .beginFill(0x100020)
    .drawRect(0, 0, app.screen.width, app.screen.height)
    .endFill();
  scene.addChild(background);

  const pulse = new Graphics()
    .beginFill(0x4422aa, 0.1)
    .drawCircle(0, 0, 300)
    .endFill();
  pulse.position.set(app.screen.width / 2, app.screen.height / 2);
  scene.addChild(pulse);

  gsap.to(pulse.scale, {
    x: 1.3,
    y: 1.3,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  const title = new Text(
    "PIXIJAM – MENU",
    new TextStyle({
      fontSize: 36,
      fill: [0xffffff, 0xffcc00],
      fontWeight: "bold",
      dropShadow: true,
      dropShadowBlur: 5,
    })
  );
  title.anchor.set(0.5);
  title.position.set(app.screen.width / 2, app.screen.height / 4);
  scene.addChild(title);

  const buttons = [
    { label: "Ace of Shadows", onClick: showAceScene },
    { label: "Magic Words", onClick: showMagicScene },
    { label: "Phoenix Flame", onClick: showPhoenixScene },
  ];

  buttons.forEach((btn, i) => {
    const buttonY = 400 + i * 100;

    const bg = new Graphics()
      .beginFill(0xffcc00)
      .drawRoundedRect(0, 0, 260, 60, 16)
      .endFill();

    bg.x = app.screen.width / 2 - 130;
    bg.y = buttonY;
    bg.eventMode = "static";
    bg.cursor = "pointer";

    bg.on("pointerover", () => {
      gsap.to(bg.scale, { x: 1.05, y: 1.05, duration: 0.2 });
    });

    bg.on("pointerout", () => {
      gsap.to(bg.scale, { x: 1, y: 1, duration: 0.2 });
    });

    bg.on("pointerdown", () => {
      gsap.to(bg, {
        alpha: 0.6,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: btn.onClick,
      });
    });

    const label = new Text(
      btn.label,
      new TextStyle({
        fontSize: 22,
        fill: "black",
        fontWeight: "bold",
      })
    );
    label.anchor.set(0.5);
    label.position.set(bg.x + 130, bg.y + 30);

    scene.addChild(bg);
    scene.addChild(label);
  });
}

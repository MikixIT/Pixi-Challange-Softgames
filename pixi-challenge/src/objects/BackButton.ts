import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class BackButton extends Container {
  constructor(onClick: () => void) {
    super();

    const bg = new Graphics();
    bg.beginFill(0x333333);
    bg.drawRoundedRect(0, 0, 120, 40, 8);
    bg.endFill();
    bg.eventMode = "static";
    bg.cursor = "pointer";
    bg.on("pointerdown", onClick);
    this.addChild(bg);

    const label = new Text(
      "Back to Menu",
      new TextStyle({
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: "bold",
      })
    );
    label.anchor.set(0.5);
    label.position.set(60, 20);
    this.addChild(label);

    this.x = 1000;
    this.y = 900;
  }
}

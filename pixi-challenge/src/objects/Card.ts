import { Sprite, Texture } from "pixi.js";

export class Card extends Sprite {
  constructor(texture: Texture) {
    super(texture);
    this.anchor.set(0.5);
    this.scale.set(0.2);
  }
}

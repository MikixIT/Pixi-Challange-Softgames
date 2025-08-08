import { Container } from "pixi.js";
import { Card } from "./Card";
import { app } from "../core/app";
import { gsap } from "gsap";
import { Assets } from "pixi.js";

export class AceStackManager {
  public stacks: Container[] = [];
  public cards: Card[] = [];
  private scene: Container;
  private items: Container[] = []; // Initialize empty array
  private moveInterval: ReturnType<typeof setInterval> | null = null;

  constructor(scene: Container) {
    this.scene = scene;
    this.createStacks();
    this.createCards();
    this.startMovingTopCard();
  }

  private createStacks() {
    const spacing = 300;
    for (let i = 0; i < 3; i++) {
      const stack = new Container();
      stack.x = app.screen.width / 2 - spacing + i * spacing;
      stack.y = app.screen.height / 2;
      this.scene.addChild(stack);
      this.stacks.push(stack);
    }
  }

  private createCards() {
    const texture = Assets.get("card");
    const totalCards = 144;

    for (let i = 0; i < totalCards; i++) {
      const card = new Card(texture);
      let yOffset = 0;
      if (i >= totalCards - 2) {
        yOffset = -(i - (totalCards - 3) + 1) * 10;
      }

      card.position.set(0, yOffset);
      this.stacks[0].addChild(card);
      this.cards.push(card);
    }
  }

  private startMovingTopCard() {
    this.moveInterval = setInterval(() => {
      const fromStack = this.getTopStackWithCards();
      if (!fromStack) return;

      const topCard = fromStack.children[fromStack.children.length - 1] as Card;
      if (!topCard) return;

      fromStack.removeChild(topCard);

      const otherStacks = this.stacks.filter((s) => s !== fromStack);
      const toStack =
        otherStacks[Math.floor(Math.random() * otherStacks.length)];

      const globalPos = fromStack.toGlobal(topCard.position);
      topCard.position.set(globalPos.x, globalPos.y);
      app.stage.addChild(topCard);

      const toX = toStack.x;
      const toY = toStack.y - toStack.children.length * 0.5;

      gsap.to(topCard, {
        x: toX,
        y: toY,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          const local = toStack.toLocal({ x: toX, y: toY });
          topCard.position.set(local.x, local.y);
          toStack.addChild(topCard);
        },
      });
    }, 1000);
  }

  private getTopStackWithCards(): Container | null {
    return this.stacks.find((stack) => stack.children.length > 0) || null;
  }

  destroy(): void {
    // Clear the movement interval
    if (this.moveInterval !== null) {
      window.clearInterval(this.moveInterval);
      this.moveInterval = null;
    }

    // Kill animations on all cards
    this.cards.forEach((card) => {
      gsap.killTweensOf(card);
    });

    // Kill animations on all stacks
    this.stacks.forEach((stack) => {
      gsap.killTweensOf(stack);
    });

    // Clear references
    this.items = [];
    this.cards = [];
    this.stacks = [];
    this.scene = null!;
  }
}

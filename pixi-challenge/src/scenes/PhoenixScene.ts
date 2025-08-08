import { Container, Text, TextStyle, Sprite, Texture, Assets } from "pixi.js";
import { app } from "../core/app";
import { gsap } from "gsap";
import { BackButton } from "../objects/BackButton";
import { FpsCounter } from "../objects/FpsCounter";
import { showMenu } from "./MenuScene";

class FireParticle extends Sprite {
  private velocityY: number;
  private velocityX: number;

  constructor(texture: Texture) {
    super(texture);
    this.anchor.set(0.5);
    this.velocityY = -2 - Math.random() * 2;
    this.velocityX = (Math.random() - 0.5) * 1;
    this.alpha = 0.8 + Math.random() * 0.2;
    const initialScale = 0.5 + Math.random() * 0.5;
    this.scale.set(initialScale);
  }

  update() {
    this.y += this.velocityY;
    this.x += this.velocityX;
    this.x += (Math.random() - 0.5) * 1.5;
    this.alpha -= 0.012;
    this.scale.set(this.scale.x * 0.985);
    this.velocityY -= 0.05;
  }

  reset(x: number, y: number, texture: Texture) {
    this.texture = texture;
    this.position.set(x, y);
    const initialScale = 0.5 + Math.random() * 0.5;
    this.scale.set(initialScale);
    this.alpha = 0.8 + Math.random() * 0.2;
    this.velocityY = -2 - Math.random() * 2;
    this.velocityX = (Math.random() - 0.5) * 1;
    const heatVariation = Math.random();
    if (heatVariation > 0.7) {
      this.tint = 0xffff00;
    } else if (heatVariation > 0.4) {
      this.tint = 0xff6600;
    } else {
      this.tint = 0xff3300;
    }
  }
}

class FireEffect extends Container {
  private particles: FireParticle[] = [];
  private maxParticles = 10;
  private spawnTimer: ReturnType<typeof setInterval> | null = null;
  private fireTextures: Texture[] = [];

  constructor(fireTextures: Texture[]) {
    super();
    this.fireTextures = fireTextures;

    for (let i = 0; i < this.maxParticles; i++) {
      const particle = new FireParticle(fireTextures[0]);
      particle.visible = false;
      this.particles.push(particle);
      this.addChild(particle);
    }

    this.spawnTimer = setInterval(() => this.spawnParticle(), 150);
  }

  private spawnParticle() {
    const inactive = this.particles.find((p) => !p.visible);
    if (inactive) {
      inactive.visible = true;
      const randomTexture =
        this.fireTextures[Math.floor(Math.random() * this.fireTextures.length)];
      const baseX = app.screen.width / 2 + (Math.random() - 0.5) * 80;
      const baseY = app.screen.height / 2 + 120;
      inactive.reset(baseX, baseY, randomTexture);
    }
  }

  update() {
    this.particles.forEach((particle) => {
      if (particle.visible) {
        particle.update();
        if (particle.alpha <= 0 || particle.y < app.screen.height / 2 - 200) {
          particle.visible = false;
        }
      }
    });
  }

  destroy() {
    if (this.spawnTimer !== null) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    super.destroy();
  }
}

export async function showPhoenixScene() {
  const scene = new Container();
  app.stage.removeChildren();
  app.stage.addChild(scene);

  const fireAssets = [
    "assets/flame1.png",
    "assets/flame2.png",
    "assets/spark.png",
  ];

  try {
    const fireTextures: Texture[] = [];

    for (const assetPath of fireAssets) {
      try {
        const texture = await Assets.load(assetPath);
        fireTextures.push(texture);
      } catch (error) {
        console.warn(` Error Loading ${assetPath}, jumped`);
      }
    }

    if (fireTextures.length === 0) {
      console.warn("Texture Error Loading, using fallback texture");
      fireTextures.push(Texture.WHITE);
    }

    const fireEffect = new FireEffect(fireTextures);
    scene.addChild(fireEffect);

    const label = new Text("Phoenix Flame", {
      fill: [0xff6600, 0xffff00],
      fontSize: 48,
      fontWeight: "bold",
      stroke: "#330000",
    });

    label.anchor.set(0.5);
    label.position.set(app.screen.width / 2, app.screen.height / 2 - 100);
    scene.addChild(label);

    gsap.to(label.scale, {
      x: 1.05,
      y: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    const backButton = new BackButton(() => {
      fireEffect.destroy();
      scene.destroy();
      gsap.killTweensOf(label.scale);
      showMenu();
    });

    backButton.position.set(300, 80);
    scene.addChild(backButton);

    const updateTicker = () => {
      fireEffect.update();
    };

    app.ticker.add(updateTicker);
    (scene as any).updateTicker = updateTicker;
  } catch (error) {
    console.error("Texture Error Loading", error);
    const errorLabel = new Text(
      "Texture Error Loading",
      new TextStyle({ fill: "red", fontSize: 24 })
    );
    errorLabel.anchor.set(0.5);
    errorLabel.position.set(app.screen.width / 2, app.screen.height / 2);
    scene.addChild(errorLabel);
  }

  const fpsCounter = new FpsCounter();
  fpsCounter.position.set(app.screen.width - 1600, 70);
  scene.addChild(fpsCounter);
}

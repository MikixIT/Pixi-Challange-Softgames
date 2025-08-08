import {
  Container,
  Text,
  Sprite,
  TextStyle,
  Graphics,
  Rectangle,
} from "pixi.js";
import { app } from "../core/app";
import { showMenu } from "./MenuScene";
import { BackButton } from "../objects/BackButton";
import { FpsCounter } from "../objects/FpsCounter";
import { fetchDialogueData } from "../utils/api";
import { gsap } from "gsap";

function parseMessage(
  message: string = ""
): (string | { type: "emoji"; name: string })[] {
  const regex = /\{(.*?)\}/g;
  const parts: (string | { type: "emoji"; name: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index));
    }
    parts.push({ type: "emoji", name: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex));
  }

  return parts;
}

export async function showMagicScene() {
  const scene = new Container();
  app.stage.removeChildren();
  app.stage.addChild(scene);

  const background = new Graphics();
  background.beginFill(0x0f0f23);
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();
  scene.addChild(background);

  const gradientOverlay = new Graphics();
  gradientOverlay.beginFill(0x1a1a3a, 0.6);
  gradientOverlay.drawRect(0, 0, app.screen.width, app.screen.height);
  gradientOverlay.endFill();
  scene.addChild(gradientOverlay);

  const header = new Container();

  const title = new Text(
    "Magic Chat",
    new TextStyle({
      fill: [0x4ecdc4, 0x44a08d],
      fontSize: 42,
      fontWeight: "bold",
      letterSpacing: 3,
      dropShadow: false,
    })
  );
  title.anchor.set(0.5);
  title.position.set(app.screen.width / 2, 50);
  header.addChild(title);
  scene.addChild(header);

  gsap.to(title, {
    alpha: 0.8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
  });

  const scrollContainer = new Container();
  const scrollMask = new Graphics();
  scrollMask.beginFill(0xffffff);
  scrollMask.drawRect(0, 110, app.screen.width, app.screen.height - 160);
  scrollMask.endFill();

  scrollContainer.mask = scrollMask;
  scene.addChild(scrollMask);
  scene.addChild(scrollContainer);

  const chatContainer = new Container();
  scrollContainer.addChild(chatContainer);

  const data = await fetchDialogueData();

  const nameStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 22,
    fontWeight: "bold",
    fill: "#FFD700",
    dropShadow: false,
  });

  const messageStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 19,
    fill: "#E6E6FA",
    wordWrap: true,
    wordWrapWidth: app.screen.width - 200,
    lineHeight: 28,
  });

  let y = 20;
  const avatarSize = 70;
  const padding = 25;
  const startX = padding + avatarSize + padding;
  const messageSpacing = 30;

  const emojiMap: Record<string, string> = {};
  data.emojies.forEach((emoji) => {
    emojiMap[emoji.name] = emoji.url;
  });

  const avatarMap: Record<string, string> = {};
  data.dialogue.forEach((msg) => {
    if (!avatarMap[msg.name]) {
      const avatar = data.avatars.find((a) => a.name === msg.name);
      if (avatar) {
        avatarMap[msg.name] = avatar.url;
      }
    }
  });

  const userColors: Record<string, number> = {};
  const colors = [
    0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3, 0x54a0ff,
  ];
  let colorIndex = 0;

  for (const msg of data.dialogue) {
    const messageContainer = new Container();
    messageContainer.x = 0;
    messageContainer.y = y;

    if (!userColors[msg.name]) {
      userColors[msg.name] = colors[colorIndex % colors.length];
      colorIndex++;
    }

    const messageBubble = new Graphics();
    const bubbleWidth = app.screen.width - 40;

    messageBubble.beginFill(userColors[msg.name], 0.1);
    messageBubble.lineStyle(2, userColors[msg.name], 0.3);
    messageBubble.drawRoundedRect(10, 0, bubbleWidth, 80, 15);
    messageBubble.endFill();
    messageContainer.addChild(messageBubble);

    if (avatarMap[msg.name]) {
      const avatarContainer = new Container();

      const avatarBorder = new Graphics();
      avatarBorder.lineStyle(3, userColors[msg.name], 0.8);
      avatarBorder.drawCircle(avatarSize / 2, avatarSize / 2, avatarSize / 2);
      avatarContainer.addChild(avatarBorder);

      const avatar = Sprite.from(avatarMap[msg.name]);
      avatar.width = avatarSize - 6;
      avatar.height = avatarSize - 6;
      avatar.x = 3;
      avatar.y = 3;

      const avatarMask = new Graphics();
      avatarMask.beginFill(0xffffff);
      avatarMask.drawCircle(
        avatarSize / 2,
        avatarSize / 2,
        (avatarSize - 6) / 2
      );
      avatarMask.endFill();
      avatar.mask = avatarMask;
      avatarContainer.addChild(avatarMask);
      avatarContainer.addChild(avatar);

      avatarContainer.x = padding;
      avatarContainer.y = 5;
      messageContainer.addChild(avatarContainer);
    }

    const nameText = new Text(msg.name, nameStyle);
    nameText.x = startX;
    nameText.y = 8;
    messageContainer.addChild(nameText);

    let currentX = startX;
    let currentY = nameText.y + nameText.height + 8;
    const parts = parseMessage(msg.text);

    for (const part of parts) {
      if (typeof part === "string") {
        const text = new Text(part, messageStyle);
        text.x = currentX;
        text.y = currentY;
        messageContainer.addChild(text);
        currentX += text.width + 3;

        if (currentX > app.screen.width - 50) {
          currentX = startX;
          currentY += 30;
        }
      } else {
        if (emojiMap[part.name]) {
          const emoji = Sprite.from(emojiMap[part.name]);
          emoji.width = emoji.height = 28;
          emoji.x = currentX;
          emoji.y = currentY;
          messageContainer.addChild(emoji);
          currentX += emoji.width + 5;

          if (currentX > app.screen.width - 50) {
            currentX = startX;
            currentY += 35;
          }
        }
      }
    }

    const actualHeight = Math.max(currentY + 35 - messageContainer.y, 80);
    messageBubble.height = actualHeight;

    chatContainer.addChild(messageContainer);
    y += actualHeight + messageSpacing;
  }

  let isDragging = false;
  let dragStartY = 0;
  let scrollStartY = 0;
  const maxScroll = Math.max(0, y - (app.screen.height - 260));

  scene.eventMode = "static";

  scene.on("pointerdown", (event) => {
    if (maxScroll > 0) {
      isDragging = true;
      dragStartY = event.data.global.y;
      scrollStartY = chatContainer.y;
    }
  });

  scene.on("pointermove", (event) => {
    if (isDragging && maxScroll > 0) {
      const deltaY = event.data.global.y - dragStartY;
      const newY = scrollStartY + deltaY;
      chatContainer.y = Math.max(-maxScroll, Math.min(0, newY));
    }
  });

  scene.on("pointerup", () => {
    isDragging = false;
  });

  scene.on("pointerupoutside", () => {
    isDragging = false;
  });

  const wheelHandler = (event: WheelEvent) => {
    if (maxScroll > 0) {
      event.preventDefault();
      const scrollSpeed = 6;
      const deltaY = event.deltaY * scrollSpeed;
      const newY = chatContainer.y - deltaY;
      const targetY = Math.max(-maxScroll, Math.min(0, newY));

      gsap.to(chatContainer, {
        y: targetY,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  (window as Window).addEventListener("wheel", wheelHandler, {
    passive: false,
  });

  const cleanup = () => {
    (window as Window).removeEventListener("wheel", wheelHandler);
  };

  const fpsCounter = new FpsCounter();
  fpsCounter.position.set(app.screen.width - 150, 10);
  scene.addChild(fpsCounter);

  const backButton = new BackButton(() => {
    cleanup();
    gsap.killTweensOf(scene.children);
    gsap.killTweensOf(title);
    gsap.killTweensOf(chatContainer);
    app.stage.removeChild(scene);
    scene.destroy({ children: true });
    showMenu();
  });
  backButton.position.set(10, 20);
  backButton.eventMode = "static";
  backButton.cursor = "pointer";
  backButton.children.forEach((child) => {
    if (child instanceof Text) {
      child.eventMode = "none";
    }
  });

  scene.addChild(backButton);
  scene.setChildIndex(backButton, scene.children.length - 1);
}

# Softgames Game Developer Assignment

## Overview

This project contains the solution to the Softgames Game Developer challenge consisting of three tasks:

1. **Ace of Shadows**  
   Implemented 144 sprites stacked like a deck of cards. The top card moves every 1 second to another stack with a smooth 2-second animation.

2. **Magic Words**  
   Created a chat dialogue system that combines text and custom emojis, fetching dialogue data from the provided API endpoint.

3. **Phoenix Flame**  
   Developed a particle-effect demo simulating a fire effect using up to 10 sprites simultaneously.

---

## Technical Details

- Written entirely in **TypeScript**
- Uses **Pixi.js v7** for rendering all scenes
- Animations handled with **GSAP** for smooth transitions
- Responsive rendering for both desktop and mobile screen sizes
- FPS counter displayed in the top-left corner
- Fullscreen rendering for an immersive experience
- All three tasks are accessible from a main in-game menu

---

## Features & Notes

- The **Magic Words** scene includes a built-in vertical scroll area, prepared for future mobile expansion and enhanced touch interaction.
- The **Phoenix Flame** scene preserves **notable performance** even with visual effects, keeping the active particles capped for stability.
- Due to the extremely short development time (~5 hours), some bugs and UI glitches persist, especially on mobile.
- The **resize functionality** currently requires a manual page refresh to properly adjust the game canvas to the new window size.

---

## Challenges

- I have **limited prior experience with Pixi.js (8.0)**, and faced difficulties adapting to version 7.0 since most examples and references are now based on version 8.0.
- The challenge was assigned around 2 PM with a strict **24-hour deadline**, giving me only half a day of actual working time.
- To deliver on time, I automated repetitive parts using AI assistance and focused on functionality, readability, and project structure.
- I’m not fully satisfied with the current polish, but proud of the result considering the time constraints and the learning curve.

---

## How to Run

```bash
git clone https://github.com/MikixIT/Pixi-Challange-Softgames.git
cd pixi-challenge
npm install
npm run dev
```

Then open the provided local server URL in your browser to start the app and navigate through the scenes from the main menu.

---

## Final Thanks

Thank you for this exciting challenge. It pushed me to expand my skills, especially in game development with Pixi.js and animation with GSAP. I look forward to your feedback and the possibility to improve further.

---

Michael Torres
Front-end & Fullstack Developer  
August 2025

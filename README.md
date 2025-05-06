# ZigZag

![Screenshot](./screenshots/screenshot.png)

A 3D ZigZag game built with React Three Fiber.

Stay on the wall and zigzag as far as you can!
Just tap the screen to change the ball’s direction.  
One wrong move and you’re off the edge!
How far can you make it?

## 🛠️ Technologies Used

- React
- Three.js
- React Three Fiber
- Drei
- Zustand

## 🎮 Overview

ZigZag is a minimalist, abstract endless runner where the player controls a black ball ⚫ rolling along a narrow, zigzagging ↖️↗️ path suspended in midair. With each tap, the ball changes direction by 90°, and the goal is to stay on the path for as long as possible. The challenge lies in tapping the screen at the right moment to prevent the ball from falling off the edges. This simple, one-touch mechanic creates a high-stakes test of timing and precision, as a single misstep sends the ball tumbling off the path, ending the run.

The path is endlessly and procedurally generated, forming a jagged zigzag route that demands increasing focus and reflexes as the speed subtly ramps up. Along the way, players can collect purple gems that spawn randomly on tiles, adding an optional layer of reward.

Visually, the game is stripped to its core elements: clean geometric shapes, soft pastel hues, and no clutter — just motion and form. The world feels abstract and ambient, keeping full focus on the gameplay. There are no tutorials, no pause, and no distractions — just the ball, the path, and your reactions.

## 🧩 Core Gameplay Mechanics

| **Feature**                      | **Description**                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| **One-Tap Control**              | Tap the screen (or click) to change the ball’s direction by 90°. No other inputs are used. |
| **Falling Off**                  | The ball falls off the edge if you mistime a turn — this ends the game.                    |
| **Zigzag Path**                  | The path is made of square tiles in alternating zigzag directions.                         |
| **Endless Generation**           | The path is procedurally generated and continues indefinitely.                             |
| **Tile Falling**                 | Tiles begin to fall after the ball passes them, adding a sense of urgency and dynamism.    |
| **Camera Follow**                | The camera smoothly follows the ball from a top-down, slightly angled view.                |
| **Score System**                 | Earn 1 point for each tile successfully crossed.                                           |
| **Gem Collection**               | Gems appear on random tiles; collecting them adds 1 point to your score.                   |
| **+1 Floating Text**             | A “+1” text briefly appears and fades out at the gem’s position when collected.            |
| **Speed Scaling**                | The ball’s speed gradually increases, raising difficulty as you progress.                  |
| **High Score**                   | The game saves and displays your best score.                                               |
| **Minimal UI**                   | Clean interface showing score, best score, and audio toggle.                               |
| **No Pause**                     | Once gameplay starts, it cannot be paused.                                                 |
| **Optional Sound**               | Subtle sound effects for turning, collecting gems, and UI interactions.                    |
| **No Tutorials**                 | The game starts instantly with no instructions — easy to learn by playing.                 |
| **Playable on Mobile & Desktop** | Optimized for both touchscreens and mouse clicks — works on all devices.                   |

<!-- ## 📸 Screenshots -->

## 📜 License

<a href="https://www.gnu.org/licenses/agpl-3.0.html"><img src="https://upload.wikimedia.org/wikipedia/commons/0/06/AGPLv3_Logo.svg" height="100px" /></a>

Copyright (c) Michael Kolesidis  
Licensed under the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.html).

# 🚧 To-Do

- Add a dynamic light that follows the ball  
- Make the light change color periodically (e.g., every 50 points)  
- Align camera movement with the ball's world Y position  
- Improve the app icon  

## 💡 Under Consideration

- Introduce unlockable ball skins using collected gems  
- Add an in-game settings menu (audio, graphics, difficulty toggle)
- Add shareable scorecard or screenshot (for sharing to social media)
Include a dev mode to toggle unlimited lives or test gem spawning
- Add haptic feedback for mobile (e.g. light tap when turning or collecting a gem) [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

## ✅ Completed

- Implement point system: +1 per turn, +1 per gem collected  
- Randomly spawn gems on path tiles  
- Level generation system  
- Reuse geometry and material for both tiles and gems  
- Make uncollected gems fall with disappearing tiles  
- Add Inter font  
- Add sound effects  
- Limit excessive divergence in path generation  
- Fix camera movement to appear forward-only  
- Allow UI button interactions without triggering game start  
- Implement full reset functionality  
- Display floating “+1” text when collecting gems  
- Prevent gem collection while falling  
- Store and display best score  
- Track number of games played  
- Style game over screen with score display  
- Style intro screen  
- Add slide-in/out animations for intro and game over screens  
- Create web app manifest and make installable as a PWA  
- Add web worker for offline play  
- Create and add app icon  

## 🚫 Won’t Do

- Migrate styles to Tailwind CSS  
- Add shadows for the ball and gems  
- Replace `SphereGeometry` with `CircleGeometry` for better performance and easier skinning  

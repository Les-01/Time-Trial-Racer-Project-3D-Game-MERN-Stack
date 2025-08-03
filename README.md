# Time Trial Racer 🏎️

A 3D multiplayer time-trial racing game built using modern web technologies, featuring realistic physics, real-time leaderboards, and immersive gameplay — all within the browser.

## Features
- 3D game world rendered using Three.js
- Realistic vehicle physics powered by Cannon.js
- Real-time leaderboard updates via WebSockets
- Secure user authentication system
- Backend API with MongoDB for storing scores and users
- Fully responsive UI built in React

## Technologies
- React, Node.js, Express, MongoDB
- WebSockets (real-time communication)
- Three.js, Cannon.js (3D & physics engines)
- Blender (3D modelling)

## Screenshots
![Game Screenshot](./screenshots/game.png)

## Setup Instructions
1. Clone the repo
2. `cd client` and run `npm install`
3. `cd ../server` and run `npm install`
4. Create a `.env` file for MongoDB URI and WebSocket configs
5. Run `npm run dev` from root to start both client & server

## Status
✅ Complete — Fully playable browser game

## License
MIT

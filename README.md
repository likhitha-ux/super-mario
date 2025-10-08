# Super Mario Bros - Browser Game

A fully functional Super Mario Bros game built with TypeScript, HTML5 Canvas, and modern web technologies. This game runs entirely in the browser and includes classic Mario mechanics like jumping, enemy stomping, coin collection, and platform physics.

## 🎮 Game Features

- **Authentic Mario Movement**: Physics-based player movement with running, jumping, and momentum
- **Enemy AI**: Goombas that patrol platforms and can be defeated by jumping
- **Collectibles**: Coins with animated collection effects
- **Level Design**: Multi-platform levels with varying difficulty
- **Score System**: Points for collecting coins and defeating enemies
- **Lives System**: Traditional 3-lives gameplay with game over screen
- **Sound Effects**: Web Audio API generated retro sound effects
- **Responsive Design**: Scales to different screen sizes

## 🏗️ Project Structure

```
├── src/
│   ├── game/
│   │   ├── entities/
│   │   │   ├── Player.ts          # Player character with physics and controls
│   │   │   ├── Enemy.ts           # Enemy AI and behavior
│   │   │   ├── Coin.ts            # Collectible coins with animations
│   │   │   └── Platform.ts        # Platform/ground collision objects
│   │   ├── Game.ts                # Main game controller and state management
│   │   ├── GameRenderer.ts        # Rendering engine for all game objects
│   │   ├── InputHandler.ts        # Keyboard input management
│   │   ├── SoundManager.ts        # Audio effects using Web Audio API
│   │   └── CollisionDetector.ts   # Physics collision detection system
│   ├── styles/
│   │   └── game.css               # Game UI and canvas styling
│   └── main.ts                    # Application entry point and game loop
├── index.html                     # Main HTML file
├── Dockerfile                     # Container configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🎯 Game Architecture

### Core Components

1. **Game.ts** - Central game controller that:
   - Manages game state (playing, game over)
   - Coordinates all game entities
   - Handles collision detection
   - Updates score, lives, and level progression

2. **Player.ts** - Mario character implementation:
   - Physics-based movement with gravity and friction
   - Jump mechanics with proper air control
   - Platform collision detection
   - Animation state management

3. **Enemy.ts** - Goomba enemy behavior:
   - Autonomous movement with direction changes
   - Platform-aware AI that doesn't fall off edges
   - Collision detection with player and platforms

4. **GameRenderer.ts** - Rendering system:
   - Pixel-perfect sprite drawing
   - Background and environment rendering
   - Animation frame management
   - Responsive canvas scaling

5. **InputHandler.ts** - Input management:
   - Real-time keyboard state tracking
   - Smooth movement input processing
   - Focus and blur event handling

### Game Mechanics

- **Movement**: Arrow keys for left/right movement with momentum
- **Jumping**: Spacebar for jumping with variable height based on hold duration
- **Combat**: Jump on enemies to defeat them and gain points
- **Collection**: Touch coins to collect them for score
- **Lives**: Start with 3 lives, lose one when hit by enemy or falling
- **Progression**: Clear all coins and enemies to advance to next level

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Local Development

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd super-mario-game
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser and navigate to the local development URL**

### Building for Production

```bash
npm run build
npm run preview
```

## 🐳 Docker Containerization

This application can be containerized using Docker for easy deployment and distribution.

### Building the Docker Image

1. **Build the image:**
```bash
docker build -t super-mario-game .
```

2. **Run the container:**
```bash
docker run -p 8080:8080 super-mario-game
```

3. **Access the game:**
Open your browser and navigate to `http://localhost:8080`

### Docker Image Details

The Dockerfile:
- Uses Node.js 18 Alpine for a lightweight base image
- Installs dependencies and builds the application
- Serves the built files using http-server
- Exposes port 8080 for web access
- Includes proper .dockerignore for optimized builds

### Production Deployment

For production deployment, you can push the Docker image to a container registry:

```bash
# Tag for registry
docker tag super-mario-game your-registry/super-mario-game:latest

# Push to registry
docker push your-registry/super-mario-game:latest

# Deploy to your container platform
docker run -d -p 80:8080 your-registry/super-mario-game:latest
```

## 🎮 Game Controls

- **Arrow Left/Right**: Move Mario left or right
- **Spacebar**: Jump (hold for higher jumps)
- **R**: Restart game (when game over)

## 🔧 Technical Implementation

### Performance Optimizations
- Efficient collision detection using AABB (Axis-Aligned Bounding Box)
- Optimized rendering with minimal canvas operations
- Frame-rate independent game logic using delta time
- Memory-efficient entity management

### Browser Compatibility
- Modern ES6+ features with TypeScript compilation
- Web Audio API for sound (gracefully degrades if unsupported)
- Canvas 2D API for graphics (widely supported)
- Responsive design for various screen sizes

### Code Quality
- TypeScript for type safety and better development experience
- Modular architecture with clear separation of concerns
- ESLint configuration for code quality
- Comprehensive file organization following best practices

## 🎨 Customization

The game is designed to be easily customizable:

- **Add new enemies**: Extend the Enemy class with new types
- **Create new levels**: Modify the level initialization in Game.ts
- **Change graphics**: Update the rendering methods in GameRenderer.ts
- **Add power-ups**: Create new collectible entities
- **Modify physics**: Adjust constants in Player.ts and Enemy.ts

## 📝 License

This project is created for educational and demonstration purposes. Super Mario Bros is a trademark of Nintendo.
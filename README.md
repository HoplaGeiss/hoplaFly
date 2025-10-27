# hoplaFly - Angular Phaser Game

A fun flying game built with Angular and Phaser.js where you control a bat and collect coins while avoiding spikes!

## 🎮 Game Features

- Tap to fly mechanics
- Collect coins for points
- Avoid spikes to stay alive
- Smooth animations and physics
- Responsive design

## 🚀 Deployment to Netlify

### Prerequisites

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

### Deploy Options

#### Git-based Deployment (Recommended)
1. Push your code to your connected Git repository:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
2. Netlify automatically builds and deploys on every push

#### Manual Deploy (Optional)
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist/hoplaFly
```

### Configuration

The project includes a `netlify.toml` file with the following configuration:
- **Build command**: `npm run build`
- **Publish directory**: `dist/hoplaFly`
- **Node version**: 18
- **Redirects**: All routes redirect to `index.html` for SPA support

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── app/
│   ├── game/
│   │   ├── config/
│   │   │   ├── animation.config.ts
│   │   │   └── assets.config.ts
│   │   ├── scenes/
│   │   │   ├── boot.scene.ts
│   │   │   ├── game-over.scene.ts
│   │   │   ├── game.scene.ts
│   │   │   └── preloader.scene.ts
│   │   └── game.service.ts
│   └── app.component.ts
├── assets/
│   ├── background.png
│   ├── bat.png
│   ├── coin.png
│   └── spikes.png
└── index.html
```

## 🎯 Game Controls

- **Tap/Click**: Make the bat fly upward
- **Objective**: Collect coins and avoid spikes
- **Score**: Each coin collected increases your score

## 🎨 Assets

The game uses the following assets:
- Background image for scrolling effect
- Bat sprite with animation frames
- Coin sprite with animation frames
- Spikes for obstacles

Enjoy playing hoplaFly! 🦇✨

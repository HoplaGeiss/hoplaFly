# Tower Defense Game Documentation

## Overview

The Tower Defense (TD) game is a strategic defense game built with Phaser 3 and TypeScript. Players must place towers along a predefined path to prevent enemies from reaching the end, earning gold for defeated enemies and hoplaTokens for successful completion.

## Game Features

- **Strategic Tower Placement**: Place towers on a grid system to defend against waves of enemies
- **Wave-based Gameplay**: Defend against waves of 10 enemies each
- **Resource Management**: Manage gold for tower placement and lives for defense
- **Visual Feedback**: Real-time grid preview, range indicators, and health bars
- **Progressive Difficulty**: Enemies spawn faster and have increased health for challenging gameplay
- **Integration**: Connected to hoplaTokens reward system

## Game Rules

- **Objective**: Prevent enemies from reaching the end of the path
- **Lives**: Start with 5 lives, lose 1 life for each enemy that reaches the end
- **Gold**: Start with 50 gold, earn 5 gold per defeated enemy
- **Tower Cost**: Each tower costs 10 gold
- **Waves**: Each wave contains 10 enemies
- **Victory**: Complete all waves to win and earn 1 hoplaToken
- **Defeat**: Lose all lives to trigger game over

## Quick Start

1. Launch the game from the main menu
2. Click on grid cells to place towers (blue squares)
3. Click "Start Wave" to begin enemy spawning
4. Defend against all enemies in the wave
5. Repeat until all waves are completed or you lose all lives

## Controls

- **Mouse Click**: Place towers on grid cells
- **Mouse Hover**: Preview tower placement (green = valid, red = invalid)
- **ESC Key**: Quit to main menu
- **Start Wave Button**: Begin enemy spawning

## Architecture

The game follows a modular architecture with clear separation of concerns:

- **Scenes**: Handle game states and UI
- **Entities**: Core game objects (Tower, Enemy)
- **Systems**: Game logic managers (TowerManager, EnemyManager, etc.)
- **Config**: Centralized game configuration
- **Services**: External integrations (UserService for hoplaTokens)

## File Structure

```
src/app/game/tower-defense/
├── config/
│   ├── td-assets.config.ts    # Asset definitions
│   └── td-config.ts          # Game constants and configuration
├── entities/
│   ├── enemy.ts              # Enemy entity class
│   └── tower.ts              # Tower entity class
├── scenes/
│   ├── td-game-over.scene.ts # Game over screen
│   ├── td-game.scene.ts      # Main game scene
│   ├── td-preloader.scene.ts # Asset loading scene
│   ├── td-ui.scene.ts        # User interface overlay
│   └── td-win.scene.ts       # Victory screen
└── systems/
    ├── enemy-manager.ts      # Enemy spawning and management
    ├── grid-system.ts        # Grid-based tower placement
    ├── path-renderer.ts      # Path visualization and collision
    ├── tower-manager.ts      # Tower placement and management
    └── wave-controller.ts    # Wave progression logic
```

## Next Steps

- [Architecture Overview](./architecture.md) - Detailed system interactions
- [Entity Reference](./entities.md) - Tower and Enemy documentation
- [System Reference](./systems.md) - Game system documentation
- [Scene Reference](./scenes.md) - Scene documentation
- [Configuration](./configuration.md) - Game configuration details
- [API Reference](./api-reference.md) - Complete API documentation

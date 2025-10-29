# Tower Defense Game Architecture

## System Overview

The Tower Defense game follows a modular, component-based architecture built on Phaser 3. The game is organized into distinct layers that handle different aspects of gameplay.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Game Scenes                          │
├─────────────────────────────────────────────────────────────┤
│  TDGame (Main)  │  TDUI  │  TDPreloader  │  TDWin/GameOver  │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Game Systems                           │
├─────────────────────────────────────────────────────────────┤
│ TowerManager │ EnemyManager │ WaveController │ GridSystem   │
│ PathRenderer │              │                │              │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Game Entities                          │
├─────────────────────────────────────────────────────────────┤
│                    Tower  │  Enemy                         │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Configuration                            │
├─────────────────────────────────────────────────────────────┤
│              TD_CONFIG  │  TD_ASSETS                       │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│                    UserService (hoplaTokens)               │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Scene Layer
The scene layer manages game states and user interface:

- **TDGame**: Main game logic and system coordination
- **TDUI**: User interface overlay (HUD, buttons, displays)
- **TDPreloader**: Asset loading and initialization
- **TDWin/TDGameOver**: End game states

### 2. System Layer
Game systems handle specific gameplay mechanics:

- **TowerManager**: Tower placement, management, and combat
- **EnemyManager**: Enemy spawning, movement, and lifecycle
- **WaveController**: Wave progression and timing
- **GridSystem**: Grid-based placement and visual feedback
- **PathRenderer**: Path visualization and collision detection

### 3. Entity Layer
Core game objects with their behaviors:

- **Tower**: Defensive structures with targeting and shooting
- **Enemy**: Hostile units that follow the path

### 4. Configuration Layer
Centralized game settings and asset definitions:

- **TD_CONFIG**: Game constants, balancing, and parameters
- **TD_ASSETS**: Asset definitions and loading configuration

## System Interactions

### Game Loop Flow

1. **Initialization** (TDPreloader → TDGame)
   - Load assets
   - Initialize all systems
   - Set up event listeners

2. **Gameplay Loop** (TDGame.update())
   - Update wave controller
   - Update enemy manager
   - Update tower manager
   - Update grid preview

3. **User Input** (TDGame)
   - Handle tower placement
   - Handle wave starting
   - Handle menu navigation

4. **System Communication** (Event-driven)
   - Systems communicate via Phaser events
   - UI updates based on game state changes
   - External service integration for rewards

### Event System

The game uses Phaser's event system for loose coupling between components:

```typescript
// Game events
'start-wave'          // Start enemy spawning
'wave-start'          // Wave has begun
'wave-complete'       // Wave has finished
'game-over'           // Player has lost
'lives-update'        // Lives count changed
'gold-update'         // Gold count changed
'balance-update'      // hoplaTokens balance changed
'reset-game'          // Reset all game state
```

### Data Flow

1. **User Input** → **TDGame** → **System Processing**
2. **System State Changes** → **Event Emission** → **UI Updates**
3. **Game State Changes** → **Scene Transitions** → **External Service Calls**

## Design Patterns

### 1. Component Pattern
Each system is a self-contained component with specific responsibilities:
- Clear interfaces
- Minimal dependencies
- Reusable logic

### 2. Observer Pattern
Event-driven communication between systems:
- Loose coupling
- Easy to extend
- Reactive updates

### 3. Manager Pattern
Centralized management of related objects:
- TowerManager for all towers
- EnemyManager for all enemies
- WaveController for wave logic

### 4. Configuration Pattern
Centralized configuration for easy balancing:
- Single source of truth
- Easy to modify game parameters
- Clear separation of data and logic

## Performance Considerations

### Rendering Optimization
- Graphics objects are reused where possible
- Depth sorting for proper layering
- Efficient collision detection

### Memory Management
- Proper cleanup of destroyed objects
- Event listener cleanup
- Asset management through Phaser

### Update Efficiency
- Systems only update when necessary
- Event-driven updates reduce polling
- Efficient enemy pathfinding

## Extensibility

### Adding New Tower Types
1. Extend Tower class or create new tower classes
2. Update TowerManager to handle new types
3. Add configuration for new tower properties
4. Update UI to display new tower options

### Adding New Enemy Types
1. Extend Enemy class or create new enemy classes
2. Update EnemyManager to spawn new types
3. Add configuration for new enemy properties
4. Update pathfinding if needed

### Adding New Game Modes
1. Create new scene classes
2. Extend or modify existing systems
3. Add new configuration options
4. Update UI for new mode selection

## Integration Points

### UserService Integration
- hoplaTokens balance display
- Reward distribution on victory
- User data persistence

### Phaser Integration
- Scene management
- Input handling
- Graphics rendering
- Asset loading
- Event system

### External API Integration
- User data synchronization
- Score tracking
- Achievement system

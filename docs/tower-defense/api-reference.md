# Tower Defense Game API Reference

## Overview

This document provides a complete API reference for all classes, methods, and properties in the Tower Defense game.

## Table of Contents

- [Entities](#entities)
  - [Tower](#tower)
  - [Enemy](#enemy)
- [Systems](#systems)
  - [TowerManager](#towermanager)
  - [EnemyManager](#enemymanager)
  - [WaveController](#wavecontroller)
  - [GridSystem](#gridsystem)
  - [PathRenderer](#pathrenderer)
- [Scenes](#scenes)
  - [TDGame](#tdgame)
  - [TDUI](#tdui)
  - [TDPreloader](#tdpreloader)
  - [TDGameOver](#tdgameover)
  - [TDWin](#tdwin)
- [Configuration](#configuration)
  - [TD_CONFIG](#td_config)
  - [TD_ASSETS](#td_assets)

## Entities

### Tower

Defensive structure that automatically targets and attacks enemies.

#### Constructor
```typescript
constructor(scene: Phaser.Scene, x: number, y: number)
```
Creates a new tower at the specified position.

**Parameters:**
- `scene`: Phaser scene reference
- `x`: X coordinate position
- `y`: Y coordinate position

#### Properties
```typescript
scene: Phaser.Scene
x: number
y: number
sprite: Phaser.GameObjects.Graphics
rangeCircle: Phaser.GameObjects.Graphics
lastFireTime: number
target: any
```

#### Methods

##### `createSprite(): void`
Creates the visual representation of the tower.

##### `createRangeIndicator(): void`
Creates the range indicator circle.

##### `showRange(): void`
Makes the range indicator visible.

##### `hideRange(): void`
Hides the range indicator.

##### `canFire(): boolean`
Checks if enough time has passed since the last shot.

**Returns:** `boolean` - True if tower can fire

##### `findTarget(enemies: any[]): any`
Finds the closest enemy within range.

**Parameters:**
- `enemies`: Array of enemy objects

**Returns:** `any` - Closest enemy or null

##### `fire(target: any): void`
Fires a projectile at the specified target.

**Parameters:**
- `target`: Enemy to fire at

##### `update(enemies: any[]): void`
Main update loop - handles targeting and firing.

**Parameters:**
- `enemies`: Array of enemy objects

##### `destroy(): void`
Cleans up the tower and its visual elements.

### Enemy

Hostile unit that follows a predefined path.

#### Constructor
```typescript
constructor(scene: Phaser.Scene, x: number, y: number)
```
Creates a new enemy at the specified position.

**Parameters:**
- `scene`: Phaser scene reference
- `x`: X coordinate position
- `y`: Y coordinate position

#### Properties
```typescript
scene: Phaser.Scene
x: number
y: number
sprite: Phaser.GameObjects.Graphics
healthBar: Phaser.GameObjects.Graphics
maxHealth: number
currentHealth: number
speed: number
pathIndex: number
active: boolean
reward: number
```

#### Methods

##### `createSprite(): void`
Creates the visual representation of the enemy.

##### `createHealthBar(): void`
Creates the health bar visualization.

##### `updateHealthBar(): void`
Updates the health bar to reflect current health.

##### `takeDamage(damage: number): void`
Reduces health by the specified amount.

**Parameters:**
- `damage`: Amount of damage to take

##### `die(): void`
Marks the enemy as inactive and cleans up visuals.

##### `moveAlongPath(path: any[]): void`
Moves the enemy along the specified path.

**Parameters:**
- `path`: Array of path points

##### `reachEnd(): void`
Handles enemy reaching the end of the path.

##### `update(path: any[]): void`
Main update loop - handles movement and path following.

**Parameters:**
- `path`: Array of path points

## Systems

### TowerManager

Manages all tower-related functionality.

#### Constructor
```typescript
constructor(scene: Phaser.Scene)
```
Creates a new tower manager.

**Parameters:**
- `scene`: Phaser scene reference

#### Properties
```typescript
private towers: Tower[]
private gold: number
```

#### Methods

##### `create(): void`
Initializes the tower manager with starting gold.

##### `canPlaceTower(x: number, y: number, pathRenderer: any): boolean`
Validates tower placement at the specified coordinates.

**Parameters:**
- `x`: X coordinate
- `y`: Y coordinate
- `pathRenderer`: Path renderer for collision detection

**Returns:** `boolean` - True if placement is valid

##### `placeTower(x: number, y: number, pathRenderer: any): boolean`
Places a new tower at the specified coordinates.

**Parameters:**
- `x`: X coordinate
- `y`: Y coordinate
- `pathRenderer`: Path renderer for collision detection

**Returns:** `boolean` - True if tower was placed successfully

##### `update(enemies: any[]): void`
Updates all active towers.

**Parameters:**
- `enemies`: Array of enemy objects

##### `getTowers(): Tower[]`
Returns array of all active towers.

**Returns:** `Tower[]` - Array of tower objects

##### `getGold(): number`
Returns current gold amount.

**Returns:** `number` - Current gold

##### `addGold(amount: number): void`
Adds gold and emits update event.

**Parameters:**
- `amount`: Amount of gold to add

##### `reset(): void`
Clears all towers and resets gold to starting amount.

### EnemyManager

Handles all enemy-related functionality.

#### Constructor
```typescript
constructor(scene: Phaser.Scene)
```
Creates a new enemy manager.

**Parameters:**
- `scene`: Phaser scene reference

#### Properties
```typescript
private enemies: Enemy[]
private lives: number
private path: any[]
```

#### Methods

##### `create(): void`
Initializes the enemy manager with starting lives.

##### `spawnEnemy(): void`
Creates a new enemy at the path start.

##### `update(): void`
Updates all active enemies and handles path completion.

##### `getEnemies(): Enemy[]`
Returns array of all enemies.

**Returns:** `Enemy[]` - Array of enemy objects

##### `getActiveEnemies(): Enemy[]`
Returns array of only active enemies.

**Returns:** `Enemy[]` - Array of active enemy objects

##### `getLives(): number`
Returns current life count.

**Returns:** `number` - Current lives

##### `reset(): void`
Clears all enemies and resets lives.

### WaveController

Manages wave progression and enemy spawning.

#### Constructor
```typescript
constructor(scene: Phaser.Scene)
```
Creates a new wave controller.

**Parameters:**
- `scene`: Phaser scene reference

#### Properties
```typescript
private waveActive: boolean
private enemiesSpawned: number
private enemiesToSpawn: number
private lastSpawnTime: number
private spawnDelay: number
```

#### Methods

##### `create(): void`
Initializes the wave controller in idle state.

##### `startWave(): void`
Begins a new wave of enemies.

##### `update(enemyManager: any): void`
Main update loop for wave management.

**Parameters:**
- `enemyManager`: Enemy manager instance

##### `isWaveActive(): boolean`
Returns whether a wave is currently active.

**Returns:** `boolean` - True if wave is active

##### `reset(): void`
Resets wave controller to idle state.

### GridSystem

Handles grid-based tower placement and visual feedback.

#### Constructor
```typescript
constructor(scene: Phaser.Scene)
```
Creates a new grid system.

**Parameters:**
- `scene`: Phaser scene reference

#### Properties
```typescript
private gridGraphics: Phaser.GameObjects.Graphics
private hoveredCell: { x: number; y: number } | null
```

#### Methods

##### `create(): void`
Initializes the grid system graphics.

##### `getGridCell(x: number, y: number): { x: number; y: number } | null`
Converts screen coordinates to grid cell coordinates.

**Parameters:**
- `x`: Screen X coordinate
- `y`: Screen Y coordinate

**Returns:** `{ x: number; y: number } | null` - Grid cell coordinates or null

##### `setHoveredCell(cell: { x: number; y: number } | null): void`
Sets the currently hovered cell for preview.

**Parameters:**
- `cell`: Grid cell coordinates or null

##### `updateGridPreview(canPlace: boolean): void`
Updates the visual preview based on placement validity.

**Parameters:**
- `canPlace`: Whether tower can be placed

##### `clearPreview(): void`
Clears the grid preview and resets hover state.

### PathRenderer

Renders the enemy path and provides collision detection.

#### Constructor
```typescript
constructor(scene: Phaser.Scene)
```
Creates a new path renderer.

**Parameters:**
- `scene`: Phaser scene reference

#### Properties
```typescript
private pathGraphics: Phaser.GameObjects.Graphics
private path: any[]
```

#### Methods

##### `create(): void`
Renders the path using graphics objects.

##### `isOnPath(x: number, y: number): boolean`
Checks if coordinates intersect with the path.

**Parameters:**
- `x`: X coordinate
- `y`: Y coordinate

**Returns:** `boolean` - True if on path

##### `getPath(): any[]`
Returns the path point array.

**Returns:** `any[]` - Array of path points

##### `distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number`
Calculates distance from point to line segment.

**Parameters:**
- `px`: Point X coordinate
- `py`: Point Y coordinate
- `x1`: Line start X coordinate
- `y1`: Line start Y coordinate
- `x2`: Line end X coordinate
- `y2`: Line end Y coordinate

**Returns:** `number` - Distance to line segment

## Scenes

### TDGame

Main game scene that coordinates all systems.

#### Constructor
```typescript
constructor()
```
Creates a new TDGame scene.

#### Properties
```typescript
private userService: UserService
private pathRenderer: PathRenderer
private gridSystem: GridSystem
private towerManager: TowerManager
private enemyManager: EnemyManager
private waveController: WaveController
```

#### Methods

##### `create(): void`
Initializes the main game scene.

##### `setupInput(): void`
Configures input handling for the game.

##### `setupEventListeners(): void`
Sets up event communication between systems.

##### `handleGridClick(x: number, y: number): void`
Handles tower placement on grid clicks.

**Parameters:**
- `x`: Click X coordinate
- `y`: Click Y coordinate

##### `handleGridHover(x: number, y: number): void`
Handles grid hover preview.

**Parameters:**
- `x`: Hover X coordinate
- `y`: Hover Y coordinate

##### `updateGridPreview(): void`
Updates the grid preview based on current hover state.

##### `quitToMenu(): void`
Returns to the main menu.

##### `update(): void`
Main game loop - updates all systems.

### TDUI

User interface overlay scene.

#### Constructor
```typescript
constructor()
```
Creates a new TDUI scene.

#### Properties
```typescript
private userService: UserService
private livesText: Phaser.GameObjects.Text
private goldText: Phaser.GameObjects.Text
private balanceText: Phaser.GameObjects.Text
private startWaveButton: Phaser.GameObjects.Text
private quitButton: Phaser.GameObjects.Text
private lives: number
private gold: number
```

#### Methods

##### `create(): void`
Initializes the UI scene.

##### `createUI(): void`
Creates all UI elements.

##### `setupEventListeners(): void`
Sets up event communication with game systems.

##### `updateLives(lives: number): void`
Updates the lives display.

**Parameters:**
- `lives`: Current life count

##### `updateGold(gold: number): void`
Updates the gold display.

**Parameters:**
- `gold`: Current gold amount

##### `updateBalance(): void`
Updates the hoplaTokens balance display.

##### `hideStartWaveButton(): void`
Hides the start wave button during active waves.

##### `showStartWaveButton(): void`
Shows the start wave button when wave is complete.

##### `handleResize(gameSize: Phaser.Structs.Size): void`
Handles window resize events.

**Parameters:**
- `gameSize`: New game size

##### `update(): void`
Main update loop for UI.

### TDPreloader

Asset loading scene.

#### Constructor
```typescript
constructor()
```
Creates a new TDPreloader scene.

#### Methods

##### `init(): void`
Creates the progress bar visualization.

##### `preload(): void`
Loads all required assets.

##### `create(): void`
Transitions to the main game scene.

### TDGameOver

Game over screen scene.

#### Constructor
```typescript
constructor()
```
Creates a new TDGameOver scene.

#### Methods

##### `create(): void`
Creates the game over screen.

### TDWin

Victory screen scene.

#### Constructor
```typescript
constructor()
```
Creates a new TDWin scene.

#### Methods

##### `create(): void`
Creates the victory screen.

## Configuration

### TD_CONFIG

Main game configuration object.

#### Structure
```typescript
export const TD_CONFIG = {
  TOWER: {
    COST: number
    DAMAGE: number
    RANGE: number
    FIRE_RATE: number
    SIZE: number
    COLOR: number
  },
  ENEMY: {
    HEALTH: number
    SPEED: number
    SIZE: number
    REWARD: number
  },
  GAME: {
    STARTING_LIVES: number
    WAVE_SIZE: number
    STARTING_GOLD: number
  },
  PATH: {
    POINTS: Array<{x: number, y: number}>
    WIDTH: number
  },
  GRID: {
    CELL_SIZE: number
  }
}
```

### TD_ASSETS

Asset configuration object.

#### Structure
```typescript
export const TD_ASSETS = {
  image: {
    [key: string]: {
      key: string
      path: string
    }
  },
  graphics: {
    [key: string]: {
      key: string
      type: string
      color: number
      size: number
      width?: number
      height?: number
    }
  }
}
```

## Events

### Game Events

The game uses Phaser's event system for communication:

- `start-wave`: Start enemy spawning
- `wave-start`: Wave has begun
- `wave-complete`: Wave has finished
- `game-over`: Player has lost
- `lives-update`: Lives count changed
- `gold-update`: Gold count changed
- `balance-update`: hoplaTokens balance changed
- `reset-game`: Reset all game state

### Event Usage

```typescript
// Emit event
this.scene.events.emit('gold-update', this.gold);

// Listen for event
this.events.on('gold-update', (gold: number) => {
  this.updateGold(gold);
});
```

## Type Definitions

### Common Types

```typescript
type GridCell = { x: number; y: number };
type PathPoint = { x: number; y: number };
type Enemy = any; // Enemy entity
type Tower = any; // Tower entity
```

### Phaser Types

The game uses standard Phaser types:
- `Phaser.Scene`
- `Phaser.GameObjects.Graphics`
- `Phaser.GameObjects.Text`
- `Phaser.Input.Pointer`
- `Phaser.Structs.Size`

## Error Handling

### Common Errors

1. **Configuration Errors**: Invalid config values
2. **Asset Loading Errors**: Missing or invalid assets
3. **System Errors**: System initialization failures
4. **Event Errors**: Missing event listeners

### Debug Tips

1. Check console for error messages
2. Verify configuration values
3. Ensure assets are loaded
4. Check event listener setup
5. Validate system initialization order

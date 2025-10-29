# Tower Defense Game Entities

## Overview

The Tower Defense game features two main entity types: **Towers** and **Enemies**. These entities represent the core interactive objects in the game and handle their own rendering, behavior, and state management.

## Tower Entity

### Purpose
Towers are defensive structures that automatically target and attack enemies within their range. They are the primary means of defense in the game.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `scene` | `Phaser.Scene` | Reference to the Phaser scene |
| `x` | `number` | X coordinate position |
| `y` | `number` | Y coordinate position |
| `sprite` | `Phaser.GameObjects.Graphics` | Visual representation |
| `rangeCircle` | `Phaser.GameObjects.Graphics` | Range indicator visualization |
| `lastFireTime` | `number` | Timestamp of last shot fired |
| `target` | `any` | Currently targeted enemy |

### Configuration
Tower properties are defined in `TD_CONFIG.TOWER`:

```typescript
TOWER: {
  COST: 10,           // Gold cost to place
  DAMAGE: 2,          // Damage per shot
  RANGE: 150,         // Targeting range in pixels
  FIRE_RATE: 500,     // Milliseconds between shots
  SIZE: 32,           // Visual size in pixels
  COLOR: 0x0066ff     // Blue color
}
```

### Behavior

#### Construction
- Created at specified grid coordinates
- Automatically creates visual sprite and range indicator
- Range indicator is initially hidden

#### Targeting
- Continuously scans for enemies within range
- Targets the closest enemy to the tower
- Updates target when closer enemies appear

#### Combat
- Fires projectiles at targeted enemies
- Respects fire rate cooldown
- Projectiles are animated and deal damage on impact
- Visual feedback with yellow projectiles

#### Visual Features
- **Sprite**: Blue square representing the tower
- **Range Circle**: Green circle showing attack range (toggleable)
- **Projectiles**: Yellow circles that move toward targets

### Methods

#### `constructor(scene: Phaser.Scene, x: number, y: number)`
Creates a new tower at the specified position.

#### `createSprite(): void`
Creates the visual representation of the tower.

#### `createRangeIndicator(): void`
Creates the range indicator circle.

#### `showRange(): void`
Makes the range indicator visible.

#### `hideRange(): void`
Hides the range indicator.

#### `canFire(): boolean`
Checks if enough time has passed since the last shot.

#### `findTarget(enemies: any[]): any`
Finds the closest enemy within range.

#### `fire(target: any): void`
Fires a projectile at the specified target.

#### `update(enemies: any[]): void`
Main update loop - handles targeting and firing.

#### `destroy(): void`
Cleans up the tower and its visual elements.

## Enemy Entity

### Purpose
Enemies are hostile units that follow a predefined path from start to finish. They are the primary threat that towers must defend against.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `scene` | `Phaser.Scene` | Reference to the Phaser scene |
| `x` | `number` | Current X coordinate |
| `y` | `number` | Current Y coordinate |
| `sprite` | `Phaser.GameObjects.Graphics` | Visual representation |
| `healthBar` | `Phaser.GameObjects.Graphics` | Health bar visualization |
| `maxHealth` | `number` | Maximum health points |
| `currentHealth` | `number` | Current health points |
| `speed` | `number` | Movement speed in pixels per second |
| `pathIndex` | `number` | Current position on the path |
| `active` | `boolean` | Whether the enemy is alive and active |
| `reward` | `number` | Gold reward when defeated |

### Configuration
Enemy properties are defined in `TD_CONFIG.ENEMY`:

```typescript
ENEMY: {
  HEALTH: 6,          // Health points
  SPEED: 80,          // Movement speed
  SIZE: 24,           // Visual size in pixels
  REWARD: 5           // Gold reward on defeat
}
```

### Behavior

#### Spawning
- Created at the first path point
- Initialized with full health and default properties
- Added to the enemy manager's tracking list

#### Movement
- Follows the predefined path point by point
- Moves at constant speed toward the next path point
- Automatically advances to the next path segment when close enough

#### Combat
- Takes damage from tower projectiles
- Health bar updates in real-time
- Dies when health reaches zero
- Awards gold to the player when defeated

#### Path Completion
- Reaches the end when path index exceeds path length
- Triggers life loss for the player
- Automatically destroyed

### Visual Features
- **Sprite**: Red circle representing the enemy
- **Health Bar**: Red background with green health indicator
- **Smooth Movement**: Interpolated movement between path points

### Methods

#### `constructor(scene: Phaser.Scene, x: number, y: number)`
Creates a new enemy at the specified position.

#### `createSprite(): void`
Creates the visual representation of the enemy.

#### `createHealthBar(): void`
Creates the health bar visualization.

#### `updateHealthBar(): void`
Updates the health bar to reflect current health.

#### `takeDamage(damage: number): void`
Reduces health by the specified amount and updates display.

#### `die(): void`
Marks the enemy as inactive and cleans up visuals.

#### `moveAlongPath(path: any[]): void`
Moves the enemy along the specified path.

#### `reachEnd(): void`
Handles enemy reaching the end of the path.

#### `update(path: any[]): void`
Main update loop - handles movement and path following.

## Entity Lifecycle

### Tower Lifecycle
1. **Creation**: Placed by player on valid grid cell
2. **Active**: Continuously targets and attacks enemies
3. **Destruction**: Removed when game resets or scene changes

### Enemy Lifecycle
1. **Spawning**: Created at path start by wave controller
2. **Movement**: Follows path toward destination
3. **Combat**: Takes damage from towers
4. **Death**: Destroyed when health reaches zero OR reaches path end
5. **Reward**: Awards gold to player on death (not on path completion)

## Visual Rendering

### Depth Layers
- **Background**: Path and grid (depth 1-2)
- **Towers**: Tower sprites and range indicators (depth 5-10)
- **Enemies**: Enemy sprites and health bars (depth 12-13)
- **Projectiles**: Tower projectiles (depth 15)
- **UI**: User interface elements (depth 20+)

### Graphics Objects
- All entities use `Phaser.GameObjects.Graphics` for rendering
- Efficient memory usage with reusable graphics objects
- Proper cleanup to prevent memory leaks

## Performance Considerations

### Update Optimization
- Entities only update when necessary
- Efficient collision detection using Phaser's built-in methods
- Minimal object creation during gameplay

### Memory Management
- Proper cleanup of destroyed entities
- Graphics objects are properly disposed
- Event listeners are cleaned up

### Rendering Efficiency
- Depth sorting for proper layering
- Efficient graphics operations
- Minimal redraws when possible

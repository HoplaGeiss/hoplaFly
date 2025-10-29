# Tower Defense Game Systems

## Overview

The Tower Defense game uses a modular system architecture where each system handles a specific aspect of gameplay. These systems work together to create the complete game experience.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Game Scene                          │
│                        (TDGame)                             │
└─────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
┌───────────────▼───┐ ┌─────────▼─────────┐ ┌───▼───────────────┐
│   TowerManager    │ │   EnemyManager    │ │  WaveController   │
│                   │ │                   │ │                   │
│ • Tower placement │ │ • Enemy spawning  │ │ • Wave timing     │
│ • Tower updates   │ │ • Enemy movement  │ │ • Wave completion │
│ • Gold management │ │ • Life management │ │ • Spawn control   │
└───────────────────┘ └───────────────────┘ └───────────────────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
┌───────────────▼───┐ ┌─────────▼─────────┐ ┌───▼───────────────┐
│   GridSystem      │ │   PathRenderer    │ │   External        │
│                   │ │                   │ │   Services        │
│ • Grid placement  │ │ • Path rendering  │ │                   │
│ • Hover preview   │ │ • Collision check │ │ • UserService     │
│ • Cell validation │ │ • Path queries    │ │ • hoplaTokens     │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

## TowerManager System

### Purpose
Manages all tower-related functionality including placement, updates, and resource management.

### Responsibilities
- Tower placement validation
- Gold resource management
- Tower updates and combat
- Tower collection management

### Key Methods

#### `create(): void`
Initializes the tower manager with starting gold.

#### `canPlaceTower(x: number, y: number, pathRenderer: any): boolean`
Validates tower placement at the specified coordinates:
- Checks if position is on the path
- Verifies no existing tower at the location
- Ensures sufficient gold for placement

#### `placeTower(x: number, y: number, pathRenderer: any): boolean`
Places a new tower at the specified coordinates:
- Validates placement
- Creates new Tower entity
- Deducts gold cost
- Emits gold update event

#### `update(enemies: any[]): void`
Updates all active towers:
- Passes enemy list to each tower
- Towers handle their own targeting and combat

#### `getTowers(): Tower[]`
Returns array of all active towers.

#### `getGold(): number`
Returns current gold amount.

#### `addGold(amount: number): void`
Adds gold and emits update event.

#### `reset(): void`
Clears all towers and resets gold to starting amount.

### Events Emitted
- `gold-update`: When gold amount changes

## EnemyManager System

### Purpose
Handles all enemy-related functionality including spawning, movement, and lifecycle management.

### Responsibilities
- Enemy spawning and tracking
- Life management
- Enemy updates and path following
- Collision detection with path end

### Key Methods

#### `create(): void`
Initializes the enemy manager with starting lives.

#### `spawnEnemy(): void`
Creates a new enemy at the path start:
- Instantiates new Enemy entity
- Adds to tracking array
- Positioned at first path point

#### `update(): void`
Updates all active enemies:
- Calls update on each enemy
- Removes inactive enemies
- Checks for path completion
- Manages life loss

#### `getEnemies(): Enemy[]`
Returns array of all enemies (active and inactive).

#### `getActiveEnemies(): Enemy[]`
Returns array of only active enemies.

#### `getLives(): number`
Returns current life count.

#### `reset(): void`
Clears all enemies and resets lives.

### Events Emitted
- `lives-update`: When life count changes
- `game-over`: When lives reach zero

## WaveController System

### Purpose
Manages wave progression, enemy spawning timing, and wave completion detection.

### Responsibilities
- Wave timing and control
- Enemy spawn scheduling
- Wave completion detection
- Wave state management

### Key Methods

#### `create(): void`
Initializes the wave controller in idle state.

#### `startWave(): void`
Begins a new wave:
- Sets wave as active
- Configures enemy count
- Resets spawn tracking
- Emits wave start event

#### `update(enemyManager: any): void`
Main update loop:
- Spawns enemies based on timing
- Checks for wave completion
- Manages wave state transitions

#### `isWaveActive(): boolean`
Returns whether a wave is currently active.

#### `reset(): void`
Resets wave controller to idle state.

### Events Emitted
- `wave-start`: When a wave begins
- `wave-complete`: When a wave ends

### Configuration
- **Wave Size**: 10 enemies per wave
- **Spawn Delay**: 300ms between enemy spawns
- **Wave Completion**: When all enemies spawned and none active

## GridSystem System

### Purpose
Handles grid-based tower placement, visual feedback, and cell validation.

### Responsibilities
- Grid cell calculation
- Hover preview rendering
- Placement validation feedback
- Grid visualization

### Key Methods

#### `create(): void`
Initializes the grid system graphics.

#### `getGridCell(x: number, y: number): {x: number, y: number} | null`
Converts screen coordinates to grid cell coordinates:
- Snaps to grid cell centers
- Returns null for invalid coordinates

#### `setHoveredCell(cell: {x: number, y: number} | null): void`
Sets the currently hovered cell for preview.

#### `updateGridPreview(canPlace: boolean): void`
Updates the visual preview:
- Green for valid placement
- Red for invalid placement
- Clears when no cell hovered

#### `clearPreview(): void`
Clears the grid preview and resets hover state.

### Visual Feedback
- **Valid Placement**: Green highlight
- **Invalid Placement**: Red highlight
- **No Hover**: No preview shown

## PathRenderer System

### Purpose
Renders the enemy path and provides collision detection for tower placement.

### Responsibilities
- Path visualization
- Collision detection with path
- Path geometry calculations
- Path queries

### Key Methods

#### `create(): void`
Renders the path using graphics objects:
- Draws thick line segments between path points
- Uses configured path width and color

#### `isOnPath(x: number, y: number): boolean`
Checks if coordinates intersect with the path:
- Uses line-to-point distance calculation
- Considers path width for collision detection

#### `getPath(): any[]`
Returns the path point array.

#### `distanceToLineSegment(...): number`
Calculates distance from point to line segment:
- Used for precise collision detection
- Handles line segment endpoints correctly

### Path Configuration
- **Path Points**: 10 waypoints defining the route
- **Path Width**: 40 pixels
- **Path Color**: Gray (#666666)

## System Interactions

### Update Loop
The main game scene coordinates system updates:

```typescript
update(): void {
  // Update systems in order
  this.waveController.update(this.enemyManager);
  this.enemyManager.update();
  this.towerManager.update(this.enemyManager.getEnemies());

  // Update visual feedback
  this.updateGridPreview();
}
```

### Event Communication
Systems communicate through Phaser events:

```typescript
// TowerManager emits gold changes
this.scene.events.emit('gold-update', this.gold);

// UI listens for updates
this.events.on('gold-update', (gold: number) => {
  this.updateGold(gold);
});
```

### Data Flow
1. **User Input** → **TDGame** → **GridSystem** → **TowerManager**
2. **Wave Start** → **WaveController** → **EnemyManager** → **Enemy Spawning**
3. **Tower Combat** → **TowerManager** → **Tower.update()** → **Enemy.takeDamage()**
4. **Enemy Death** → **EnemyManager** → **TowerManager.addGold()** → **UI Update**

## Performance Considerations

### Update Efficiency
- Systems only update when necessary
- Event-driven updates reduce polling
- Efficient enemy pathfinding

### Memory Management
- Proper cleanup of destroyed objects
- Event listener cleanup
- Graphics object management

### Rendering Optimization
- Depth sorting for proper layering
- Efficient collision detection
- Minimal redraws when possible

## Extensibility

### Adding New Systems
1. Create new system class
2. Initialize in main scene
3. Add to update loop
4. Implement event communication

### Modifying Existing Systems
1. Extend system functionality
2. Add new events if needed
3. Update dependent systems
4. Maintain backward compatibility

### System Dependencies
- **TowerManager** depends on **PathRenderer** for placement validation
- **EnemyManager** depends on **PathRenderer** for path data
- **WaveController** depends on **EnemyManager** for spawning
- All systems depend on **TDGame** for coordination

# Tower Defense Game Configuration

## Overview

The Tower Defense game uses centralized configuration files to manage game constants, asset definitions, and balancing parameters. This approach makes it easy to modify game behavior without changing code.

## Configuration Files

### TD_CONFIG (td-config.ts)

The main configuration file containing all game constants and balancing parameters.

#### Tower Configuration

```typescript
TOWER: {
  COST: 10,           // Gold cost to place a tower
  DAMAGE: 2,          // Damage per shot
  RANGE: 150,         // Targeting range in pixels
  FIRE_RATE: 500,     // Milliseconds between shots
  SIZE: 32,           // Visual size in pixels
  COLOR: 0x0066ff     // Blue color (hex)
}
```

**Tower Balancing Notes:**
- **COST**: Balanced for early game progression
- **DAMAGE**: Increased from default for faster gameplay
- **RANGE**: Standard range for strategic placement
- **FIRE_RATE**: Faster shooting for more action
- **SIZE**: Appropriate for grid cell size
- **COLOR**: Blue for clear identification

#### Enemy Configuration

```typescript
ENEMY: {
  HEALTH: 6,          // Health points
  SPEED: 80,          // Movement speed in pixels per second
  SIZE: 24,           // Visual size in pixels
  REWARD: 5           // Gold reward when defeated
}
```

**Enemy Balancing Notes:**
- **HEALTH**: 3x more health for challenging gameplay
- **SPEED**: Faster movement for more dynamic gameplay
- **SIZE**: Smaller than towers for visual hierarchy
- **REWARD**: Balanced with tower cost (2 enemies = 1 tower)

#### Game Configuration

```typescript
GAME: {
  STARTING_LIVES: 5,  // Initial life count
  WAVE_SIZE: 10,      // Enemies per wave
  STARTING_GOLD: 50   // Initial gold amount
}
```

**Game Balancing Notes:**
- **STARTING_LIVES**: Allows for some mistakes
- **WAVE_SIZE**: Increased from 5 for longer waves
- **STARTING_GOLD**: Enough for 5 towers initially

#### Path Configuration

```typescript
PATH: {
  POINTS: [
    { x: 0, y: 300 },
    { x: 150, y: 300 },
    { x: 200, y: 250 },
    { x: 250, y: 200 },
    { x: 300, y: 150 },
    { x: 400, y: 150 },
    { x: 500, y: 200 },
    { x: 600, y: 250 },
    { x: 700, y: 300 },
    { x: 800, y: 300 }
  ],
  WIDTH: 40
}
```

**Path Design Notes:**
- **POINTS**: 10 waypoints creating a winding path
- **WIDTH**: 40 pixels wide for clear enemy movement
- **Layout**: Strategic curves for interesting tower placement

#### Grid Configuration

```typescript
GRID: {
  CELL_SIZE: 40
}
```

**Grid Design Notes:**
- **CELL_SIZE**: Matches path width for consistency
- **Alignment**: Centers towers on grid cells
- **Visual**: Clear grid for easy placement

### TD_ASSETS (td-assets.config.ts)

Asset configuration file defining all game assets and their properties.

#### Image Assets

```typescript
image: {
  background: {
    key: 'td-background',
    path: 'assets/tower-defense/background.png'
  }
}
```

**Asset Notes:**
- **key**: Unique identifier for Phaser
- **path**: File path relative to assets directory
- **Usage**: Background images for scenes

#### Graphics Assets

```typescript
graphics: {
  tower: {
    key: 'tower',
    type: 'rectangle',
    color: 0x0066ff,
    size: 32
  },
  enemy: {
    key: 'enemy',
    type: 'circle',
    color: 0xff0000,
    size: 24
  },
  projectile: {
    key: 'projectile',
    type: 'circle',
    color: 0xffff00,
    size: 8
  },
  path: {
    key: 'path',
    type: 'rectangle',
    color: 0x666666,
    width: 40,
    height: 40
  }
}
```

**Graphics Notes:**
- **tower**: Blue rectangle matching TD_CONFIG
- **enemy**: Red circle for clear identification
- **projectile**: Yellow circle for visibility
- **path**: Gray rectangle for path rendering

## Configuration Usage

### In Code

Configuration is imported and used throughout the game:

```typescript
import { TD_CONFIG } from '../config/td-config';

// Use in Tower class
this.maxHealth = TD_CONFIG.ENEMY.HEALTH;
this.speed = TD_CONFIG.ENEMY.SPEED;

// Use in TowerManager
this.gold = TD_CONFIG.GAME.STARTING_GOLD;
```

### Asset Loading

Assets are loaded in the preloader scene:

```typescript
import { TD_ASSETS } from '../config/td-assets.config';

// Load assets
for (let type in TD_ASSETS) {
  for (let key in (TD_ASSETS as any)[type]) {
    const asset = (TD_ASSETS as any)[type][key];
    if (type === 'image' && asset.path) {
      this.load.image(asset.key, asset.path);
    }
  }
}
```

## Balancing Guidelines

### Tower vs Enemy Balance

**Tower Effectiveness:**
- 1 tower costs 10 gold
- 1 tower deals 2 damage per shot
- 1 tower fires every 500ms
- 1 enemy has 6 health
- 1 enemy gives 5 gold reward

**Mathematical Analysis:**
- Tower needs 3 shots to kill 1 enemy (6 health ÷ 2 damage)
- Tower fires 3 shots in 1.5 seconds (3 × 500ms)
- Tower earns 5 gold per enemy killed
- Tower needs 2 enemies to pay for itself (10 gold cost ÷ 5 gold reward)

### Wave Progression

**Wave Timing:**
- 10 enemies per wave
- 300ms spawn delay between enemies
- Total wave time: ~3 seconds of spawning
- Plus time for enemies to traverse path

**Resource Management:**
- Starting gold: 50 (5 towers)
- Gold per enemy: 5
- Gold per wave: 50 (10 enemies)
- Self-sustaining after first wave

### Difficulty Scaling

**Current Difficulty:**
- High enemy health (6 HP)
- Fast enemy speed (80 px/s)
- Fast tower fire rate (500ms)
- Increased wave size (10 enemies)

**Balancing Factors:**
- Tower range limits placement options
- Path width prevents easy blocking
- Grid system enforces strategic placement
- Life system adds consequence for failure

## Customization Options

### Easy Modifications

**Tower Balancing:**
```typescript
TOWER: {
  COST: 5,            // Cheaper towers
  DAMAGE: 3,          // More damage
  RANGE: 200,         // Longer range
  FIRE_RATE: 300,     // Faster shooting
}
```

**Enemy Balancing:**
```typescript
ENEMY: {
  HEALTH: 3,          // Less health
  SPEED: 60,          // Slower movement
  REWARD: 10,         // More gold reward
}
```

**Game Balancing:**
```typescript
GAME: {
  STARTING_LIVES: 10, // More lives
  WAVE_SIZE: 5,       // Smaller waves
  STARTING_GOLD: 100, // More starting gold
}
```

### Advanced Modifications

**Path Design:**
- Modify `PATH.POINTS` array
- Add more waypoints for longer paths
- Create different path shapes
- Adjust path width

**Grid System:**
- Change `GRID.CELL_SIZE` for different grid density
- Modify grid alignment
- Add grid visual effects

**Asset Customization:**
- Replace image assets
- Modify graphics properties
- Add new asset types
- Implement sprite sheets

## Performance Considerations

### Configuration Impact

**Memory Usage:**
- Configuration is loaded once
- Minimal memory footprint
- No runtime changes to config

**Performance:**
- Constants are inlined by TypeScript
- No runtime lookups
- Efficient asset loading

### Optimization Tips

**Asset Loading:**
- Use appropriate image formats
- Optimize image sizes
- Consider sprite sheets for multiple assets

**Configuration Access:**
- Import only needed constants
- Use TypeScript const assertions
- Avoid deep object access

## Best Practices

### Configuration Management

1. **Single Source of Truth**: All constants in config files
2. **Clear Naming**: Descriptive constant names
3. **Grouping**: Related constants grouped together
4. **Documentation**: Comment complex configurations
5. **Validation**: Ensure valid values

### Asset Management

1. **Consistent Naming**: Use consistent key naming
2. **File Organization**: Organize assets in folders
3. **Format Standards**: Use appropriate formats
4. **Size Optimization**: Optimize asset sizes
5. **Loading Strategy**: Load assets efficiently

### Balancing Process

1. **Start Conservative**: Begin with balanced values
2. **Test Thoroughly**: Test all configuration changes
3. **Iterate Gradually**: Make small adjustments
4. **Document Changes**: Track balancing decisions
5. **Player Feedback**: Consider player experience

## Troubleshooting

### Common Issues

**Configuration Not Loading:**
- Check import paths
- Verify file exports
- Ensure TypeScript compilation

**Assets Not Loading:**
- Check file paths
- Verify asset keys
- Check preloader implementation

**Balancing Problems:**
- Test with different values
- Consider player experience
- Document changes made

### Debug Tips

**Configuration Debugging:**
- Log configuration values
- Check constant usage
- Verify type safety

**Asset Debugging:**
- Check asset loading progress
- Verify asset keys
- Test asset rendering

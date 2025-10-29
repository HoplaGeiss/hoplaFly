# Tower Defense Game Scenes

## Overview

The Tower Defense game uses Phaser's scene system to manage different game states and user interfaces. Each scene handles a specific aspect of the game experience.

## Scene Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Scene Flow                               │
└─────────────────────────────────────────────────────────────┘

MainMenu → TDPreloader → TDGame + TDUI
    ↑           ↓              ↓
    └───────────┴──────────────┘
                 │
         ┌───────┴───────┐
         │               │
    TDGameOver      TDWin
         │               │
         └───────┬───────┘
                 │
            MainMenu
```

## TDPreloader Scene

### Purpose
Handles asset loading and initialization before the main game begins.

### Key Features
- **Progress Bar**: Visual loading indicator
- **Asset Loading**: Loads all tower defense assets
- **Smooth Transition**: Seamless transition to main game

### Methods

#### `init(): void`
Creates the progress bar visualization:
- White border rectangle
- Animated progress bar
- Centered on screen

#### `preload(): void`
Loads all required assets:
- Iterates through `TD_ASSETS` configuration
- Loads image assets from specified paths
- Handles different asset types

#### `create(): void`
Transitions to the main game scene:
- Starts the `TDGame` scene
- Cleans up loading elements

### Asset Loading
Loads assets defined in `TD_ASSETS`:
- Background images
- Tower graphics
- Enemy graphics
- Path graphics

## TDGame Scene (Main Game)

### Purpose
The core game scene that manages all gameplay systems and logic.

### Key Features
- **System Management**: Coordinates all game systems
- **Input Handling**: Mouse and keyboard input
- **Game Loop**: Main update loop for all systems
- **Event Coordination**: Manages system communication

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `userService` | `UserService` | External service for hoplaTokens |
| `pathRenderer` | `PathRenderer` | Path rendering system |
| `gridSystem` | `GridSystem` | Grid placement system |
| `towerManager` | `TowerManager` | Tower management system |
| `enemyManager` | `EnemyManager` | Enemy management system |
| `waveController` | `WaveController` | Wave control system |

### Methods

#### `create(): void`
Initializes the main game:
- Gets UserService from registry
- Sets background color
- Initializes all systems
- Sets up input handling
- Launches UI scene
- Sets up event listeners

#### `setupInput(): void`
Configures input handling:
- Mouse clicks for tower placement
- Mouse hover for grid preview
- ESC key for menu navigation

#### `setupEventListeners(): void`
Sets up event communication:
- Listens for wave start events
- Coordinates between systems

#### `handleGridClick(x: number, y: number): void`
Handles tower placement:
- Validates wave state
- Gets grid cell coordinates
- Attempts tower placement
- Updates grid preview

#### `handleGridHover(x: number, y: number): void`
Handles grid hover preview:
- Updates hovered cell
- Updates visual preview

#### `updateGridPreview(): void`
Updates the grid preview:
- Gets current hover cell
- Checks placement validity
- Updates visual feedback

#### `quitToMenu(): void`
Returns to main menu:
- Stops all game scenes
- Returns to MainMenu

#### `update(): void`
Main game loop:
- Updates wave controller
- Updates enemy manager
- Updates tower manager
- Updates grid preview

### Event Handling
- **start-wave**: Triggers wave start
- **System Events**: Coordinates between systems
- **Input Events**: Handles user interaction

## TDUI Scene (User Interface)

### Purpose
Provides the user interface overlay for the main game.

### Key Features
- **HUD Display**: Lives, gold, and balance display
- **Control Buttons**: Start wave and quit buttons
- **Real-time Updates**: Dynamic UI updates
- **Responsive Design**: Adapts to screen size changes

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `userService` | `UserService` | External service for hoplaTokens |
| `livesText` | `Phaser.GameObjects.Text` | Lives display text |
| `goldText` | `Phaser.GameObjects.Text` | Gold display text |
| `balanceText` | `Phaser.GameObjects.Text` | hoplaTokens balance display |
| `startWaveButton` | `Phaser.GameObjects.Text` | Start wave button |
| `quitButton` | `Phaser.GameObjects.Text` | Quit button |
| `lives` | `number` | Current life count |
| `gold` | `number` | Current gold amount |

### Methods

#### `create(): void`
Initializes the UI:
- Gets UserService from registry
- Sets up resize handling
- Creates UI elements
- Sets up event listeners

#### `createUI(): void`
Creates all UI elements:
- Lives display (top left)
- Gold display (top right)
- Balance display (center top)
- Start wave button (center bottom)
- Quit button (bottom left)

#### `setupEventListeners(): void`
Sets up event communication:
- Listens for game state changes
- Updates UI elements accordingly

#### `updateLives(lives: number): void`
Updates the lives display.

#### `updateGold(gold: number): void`
Updates the gold display.

#### `updateBalance(): void`
Updates the hoplaTokens balance display.

#### `hideStartWaveButton(): void`
Hides the start wave button during active waves.

#### `showStartWaveButton(): void`
Shows the start wave button when wave is complete.

#### `handleResize(gameSize: Phaser.Structs.Size): void`
Handles window resize events:
- Updates UI element positions
- Maintains proper layout

#### `update(): void`
Main update loop:
- Monitors UserService initialization
- Updates balance display when needed

### Event Handling
- **lives-update**: Updates lives display
- **gold-update**: Updates gold display
- **balance-update**: Updates balance display
- **wave-start**: Hides start wave button
- **wave-complete**: Shows start wave button
- **game-over**: Shows game over UI
- **reset-game**: Resets UI state

## TDGameOver Scene

### Purpose
Displays the game over screen when the player loses all lives.

### Key Features
- **Game Over Display**: Clear game over message
- **Balance Display**: Shows current hoplaTokens balance
- **Restart Option**: Tap to restart the game
- **Menu Navigation**: Return to main menu

### Methods

#### `create(): void`
Creates the game over screen:
- Gets UserService from registry
- Sets red background
- Displays game over text
- Shows current balance
- Creates restart button
- Creates menu button

### Visual Elements
- **Background**: Dark red color
- **Title**: "Game Over" in large white text
- **Balance**: Current hoplaTokens balance
- **Restart**: "Tap to restart" instruction
- **Menu Button**: "Back to Menu" button

### Navigation
- **Tap Screen**: Restarts the game
- **Menu Button**: Returns to main menu

## TDWin Scene

### Purpose
Displays the victory screen when the player completes all waves.

### Key Features
- **Victory Display**: Clear victory message
- **Reward Display**: Shows earned hoplaTokens
- **Balance Display**: Shows total hoplaTokens balance
- **Play Again Option**: Tap to play again
- **Menu Navigation**: Return to main menu

### Methods

#### `create(): void`
Creates the victory screen:
- Gets UserService from registry
- Sets green background
- Displays victory text
- Shows reward information
- Shows total balance
- Creates play again button
- Creates menu button

### Visual Elements
- **Background**: Dark green color
- **Title**: "Victory!" in large gold text
- **Reward**: "You won 1 hoplaToken!" message
- **Balance**: Total hoplaTokens balance
- **Play Again**: "Tap to play again" instruction
- **Menu Button**: "Back to Menu" button

### Navigation
- **Tap Screen**: Restarts the game
- **Menu Button**: Returns to main menu

## Scene Transitions

### Flow Diagram
```
MainMenu
    ↓
TDPreloader (loads assets)
    ↓
TDGame + TDUI (main gameplay)
    ↓
    ├─ TDGameOver (lose all lives)
    │   └─ MainMenu
    │
    └─ TDWin (complete all waves)
        └─ MainMenu
```

### Transition Methods
- **Scene.start()**: Starts a new scene
- **Scene.stop()**: Stops the current scene
- **Scene.launch()**: Launches a scene alongside current scene

### Event Coordination
- Scenes communicate through Phaser events
- UserService is shared via game registry
- State is maintained across scene transitions

## Performance Considerations

### Scene Management
- Only active scenes are updated
- Inactive scenes are paused
- Proper cleanup on scene transitions

### Memory Management
- Graphics objects are properly disposed
- Event listeners are cleaned up
- UserService is shared efficiently

### Rendering Optimization
- UI elements are positioned efficiently
- Depth sorting for proper layering
- Responsive design for different screen sizes

## Extensibility

### Adding New Scenes
1. Create new scene class extending Phaser.Scene
2. Implement required methods (create, update, etc.)
3. Add scene to game configuration
4. Handle transitions from other scenes

### Modifying Existing Scenes
1. Extend scene functionality
2. Add new UI elements or features
3. Update event handling
4. Maintain backward compatibility

### Scene Communication
- Use Phaser events for loose coupling
- Share data through game registry
- Maintain clear scene boundaries

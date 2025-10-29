export const TD_CONFIG = {
  TOWER: {
    COST: 10,
    DAMAGE: 2, // increased damage for faster gameplay
    RANGE: 150,
    FIRE_RATE: 500, // ms - faster shooting
    SIZE: 32,
    COLOR: 0x0066ff
  },
  TOWER_TYPES: {
    QUICK_FIRE: {
      name: 'Quick Fire',
      description: 'Fast shooting, low damage',
      cost: 8,
      damage: 1,
      range: 120,
      fireRate: 300, // ms
      size: 32, // Same size for all towers
      color: 0x00ff00, // green
      icon: '⚡'
    },
    SPLASH_DAMAGE: {
      name: 'Splash',
      description: 'Slow fire, area damage',
      cost: 15,
      damage: 3,
      range: 140,
      fireRate: 800, // ms
      size: 32, // Same size for all towers
      color: 0xff6600, // orange
      icon: '💥',
      splashRadius: 40
    },
    HEAVY_DAMAGE: {
      name: 'Heavy',
      description: 'Slow fire, high damage',
      cost: 20,
      damage: 5,
      range: 180,
      fireRate: 1000, // ms
      size: 32, // Same size for all towers
      color: 0x8b0000, // dark red
      icon: '💀'
    }
  },
  ENEMY: {
    HEALTH: 6, // 3x more health for more challenging gameplay
    SPEED: 80, // faster movement
    SIZE: 24,
    REWARD: 5
  },
  GAME: {
    STARTING_LIVES: 10,
    WAVE_SIZE: 10, // 10 enemies instead of 5
    STARTING_GOLD: 50
  },
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
  },
  GRID: {
    CELL_SIZE: 40, // 40x40 pixel cells
    TOWER_CELL_SIZE: 40 // Same as cell size for tower placement
  },
  WAVES: {
    TOTAL_WAVES: 5,
    WAVE_CONFIGS: [
      { enemies: 10, health: 6, speed: 80 },   // Wave 1
      { enemies: 15, health: 8, speed: 85 },   // Wave 2
      { enemies: 20, health: 10, speed: 90 },  // Wave 3
      { enemies: 25, health: 13, speed: 95 },  // Wave 4
      { enemies: 30, health: 16, speed: 100 }  // Wave 5
    ]
  }
};

/**
 * Generate a responsive path optimized for mobile screens
 * Creates a more vertical path suitable for portrait orientation
 */
export function getResponsivePath(width: number, height: number): Array<{ x: number; y: number }> {
  // For mobile screens (width < 600), use orthogonal path with 90-degree turns
  if (width < 600) {
    const margin = 40;
    const segmentLength = 80; // Consistent segment length for tower placement
    const centerY = height / 2; // Center the path vertically
    const pathHeight = 320; // Total height of the path
    const startY = centerY - pathHeight / 2; // Start above center

    return [
      // Start at left, move right
      { x: margin, y: startY },
      { x: margin + segmentLength, y: startY },

      // Turn up, move up
      { x: margin + segmentLength, y: startY + 80 },

      // Turn right, move right
      { x: margin + segmentLength * 2, y: startY + 80 },

      // Turn up, move up
      { x: margin + segmentLength * 2, y: startY + 160 },

      // Turn right, move right
      { x: margin + segmentLength * 3, y: startY + 160 },

      // Turn up, move up
      { x: margin + segmentLength * 3, y: startY + 240 },

      // Turn right, move right
      { x: margin + segmentLength * 4, y: startY + 240 },

      // Turn up, move up to exit
      { x: margin + segmentLength * 4, y: startY + 320 },
      { x: width - margin, y: startY + 320 }
    ];
  }

  // For larger screens, use the original horizontal path but scale it
  const scaleX = width / 800;
  const scaleY = height / 600;

  return TD_CONFIG.PATH.POINTS.map(point => ({
    x: point.x * scaleX,
    y: point.y * scaleY
  }));
}

/**
 * Get responsive path width based on screen size
 */
export function getResponsivePathWidth(width: number): number {
  return width < 600 ? 30 : TD_CONFIG.PATH.WIDTH;
}

export const TD_CONFIG = {
  TOWER: {
    COST: 10,
    DAMAGE: 2, // increased damage for faster gameplay
    RANGE: 150,
    FIRE_RATE: 500, // ms - faster shooting
    SIZE: 32,
    COLOR: 0x0066ff
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
    CELL_SIZE: 40
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

    return [
      // Start at bottom-left, move right
      { x: margin, y: height - 60 },
      { x: margin + segmentLength, y: height - 60 },

      // Turn up, move up
      { x: margin + segmentLength, y: height - 140 },

      // Turn right, move right
      { x: margin + segmentLength * 2, y: height - 140 },

      // Turn up, move up
      { x: margin + segmentLength * 2, y: height - 220 },

      // Turn right, move right
      { x: margin + segmentLength * 3, y: height - 220 },

      // Turn up, move up
      { x: margin + segmentLength * 3, y: height - 300 },

      // Turn right, move right
      { x: margin + segmentLength * 4, y: height - 300 },

      // Turn up, move up to exit
      { x: margin + segmentLength * 4, y: height - 380 },
      { x: width - margin, y: height - 380 }
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

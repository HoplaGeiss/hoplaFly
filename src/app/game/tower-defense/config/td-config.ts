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
    STARTING_LIVES: 5,
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

export const GAME_CONSTANTS = {
  // Distance and timing
  DISTANCE_MAX: 200,
  COIN_DISTANCE_MAX: 50,
  SPIKE_DISTANCE_MAX: 18,

  // Player physics
  FLY_VELOCITY: -200,
  BACKGROUND_SPEED: 1,

  // Path generation
  PATH_OFFSET_MAX: 100,
  PATH_HEIGHT_MIN: 50,
  PATH_HEIGHT_MAX: 200,
  PATH_HEIGHT_TARGET: 300,

  // Game progression
  WIN_SCORE: 5,

  // UI positioning
  SCORE_Y: 50,
  BALANCE_Y: 90,
  QUIT_BUTTON_X: 50,
  QUIT_BUTTON_Y: 50,

  // Physics
  GRAVITY: 400,
  BACKGROUND_COLOR: 0x040218
} as const;

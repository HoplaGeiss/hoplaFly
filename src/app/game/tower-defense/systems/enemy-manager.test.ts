import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnemyManager } from './enemy-manager';
import { TD_CONFIG } from '../config/td-config';

const mockGraphics = {
  fillStyle: vi.fn(),
  fillCircle: vi.fn(),
  setPosition: vi.fn(),
  setDepth: vi.fn(),
  clear: vi.fn(),
  fillRect: vi.fn(),
  destroy: vi.fn()
};

const mockScene = {
  events: {
    emit: vi.fn()
  },
  add: {
    graphics: vi.fn(() => mockGraphics)
  },
  game: {
    loop: { delta: 16 }
  }
} as any;

describe('EnemyManager', () => {
  let enemyManager: EnemyManager;

  beforeEach(() => {
    vi.clearAllMocks();
    enemyManager = new EnemyManager(mockScene);
    enemyManager.create();
  });

  describe('create', () => {
    it('should initialize with starting lives', () => {
      expect(enemyManager.getLives()).toBe(TD_CONFIG.GAME.STARTING_LIVES);
      expect(mockScene.events.emit).toHaveBeenCalledWith('lives-update', TD_CONFIG.GAME.STARTING_LIVES);
    });
  });

  describe('spawnEnemy', () => {
    it('should spawn enemy at start point', () => {
      enemyManager.spawnEnemy();

      const enemies = enemyManager.getEnemies();
      expect(enemies).toHaveLength(1);
      expect(enemies[0].x).toBe(TD_CONFIG.PATH.POINTS[0].x);
      expect(enemies[0].y).toBe(TD_CONFIG.PATH.POINTS[0].y);
    });
  });

  describe('update', () => {
    it('should remove inactive enemies', () => {
      enemyManager.spawnEnemy();
      const enemy = enemyManager.getEnemies()[0];
      enemy.die(); // Make enemy inactive

      enemyManager.update();

      expect(enemyManager.getEnemies()).toHaveLength(0);
    });

    it('should lose life when enemy reaches end', () => {
      enemyManager.spawnEnemy();
      const enemy = enemyManager.getEnemies()[0];
      enemy.pathIndex = TD_CONFIG.PATH.POINTS.length - 1; // At end

      enemyManager.update();

      expect(enemyManager.getLives()).toBe(TD_CONFIG.GAME.STARTING_LIVES - 1);
      expect(mockScene.events.emit).toHaveBeenCalledWith('lives-update', TD_CONFIG.GAME.STARTING_LIVES - 1);
    });

    it('should emit game over when lives reach zero', () => {
      enemyManager['lives'] = 1; // Set to 1 life
      enemyManager.spawnEnemy();
      const enemy = enemyManager.getEnemies()[0];
      enemy.pathIndex = TD_CONFIG.PATH.POINTS.length - 1;

      enemyManager.update();

      expect(mockScene.events.emit).toHaveBeenCalledWith('game-over');
    });
  });

  describe('getActiveEnemies', () => {
    it('should return only active enemies', () => {
      enemyManager.spawnEnemy();
      enemyManager.spawnEnemy();

      const enemies = enemyManager.getEnemies();
      enemies[0].die(); // Make first enemy inactive

      const activeEnemies = enemyManager.getActiveEnemies();
      expect(activeEnemies).toHaveLength(1);
      expect(activeEnemies[0]).toBe(enemies[1]);
    });
  });

  describe('reset', () => {
    it('should reset enemies and lives', () => {
      enemyManager.spawnEnemy();
      enemyManager['lives'] = 2;

      enemyManager.reset();

      expect(enemyManager.getEnemies()).toHaveLength(0);
      expect(enemyManager.getLives()).toBe(TD_CONFIG.GAME.STARTING_LIVES);
      expect(mockScene.events.emit).toHaveBeenCalledWith('lives-update', TD_CONFIG.GAME.STARTING_LIVES);
    });
  });
});

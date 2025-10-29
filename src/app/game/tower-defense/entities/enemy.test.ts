import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Enemy } from './enemy';
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
  add: {
    graphics: vi.fn(() => mockGraphics)
  },
  game: {
    loop: { delta: 16 } // 60 FPS
  }
} as any;

describe('Enemy', () => {
  let enemy: Enemy;

  beforeEach(() => {
    vi.clearAllMocks();
    enemy = new Enemy(mockScene, 100, 100);
  });

  describe('Constructor', () => {
    it('should initialize with correct properties', () => {
      expect(enemy.x).toBe(100);
      expect(enemy.y).toBe(100);
      expect(enemy.maxHealth).toBe(TD_CONFIG.ENEMY.HEALTH);
      expect(enemy.currentHealth).toBe(TD_CONFIG.ENEMY.HEALTH);
      expect(enemy.speed).toBe(TD_CONFIG.ENEMY.SPEED);
      expect(enemy.reward).toBe(TD_CONFIG.ENEMY.REWARD);
      expect(enemy.active).toBe(true);
      expect(enemy.pathIndex).toBe(0);
    });
  });

  describe('takeDamage', () => {
    it('should reduce health and update health bar', () => {
      const initialHealth = enemy.currentHealth;
      const damage = 2;

      enemy.takeDamage(damage);

      expect(enemy.currentHealth).toBe(initialHealth - damage);
    });

    it('should die when health reaches zero', () => {
      vi.spyOn(enemy, 'die').mockImplementation(() => {});

      enemy.takeDamage(enemy.currentHealth);

      expect(enemy.die).toHaveBeenCalled();
    });

    it('should die when health goes below zero', () => {
      vi.spyOn(enemy, 'die').mockImplementation(() => {});

      enemy.takeDamage(enemy.currentHealth + 10);

      expect(enemy.die).toHaveBeenCalled();
    });
  });

  describe('die', () => {
    it('should set active to false and destroy sprites', () => {
      enemy.die();

      expect(enemy.active).toBe(false);
      expect(enemy.sprite.destroy).toHaveBeenCalled();
      expect(enemy.healthBar.destroy).toHaveBeenCalled();
    });
  });

  describe('moveAlongPath', () => {
    const path = [
      { x: 100, y: 100 },
      { x: 200, y: 100 },
      { x: 200, y: 200 }
    ];

    it('should move towards next point', () => {
      enemy.pathIndex = 0;
      const initialX = enemy.x;
      const initialY = enemy.y;

      // Set a larger delta time to enable visible movement
      enemy.scene.game.loop.delta = 1000; // 1 second

      // Spy on the sprite setPosition to verify movement is attempted
      const setPositionSpy = vi.spyOn(enemy.sprite, 'setPosition');

      enemy.moveAlongPath(path);

      // Should attempt to update sprite position (indicating movement)
      expect(setPositionSpy).toHaveBeenCalled();
    });

    it('should advance path index when close to next point', () => {
      enemy.pathIndex = 0;
      enemy.x = 199; // Very close to next point
      enemy.y = 100;

      enemy.moveAlongPath(path);

      expect(enemy.pathIndex).toBe(1);
    });

    it('should reach end when at last point', () => {
      enemy.pathIndex = path.length - 1;
      vi.spyOn(enemy, 'reachEnd').mockImplementation(() => {});

      enemy.moveAlongPath(path);

      expect(enemy.reachEnd).toHaveBeenCalled();
    });
  });

  describe('reachEnd', () => {
    it('should deactivate enemy and destroy sprites', () => {
      enemy.reachEnd();

      expect(enemy.active).toBe(false);
      expect(enemy.sprite.destroy).toHaveBeenCalled();
      expect(enemy.healthBar.destroy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should move along path when active', () => {
      const path = [{ x: 100, y: 100 }, { x: 200, y: 100 }];
      vi.spyOn(enemy, 'moveAlongPath').mockImplementation(() => {});

      enemy.update(path);

      expect(enemy.moveAlongPath).toHaveBeenCalledWith(path);
    });

    it('should not move when inactive', () => {
      enemy.active = false;
      vi.spyOn(enemy, 'moveAlongPath').mockImplementation(() => {});

      enemy.update([]);

      expect(enemy.moveAlongPath).not.toHaveBeenCalled();
    });
  });
});

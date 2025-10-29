import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Tower } from './tower';
import { TD_CONFIG } from '../config/td-config';

const mockGraphics = {
  fillStyle: vi.fn(),
  fillRect: vi.fn(),
  setPosition: vi.fn(),
  setDepth: vi.fn(),
  lineStyle: vi.fn(),
  strokeCircle: vi.fn(),
  setVisible: vi.fn(),
  destroy: vi.fn(),
  clear: vi.fn(),
  fillCircle: vi.fn()
};

const mockScene = {
  add: {
    graphics: vi.fn(() => mockGraphics)
  },
  tweens: {
    add: vi.fn()
  }
} as any;

describe('Tower', () => {
  let tower: Tower;

  beforeEach(() => {
    vi.clearAllMocks();
    tower = new Tower(mockScene, 100, 100);
  });

  describe('Constructor', () => {
    it('should initialize with correct position', () => {
      expect(tower.x).toBe(100);
      expect(tower.y).toBe(100);
      expect(tower.scene).toBe(mockScene);
    });

    it('should create sprite and range indicator', () => {
      expect(mockScene.add.graphics).toHaveBeenCalledTimes(2);
    });
  });

  describe('canFire', () => {
    it('should return true when enough time has passed', () => {
      const mockTime = 1000;
      vi.setSystemTime(mockTime + TD_CONFIG.TOWER.FIRE_RATE);
      tower.lastFireTime = mockTime;

      expect(tower.canFire()).toBe(true);
    });

    it('should return false when not enough time has passed', () => {
      const mockTime = 1000;
      vi.setSystemTime(mockTime + TD_CONFIG.TOWER.FIRE_RATE - 100);
      tower.lastFireTime = mockTime;

      expect(tower.canFire()).toBe(false);
    });
  });

  describe('findTarget', () => {
    it('should find closest enemy within range', () => {
      const enemies = [
        { x: 120, y: 120, active: true }, // Distance: ~28
        { x: 200, y: 100, active: true }, // Distance: 100
        { x: 110, y: 110, active: true }  // Distance: ~14 (closest)
      ];

      const target = tower.findTarget(enemies);
      expect(target).toBe(enemies[2]);
    });

    it('should return null when no enemies in range', () => {
      const enemies = [
        { x: 300, y: 300, active: true }, // Distance: ~283 (out of range)
        { x: 400, y: 400, active: true }  // Distance: ~424 (out of range)
      ];

      const target = tower.findTarget(enemies);
      expect(target).toBeNull();
    });

    it('should ignore inactive enemies', () => {
      const enemies = [
        { x: 120, y: 120, active: false },
        { x: 110, y: 110, active: true }
      ];

      const target = tower.findTarget(enemies);
      expect(target).toBe(enemies[1]);
    });
  });

  describe('fire', () => {
    it('should fire at target when conditions are met', () => {
      const target = { x: 150, y: 150, active: true };
      tower.lastFireTime = 0; // Allow firing

      tower.fire(target);

      expect(tower.lastFireTime).toBe(Date.now());
      expect(tower.target).toBe(target);
      expect(mockScene.add.graphics).toHaveBeenCalled();
      expect(mockScene.tweens.add).toHaveBeenCalled();
    });

    it('should not fire when cannot fire', () => {
      const target = { x: 150, y: 150, active: true };
      tower.lastFireTime = Date.now(); // Cannot fire yet

      tower.fire(target);

      expect(mockScene.tweens.add).not.toHaveBeenCalled();
    });

    it('should not fire when no target', () => {
      tower.lastFireTime = 0;

      tower.fire(null);

      expect(mockScene.tweens.add).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should find and fire at target when can fire', () => {
      const enemies = [{ x: 120, y: 120, active: true }];
      vi.spyOn(tower, 'canFire').mockReturnValue(true);
      vi.spyOn(tower, 'findTarget').mockReturnValue(enemies[0]);
      vi.spyOn(tower, 'fire').mockImplementation(() => {});

      tower.update(enemies);

      expect(tower.findTarget).toHaveBeenCalledWith(enemies);
      expect(tower.fire).toHaveBeenCalledWith(enemies[0]);
    });

    it('should not fire when cannot fire', () => {
      const enemies = [{ x: 120, y: 120, active: true }];
      vi.spyOn(tower, 'canFire').mockReturnValue(false);
      vi.spyOn(tower, 'fire').mockImplementation(() => {});

      tower.update(enemies);

      expect(tower.fire).not.toHaveBeenCalled();
    });
  });

  describe('range visibility', () => {
    it('should show range indicator', () => {
      tower.showRange();
      expect(tower.rangeCircle.setVisible).toHaveBeenCalledWith(true);
    });

    it('should hide range indicator', () => {
      tower.hideRange();
      expect(tower.rangeCircle.setVisible).toHaveBeenCalledWith(false);
    });
  });
});

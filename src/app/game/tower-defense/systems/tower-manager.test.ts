import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TowerManager } from './tower-manager';
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
  events: {
    emit: vi.fn()
  },
  add: {
    graphics: vi.fn(() => mockGraphics)
  },
  tweens: {
    add: vi.fn()
  }
} as any;

const mockPathRenderer = {
  isOnPath: vi.fn()
};

describe('TowerManager', () => {
  let towerManager: TowerManager;

  beforeEach(() => {
    vi.clearAllMocks();
    towerManager = new TowerManager(mockScene);
    towerManager.create();
  });

  describe('create', () => {
    it('should initialize with starting gold', () => {
      expect(towerManager.getGold()).toBe(TD_CONFIG.GAME.STARTING_GOLD);
    });
  });

  describe('canPlaceTower', () => {
    it('should return false when position is on path', () => {
      mockPathRenderer.isOnPath.mockReturnValue(true);

      const result = towerManager.canPlaceTower(100, 100, mockPathRenderer);

      expect(result).toBe(false);
    });

    it('should return false when not enough gold', () => {
      mockPathRenderer.isOnPath.mockReturnValue(false);
      towerManager['gold'] = 5; // Less than tower cost

      const result = towerManager.canPlaceTower(100, 100, mockPathRenderer);

      expect(result).toBe(false);
    });

    it('should return false when position is occupied', () => {
      mockPathRenderer.isOnPath.mockReturnValue(false);
      // Place a tower first
      towerManager.placeTower(100, 100, mockPathRenderer);

      const result = towerManager.canPlaceTower(100, 100, mockPathRenderer);

      expect(result).toBe(false);
    });

    it('should return true when all conditions are met', () => {
      mockPathRenderer.isOnPath.mockReturnValue(false);

      const result = towerManager.canPlaceTower(200, 200, mockPathRenderer);

      expect(result).toBe(true);
    });
  });

  describe('placeTower', () => {
    it('should place tower when conditions are met', () => {
      mockPathRenderer.isOnPath.mockReturnValue(false);

      const result = towerManager.placeTower(100, 100, mockPathRenderer);

      expect(result).toBe(true);
      expect(towerManager.getTowers()).toHaveLength(1);
      expect(towerManager.getGold()).toBe(TD_CONFIG.GAME.STARTING_GOLD - TD_CONFIG.TOWER.COST);
      expect(mockScene.events.emit).toHaveBeenCalledWith('gold-update', towerManager.getGold());
    });

    it('should not place tower when conditions not met', () => {
      mockPathRenderer.isOnPath.mockReturnValue(true);

      const result = towerManager.placeTower(100, 100, mockPathRenderer);

      expect(result).toBe(false);
      expect(towerManager.getTowers()).toHaveLength(0);
    });
  });

  describe('addGold', () => {
    it('should add gold and emit event', () => {
      const initialGold = towerManager.getGold();
      const amount = 10;

      towerManager.addGold(amount);

      expect(towerManager.getGold()).toBe(initialGold + amount);
      expect(mockScene.events.emit).toHaveBeenCalledWith('gold-update', initialGold + amount);
    });
  });

  describe('reset', () => {
    it('should reset towers and gold', () => {
      // Place a tower first
      mockPathRenderer.isOnPath.mockReturnValue(false);
      towerManager.placeTower(100, 100, mockPathRenderer);

      towerManager.reset();

      expect(towerManager.getTowers()).toHaveLength(0);
      expect(towerManager.getGold()).toBe(TD_CONFIG.GAME.STARTING_GOLD);
      expect(mockScene.events.emit).toHaveBeenCalledWith('gold-update', TD_CONFIG.GAME.STARTING_GOLD);
    });
  });
});

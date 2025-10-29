import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WaveController } from './wave-controller';
import { TD_CONFIG } from '../config/td-config';

const mockScene = {
  events: {
    emit: vi.fn()
  }
} as any;

const mockEnemyManager = {
  spawnEnemy: vi.fn(),
  getActiveEnemies: vi.fn(() => [])
};

describe('WaveController', () => {
  let waveController: WaveController;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    waveController = new WaveController(mockScene);
    waveController.create();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('should initialize with no active wave', () => {
      expect(waveController.isWaveActive()).toBe(false);
    });
  });

  describe('startWave', () => {
    it('should start wave and emit event', () => {
      waveController.startWave();

      expect(waveController.isWaveActive()).toBe(true);
      expect(mockScene.events.emit).toHaveBeenCalledWith('wave-start');
    });

    it('should not start wave if already active', () => {
      waveController.startWave();
      mockScene.events.emit.mockClear();

      waveController.startWave();

      expect(mockScene.events.emit).not.toHaveBeenCalledWith('wave-start');
    });
  });

  describe('update', () => {
    it('should spawn enemies during wave', () => {
      waveController.startWave();

      waveController.update(mockEnemyManager);

      expect(mockEnemyManager.spawnEnemy).toHaveBeenCalled();
    });

    it('should not spawn enemies when wave not active', () => {
      waveController.update(mockEnemyManager);

      expect(mockEnemyManager.spawnEnemy).not.toHaveBeenCalled();
    });

    it('should complete wave when all enemies spawned and defeated', () => {
      waveController.startWave();
      mockEnemyManager.getActiveEnemies.mockReturnValue([]);
      waveController['enemiesSpawned'] = TD_CONFIG.GAME.WAVE_SIZE;

      waveController.update(mockEnemyManager);

      expect(waveController.isWaveActive()).toBe(false);
      expect(mockScene.events.emit).toHaveBeenCalledWith('wave-complete');
    });
  });

  describe('reset', () => {
    it('should reset wave state', () => {
      waveController.startWave();

      waveController.reset();

      expect(waveController.isWaveActive()).toBe(false);
    });
  });
});

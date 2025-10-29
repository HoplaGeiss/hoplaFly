import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class WaveController {
  private waveActive: boolean = false;
  private enemiesSpawned: number = 0;
  private enemiesToSpawn: number = 0;
  private lastSpawnTime: number = 0;
  private spawnDelay: number = 300; // faster enemy spawning
  private currentWave: number = 1;
  private totalWaves: number = TD_CONFIG.WAVES.TOTAL_WAVES;

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    this.waveActive = false;
    this.enemiesSpawned = 0;
    this.enemiesToSpawn = 0;
    this.currentWave = 1;
    this.emitWaveUpdate();
  }

  startWave(): void {
    if (this.waveActive) return;

    const waveConfig = this.getCurrentWaveConfig();
    this.waveActive = true;
    this.enemiesToSpawn = waveConfig.enemies;
    this.enemiesSpawned = 0;
    this.lastSpawnTime = 0;

    this.scene.events.emit('wave-start');
  }

  update(enemyManager: any): void {
    // Spawn enemies
    if (this.waveActive && this.enemiesSpawned < this.enemiesToSpawn) {
      if (Date.now() - this.lastSpawnTime >= this.spawnDelay) {
        const waveConfig = this.getCurrentWaveConfig();
        enemyManager.spawnEnemy(waveConfig.health, waveConfig.speed);
        this.enemiesSpawned++;
        this.lastSpawnTime = Date.now();
      }
    }

    // Check wave completion
    this.checkWaveComplete(enemyManager);
  }

  private checkWaveComplete(enemyManager: any): void {
    if (!this.waveActive) return;

    const activeEnemies = enemyManager.getActiveEnemies();
    if (activeEnemies.length === 0 && this.enemiesSpawned >= this.enemiesToSpawn) {
      this.waveActive = false;
      this.enemiesSpawned = 0;
      this.enemiesToSpawn = 0;

      // Check if all waves completed
      if (this.currentWave >= this.totalWaves) {
        this.scene.events.emit('game-victory');
      } else {
        this.currentWave++;
        this.emitWaveUpdate();
        this.scene.events.emit('wave-complete');
      }
    }
  }

  isWaveActive(): boolean {
    return this.waveActive;
  }

  reset(): void {
    this.waveActive = false;
    this.enemiesSpawned = 0;
    this.enemiesToSpawn = 0;
    this.currentWave = 1;
    this.emitWaveUpdate();
  }

  getCurrentWaveConfig(): any {
    return TD_CONFIG.WAVES.WAVE_CONFIGS[this.currentWave - 1];
  }

  getCurrentWave(): number {
    return this.currentWave;
  }

  getTotalWaves(): number {
    return this.totalWaves;
  }

  private emitWaveUpdate(): void {
    this.scene.events.emit('wave-number-update', this.currentWave, this.totalWaves);
  }
}

import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class WaveController {
  private waveActive: boolean = false;
  private enemiesSpawned: number = 0;
  private enemiesToSpawn: number = 0;
  private lastSpawnTime: number = 0;
  private spawnDelay: number = 300; // faster enemy spawning

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    this.waveActive = false;
    this.enemiesSpawned = 0;
    this.enemiesToSpawn = 0;
  }

  startWave(): void {
    if (this.waveActive) return;

    this.waveActive = true;
    this.enemiesToSpawn = TD_CONFIG.GAME.WAVE_SIZE;
    this.enemiesSpawned = 0;
    this.lastSpawnTime = 0;

    this.scene.events.emit('wave-start');
  }

  update(enemyManager: any): void {
    // Spawn enemies
    if (this.waveActive && this.enemiesSpawned < this.enemiesToSpawn) {
      if (Date.now() - this.lastSpawnTime >= this.spawnDelay) {
        enemyManager.spawnEnemy();
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
      this.scene.events.emit('wave-complete');
    }
  }

  isWaveActive(): boolean {
    return this.waveActive;
  }

  reset(): void {
    this.waveActive = false;
    this.enemiesSpawned = 0;
    this.enemiesToSpawn = 0;
  }
}

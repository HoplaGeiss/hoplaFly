import * as Phaser from 'phaser';
import { TD_CONFIG, getResponsivePath } from '../config/td-config';
import { Enemy } from '../entities/enemy';

export class EnemyManager {
  private enemies: Enemy[] = [];
  private lives: number = TD_CONFIG.GAME.STARTING_LIVES;
  private path: any[] = [];

  constructor(private scene: Phaser.Scene) {
    this.updatePathForScreenSize();
  }

  create(): void {
    this.lives = TD_CONFIG.GAME.STARTING_LIVES;
    this.scene.events.emit('lives-update', this.lives);
    this.updatePathForScreenSize();
  }

  private updatePathForScreenSize(): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    this.path = getResponsivePath(width, height);
  }

  spawnEnemy(): void {
    const startPoint = this.path[0];
    const enemy = new Enemy(this.scene, startPoint.x, startPoint.y);
    this.enemies.push(enemy);
  }

  update(): void {
    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy.active) {
        this.enemies.splice(i, 1);
        continue;
      }

      enemy.update(this.path);

      // Check if enemy reached the end
      if (enemy.pathIndex >= this.path.length - 1) {
        this.loseLife();
        enemy.die();
      }
    }
  }

  private loseLife(): void {
    this.lives--;
    this.scene.events.emit('lives-update', this.lives);

    if (this.lives <= 0) {
      this.scene.events.emit('game-over');
    }
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  getActiveEnemies(): Enemy[] {
    return this.enemies.filter(enemy => enemy.active);
  }

  getLives(): number {
    return this.lives;
  }

  reset(): void {
    // Clear all enemies
    this.enemies.forEach(enemy => enemy.die());
    this.enemies = [];
    this.lives = TD_CONFIG.GAME.STARTING_LIVES;
    this.scene.events.emit('lives-update', this.lives);
  }
}

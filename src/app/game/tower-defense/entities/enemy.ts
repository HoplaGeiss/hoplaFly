import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class Enemy {
  public scene: Phaser.Scene;
  public x: number;
  public y: number;
  public sprite!: Phaser.GameObjects.Graphics;
  public healthBar!: Phaser.GameObjects.Graphics;
  public maxHealth: number;
  public currentHealth: number;
  public speed: number;
  public pathIndex: number = 0;
  public active: boolean = true;
  public reward: number;

  constructor(scene: Phaser.Scene, x: number, y: number, customHealth?: number, customSpeed?: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.maxHealth = customHealth || TD_CONFIG.ENEMY.HEALTH;
    this.currentHealth = this.maxHealth;
    this.speed = customSpeed || TD_CONFIG.ENEMY.SPEED;
    this.reward = TD_CONFIG.ENEMY.REWARD;
    this.createSprite();
    this.createHealthBar();
  }

  private createSprite(): void {
    this.sprite = this.scene.add.graphics();
    this.sprite.fillStyle(0xff0000);
    this.sprite.fillCircle(0, 0, TD_CONFIG.ENEMY.SIZE / 2);
    this.sprite.setPosition(this.x, this.y);
    this.sprite.setDepth(12);
  }

  private createHealthBar(): void {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
    this.healthBar.setDepth(13);
  }

  private updateHealthBar(): void {
    this.healthBar.clear();

    // Background (red)
    this.healthBar.fillStyle(0xff0000, 0.5);
    this.healthBar.fillRect(-15, -20, 30, 4);

    // Health (green)
    const healthPercent = this.currentHealth / this.maxHealth;
    this.healthBar.fillStyle(0x00ff00);
    this.healthBar.fillRect(-15, -20, 30 * healthPercent, 4);

    this.healthBar.setPosition(this.x, this.y);
  }

  public takeDamage(damage: number): void {
    this.currentHealth -= damage;
    this.updateHealthBar();

    if (this.currentHealth <= 0) {
      this.die();
    }
  }

  public die(): void {
    this.active = false;
    this.sprite.destroy();
    this.healthBar.destroy();
  }

  public moveAlongPath(path: any[]): void {
    if (this.pathIndex >= path.length - 1) {
      this.reachEnd();
      return;
    }

    const currentPoint = path[this.pathIndex];
    const nextPoint = path[this.pathIndex + 1];

    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      nextPoint.x, nextPoint.y
    );

    if (distance < 5) {
      this.pathIndex++;
      return;
    }

    // Move towards next point
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      nextPoint.x, nextPoint.y
    );

    this.x += Math.cos(angle) * this.speed * (this.scene.game.loop.delta / 1000);
    this.y += Math.sin(angle) * this.speed * (this.scene.game.loop.delta / 1000);

    this.sprite.setPosition(this.x, this.y);
    this.updateHealthBar();
  }

  public reachEnd(): void {
    this.active = false;
    this.sprite.destroy();
    this.healthBar.destroy();
    // This will be handled by the game scene to reduce lives
  }

  public update(path: any[]): void {
    if (!this.active) return;
    this.moveAlongPath(path);
  }
}

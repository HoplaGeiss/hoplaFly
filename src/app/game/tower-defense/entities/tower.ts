import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export type TowerType = keyof typeof TD_CONFIG.TOWER_TYPES;

export class Tower {
  public scene: Phaser.Scene;
  public x: number;
  public y: number;
  public sprite!: Phaser.GameObjects.Graphics;
  public rangeCircle!: Phaser.GameObjects.Graphics;
  public lastFireTime: number = 0;
  public target: any = null;
  public towerType: TowerType;
  public config: typeof TD_CONFIG.TOWER_TYPES[TowerType];

  constructor(scene: Phaser.Scene, x: number, y: number, towerType: TowerType = 'QUICK_FIRE') {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.towerType = towerType;
    this.config = TD_CONFIG.TOWER_TYPES[towerType];
    this.createSprite();
    this.createRangeIndicator();
  }

  private createSprite(): void {
    this.sprite = this.scene.add.graphics();
    this.sprite.fillStyle(this.config.color);
    this.sprite.fillRect(
      -this.config.size / 2,
      -this.config.size / 2,
      this.config.size,
      this.config.size
    );
    this.sprite.setPosition(this.x, this.y);
    this.sprite.setDepth(10);
  }

  private createRangeIndicator(): void {
    this.rangeCircle = this.scene.add.graphics();
    this.rangeCircle.lineStyle(2, 0x00ff00, 0.3);
    this.rangeCircle.strokeCircle(0, 0, this.config.range);
    this.rangeCircle.setPosition(this.x, this.y);
    this.rangeCircle.setDepth(5);
    this.rangeCircle.setVisible(false);
  }

  public showRange(): void {
    this.rangeCircle.setVisible(true);
  }

  public hideRange(): void {
    this.rangeCircle.setVisible(false);
  }

  public canFire(): boolean {
    return Date.now() - this.lastFireTime >= this.config.fireRate;
  }

  public findTarget(enemies: any[]): any {
    let closestEnemy = null;
    let closestDistance = this.config.range;

    for (const enemy of enemies) {
      if (!enemy.active) continue;

      const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (distance <= this.config.range && distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    }

    return closestEnemy;
  }

  public fire(target: any): void {
    if (!this.canFire() || !target) return;

    this.lastFireTime = Date.now();
    this.target = target;

    // Create projectile
    const projectile = this.scene.add.graphics();
    projectile.fillStyle(this.config.color);
    projectile.fillCircle(0, 0, 4);
    projectile.setPosition(this.x, this.y);
    projectile.setDepth(15);

    // Move projectile towards target
    this.scene.tweens.add({
      targets: projectile,
      x: target.x,
      y: target.y,
      duration: 300, // faster projectiles
      ease: 'Linear',
      onComplete: () => {
        projectile.destroy();
        if (target && target.active) {
          const wasAlive = target.currentHealth > 0;
          target.takeDamage(this.config.damage);

          // Handle splash damage for splash tower type
          if (this.towerType === 'SPLASH_DAMAGE' && 'splashRadius' in this.config) {
            this.handleSplashDamage(target.x, target.y, this.config.splashRadius);
          }

          // If enemy died from this damage, give gold reward
          if (wasAlive && !target.active) {
            this.scene.events.emit('enemy-killed', target.reward);
          }
        }
      }
    });
  }

  private handleSplashDamage(centerX: number, centerY: number, radius: number): void {
    // Find all enemies within splash radius
    const enemies = this.scene.children.list.filter(child =>
      child.constructor.name === 'Enemy' && child.active
    ) as any[];

    enemies.forEach(enemy => {
      const distance = Phaser.Math.Distance.Between(centerX, centerY, enemy.x, enemy.y);
      if (distance <= radius) {
        const wasAlive = enemy.currentHealth > 0;
        enemy.takeDamage(Math.floor(this.config.damage * 0.5)); // 50% damage for splash

        if (wasAlive && !enemy.active) {
          this.scene.events.emit('enemy-killed', enemy.reward);
        }
      }
    });
  }

  public update(enemies: any[]): void {
    if (!this.canFire()) return;

    const target = this.findTarget(enemies);
    if (target) {
      this.fire(target);
    }
  }

  public destroy(): void {
    this.sprite.destroy();
    this.rangeCircle.destroy();
  }
}

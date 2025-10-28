import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class Tower {
  public scene: Phaser.Scene;
  public x: number;
  public y: number;
  public sprite!: Phaser.GameObjects.Graphics;
  public rangeCircle!: Phaser.GameObjects.Graphics;
  public lastFireTime: number = 0;
  public target: any = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.createSprite();
    this.createRangeIndicator();
  }

  private createSprite(): void {
    this.sprite = this.scene.add.graphics();
    this.sprite.fillStyle(TD_CONFIG.TOWER.COLOR || 0x0066ff);
    this.sprite.fillRect(
      -TD_CONFIG.TOWER.SIZE / 2,
      -TD_CONFIG.TOWER.SIZE / 2,
      TD_CONFIG.TOWER.SIZE,
      TD_CONFIG.TOWER.SIZE
    );
    this.sprite.setPosition(this.x, this.y);
    this.sprite.setDepth(10);
  }

  private createRangeIndicator(): void {
    this.rangeCircle = this.scene.add.graphics();
    this.rangeCircle.lineStyle(2, 0x00ff00, 0.3);
    this.rangeCircle.strokeCircle(0, 0, TD_CONFIG.TOWER.RANGE);
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
    return Date.now() - this.lastFireTime >= TD_CONFIG.TOWER.FIRE_RATE;
  }

  public findTarget(enemies: any[]): any {
    let closestEnemy = null;
    let closestDistance = TD_CONFIG.TOWER.RANGE;

    for (const enemy of enemies) {
      if (!enemy.active) continue;

      const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (distance <= TD_CONFIG.TOWER.RANGE && distance < closestDistance) {
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
    projectile.fillStyle(0xffff00);
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
          target.takeDamage(TD_CONFIG.TOWER.DAMAGE);
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

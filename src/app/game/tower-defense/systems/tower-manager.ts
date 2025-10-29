import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';
import { Tower, TowerType } from '../entities/tower';

export class TowerManager {
  private towers: Tower[] = [];
  private gold: number = TD_CONFIG.GAME.STARTING_GOLD;

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    // Initialize with starting gold
    this.gold = TD_CONFIG.GAME.STARTING_GOLD;

    // Listen for enemy killed events to give gold rewards
    this.scene.events.on('enemy-killed', (reward: number) => {
      this.addGold(reward);
    });
  }

  canPlaceTower(x: number, y: number, pathRenderer: any, towerType: TowerType = 'QUICK_FIRE'): boolean {
    // Check if position is on path
    if (pathRenderer.isOnPath(x, y)) {
      return false;
    }

    // Check if position is already occupied
    const towerConfig = TD_CONFIG.TOWER_TYPES[towerType];
    for (const tower of this.towers) {
      if (Phaser.Math.Distance.Between(x, y, tower.x, tower.y) < towerConfig.size) {
        return false;
      }
    }

    // Check if player has enough gold
    return this.gold >= towerConfig.cost;
  }

  placeTower(x: number, y: number, pathRenderer: any, towerType: TowerType = 'QUICK_FIRE'): boolean {
    if (!this.canPlaceTower(x, y, pathRenderer, towerType)) return false;

    const tower = new Tower(this.scene, x, y, towerType);
    this.towers.push(tower);

    const towerConfig = TD_CONFIG.TOWER_TYPES[towerType];
    this.gold -= towerConfig.cost;

    // Emit gold update event
    this.scene.events.emit('gold-update', this.gold);

    return true;
  }

  update(enemies: any[]): void {
    // Update all towers
    for (const tower of this.towers) {
      tower.update(enemies);
    }
  }

  getTowers(): Tower[] {
    return this.towers;
  }

  getGold(): number {
    return this.gold;
  }

  addGold(amount: number): void {
    this.gold += amount;
    this.scene.events.emit('gold-update', this.gold);
  }

  reset(): void {
    // Clear all towers
    this.towers.forEach(tower => tower.destroy());
    this.towers = [];
    this.gold = TD_CONFIG.GAME.STARTING_GOLD;
    this.scene.events.emit('gold-update', this.gold);
  }
}

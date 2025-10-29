import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class GridSystem {
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private hoveredCell: { x: number; y: number } | null = null;

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    this.gridGraphics = this.scene.add.graphics();
    this.gridGraphics.setDepth(2);
  }

  getGridCell(x: number, y: number): { x: number; y: number } | null {
    const cellX = Math.floor(x / TD_CONFIG.GRID.CELL_SIZE) * TD_CONFIG.GRID.CELL_SIZE + TD_CONFIG.GRID.CELL_SIZE / 2;
    const cellY = Math.floor(y / TD_CONFIG.GRID.CELL_SIZE) * TD_CONFIG.GRID.CELL_SIZE + TD_CONFIG.GRID.CELL_SIZE / 2;

    return { x: cellX, y: cellY };
  }

  setHoveredCell(cell: { x: number; y: number } | null): void {
    this.hoveredCell = cell;
    // updateGridPreview will be called with proper canPlace parameter from the main scene
  }

  updateGridPreview(canPlace: boolean): void {
    this.gridGraphics.clear();

    if (!this.hoveredCell) return;

    const { x, y } = this.hoveredCell;

    this.gridGraphics.fillStyle(canPlace ? 0x00ff00 : 0xff0000, 0.3);
    this.gridGraphics.fillRect(
      x - TD_CONFIG.GRID.CELL_SIZE / 2,
      y - TD_CONFIG.GRID.CELL_SIZE / 2,
      TD_CONFIG.GRID.CELL_SIZE,
      TD_CONFIG.GRID.CELL_SIZE
    );
  }

  clearPreview(): void {
    this.gridGraphics.clear();
    this.hoveredCell = null;
  }
}

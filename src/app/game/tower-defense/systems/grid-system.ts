import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class GridSystem {
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private hoveredCell: { x: number; y: number } | null = null;
  private selectedCell: { x: number; y: number } | null = null;
  private gridWidth: number = 0;
  private gridHeight: number = 0;
  private gridCols: number = 0;
  private gridRows: number = 0;

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    this.gridGraphics = this.scene.add.graphics();
    this.gridGraphics.setDepth(2);

    // Calculate grid dimensions
    this.gridWidth = this.scene.scale.width;
    this.gridHeight = this.scene.scale.height;
    this.gridCols = Math.floor(this.gridWidth / TD_CONFIG.GRID.CELL_SIZE);
    this.gridRows = Math.floor(this.gridHeight / TD_CONFIG.GRID.CELL_SIZE);
  }

  getGridCell(x: number, y: number): { x: number; y: number } | null {
    // Snap to grid cell center
    const cellX = Math.floor(x / TD_CONFIG.GRID.CELL_SIZE) * TD_CONFIG.GRID.CELL_SIZE + TD_CONFIG.GRID.CELL_SIZE / 2;
    const cellY = Math.floor(y / TD_CONFIG.GRID.CELL_SIZE) * TD_CONFIG.GRID.CELL_SIZE + TD_CONFIG.GRID.CELL_SIZE / 2;

    // Check if within bounds
    if (cellX < TD_CONFIG.GRID.CELL_SIZE / 2 || cellX >= this.gridWidth - TD_CONFIG.GRID.CELL_SIZE / 2 ||
        cellY < TD_CONFIG.GRID.CELL_SIZE / 2 || cellY >= this.gridHeight - TD_CONFIG.GRID.CELL_SIZE / 2) {
      return null;
    }

    return { x: cellX, y: cellY };
  }

  getGridCellIndex(x: number, y: number): { col: number; row: number } | null {
    const col = Math.floor(x / TD_CONFIG.GRID.CELL_SIZE);
    const row = Math.floor(y / TD_CONFIG.GRID.CELL_SIZE);

    if (col < 0 || col >= this.gridCols || row < 0 || row >= this.gridRows) {
      return null;
    }

    return { col, row };
  }

  setHoveredCell(cell: { x: number; y: number } | null): void {
    this.hoveredCell = cell;
    // updateGridPreview will be called with proper canPlace parameter from the main scene
  }

  updateGridPreview(canPlace: boolean): void {
    this.gridGraphics.clear();

    // Draw selected cell (blue highlight)
    if (this.selectedCell) {
      const { x, y } = this.selectedCell;
      this.gridGraphics.fillStyle(0x0066ff, 0.5);
      this.gridGraphics.fillRect(
        x - TD_CONFIG.GRID.CELL_SIZE / 2,
        y - TD_CONFIG.GRID.CELL_SIZE / 2,
        TD_CONFIG.GRID.CELL_SIZE,
        TD_CONFIG.GRID.CELL_SIZE
      );
      this.gridGraphics.lineStyle(2, 0x0066ff, 1.0);
      this.gridGraphics.strokeRect(
        x - TD_CONFIG.GRID.CELL_SIZE / 2,
        y - TD_CONFIG.GRID.CELL_SIZE / 2,
        TD_CONFIG.GRID.CELL_SIZE,
        TD_CONFIG.GRID.CELL_SIZE
      );
    }

    // Draw hovered cell (green/red preview)
    if (this.hoveredCell && !this.selectedCell) {
      const { x, y } = this.hoveredCell;
      this.gridGraphics.fillStyle(canPlace ? 0x00ff00 : 0xff0000, 0.3);
      this.gridGraphics.fillRect(
        x - TD_CONFIG.GRID.CELL_SIZE / 2,
        y - TD_CONFIG.GRID.CELL_SIZE / 2,
        TD_CONFIG.GRID.CELL_SIZE,
        TD_CONFIG.GRID.CELL_SIZE
      );
    }
  }

  setSelectedCell(cell: { x: number; y: number } | null): void {
    this.selectedCell = cell;
  }

  clearPreview(): void {
    this.gridGraphics.clear();
    this.hoveredCell = null;
    this.selectedCell = null;
  }
}

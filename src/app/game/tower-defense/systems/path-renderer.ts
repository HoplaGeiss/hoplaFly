import * as Phaser from 'phaser';
import { TD_CONFIG, getResponsivePath, getResponsivePathWidth } from '../config/td-config';

export class PathRenderer {
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private path: any[] = [];
  private pathWidth: number = TD_CONFIG.PATH.WIDTH;

  constructor(private scene: Phaser.Scene) {
    // Initialize with responsive path based on current screen size
    this.updatePathForScreenSize();
  }

  create(): void {
    this.pathGraphics = this.scene.add.graphics();
    this.pathGraphics.fillStyle(0x666666);

    this.drawPath();
    this.pathGraphics.setDepth(1);
  }

  private drawPath(): void {
    this.pathGraphics.clear();

    if (this.path.length < 2) return;

    // Draw continuous path with smooth corners
    this.pathGraphics.lineStyle(this.pathWidth, 0x666666);
    this.pathGraphics.beginPath();

    // Start at first point
    this.pathGraphics.moveTo(this.path[0].x, this.path[0].y);

    // Draw lines to all subsequent points
    for (let i = 1; i < this.path.length; i++) {
      this.pathGraphics.lineTo(this.path[i].x, this.path[i].y);
    }

    // Stroke the entire path at once for smooth connections
    this.pathGraphics.strokePath();
  }

  updatePathForScreenSize(): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    this.path = getResponsivePath(width, height);
    this.pathWidth = getResponsivePathWidth(width);

    // Redraw path if graphics already created
    if (this.pathGraphics) {
      this.drawPath();
    }
  }

  isOnPath(x: number, y: number): boolean {
    // Check if a grid cell center is on the path
    // Use path width to determine if the cell overlaps with the path
    const cellSize = TD_CONFIG.GRID.CELL_SIZE;
    const minDistance = this.pathWidth / 2;

    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i];
      const end = this.path[i + 1];

      // Calculate distance from cell center to line segment
      const distanceToLine = this.distanceToLineSegment(x, y, start.x, start.y, end.x, end.y);

      if (distanceToLine < minDistance) {
        return true;
      }
    }
    return false;
  }

  isGridCellOnPath(cellX: number, cellY: number): boolean {
    // Check if a grid cell overlaps with the path
    // Allow towers to be placed close to path but prevent visual overlap
    const cellSize = TD_CONFIG.GRID.CELL_SIZE;
    const halfCell = cellSize / 2;

    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i];
      const end = this.path[i + 1];

      // Check distance from cell center to path line
      const distanceToLine = this.distanceToLineSegment(cellX, cellY, start.x, start.y, end.x, end.y);

      // Cell is on path if it overlaps with the path width
      // Use path width + small buffer to prevent visual overlap
      const minDistance = (this.pathWidth / 2) + 5; // Small 5px buffer

      if (distanceToLine < minDistance) {
        return true;
      }
    }
    return false;
  }

  getPath(): any[] {
    return this.path;
  }

  private distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

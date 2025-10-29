import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class PathRenderer {
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private path: any[] = [];

  constructor(private scene: Phaser.Scene) {
    this.path = TD_CONFIG.PATH.POINTS;
  }

  create(): void {
    this.pathGraphics = this.scene.add.graphics();
    this.pathGraphics.fillStyle(0x666666);

    // Draw continuous path using thick line segments
    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i];
      const end = this.path[i + 1];

      // Draw thick line segment
      this.pathGraphics.lineStyle(TD_CONFIG.PATH.WIDTH, 0x666666);
      this.pathGraphics.beginPath();
      this.pathGraphics.moveTo(start.x, start.y);
      this.pathGraphics.lineTo(end.x, end.y);
      this.pathGraphics.strokePath();
    }

    this.pathGraphics.setDepth(1);
  }

  isOnPath(x: number, y: number): boolean {
    // Check if position is on path using line-to-point distance
    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i];
      const end = this.path[i + 1];

      // Calculate distance from point to line segment
      const distanceToLine = this.distanceToLineSegment(x, y, start.x, start.y, end.x, end.y);

      if (distanceToLine < TD_CONFIG.PATH.WIDTH / 2) {
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

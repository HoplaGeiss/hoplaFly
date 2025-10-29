import * as Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config/game-constants';

export class PathManager {
  private pathY: number = 0;
  private pathOffset: number = 0;
  private pathOffsetTarget: number = 0;
  private pathHeight: number = GAME_CONSTANTS.PATH_HEIGHT_TARGET;
  private pathHeightTarget: number = GAME_CONSTANTS.PATH_HEIGHT_TARGET;
  private centreY: number = 0;

  constructor(private scene: Phaser.Scene) {
    this.centreY = scene.scale.height * 0.5;
  }

  create(): void {
    this.pathHeight = GAME_CONSTANTS.PATH_HEIGHT_MAX;
    this.randomPath();
  }

  update(): void {
    this.updatePath();
  }

  randomPath(): void {
    this.pathOffsetTarget = Phaser.Math.RND.between(-GAME_CONSTANTS.PATH_OFFSET_MAX, GAME_CONSTANTS.PATH_OFFSET_MAX);
    this.pathHeightTarget = Phaser.Math.RND.between(GAME_CONSTANTS.PATH_HEIGHT_MIN, GAME_CONSTANTS.PATH_HEIGHT_MAX);
  }

  getPathY(): number {
    return this.pathY;
  }

  getPathHeight(): number {
    return this.pathHeight;
  }

  private updatePath(): void {
    const d1 = this.pathOffsetTarget - this.pathOffset;
    const d2 = this.pathHeightTarget - this.pathHeight;

    this.pathOffset += d1 * 0.01;
    this.pathHeight += d2 * 0.01;

    this.pathY = this.centreY + this.pathOffset;
  }
}

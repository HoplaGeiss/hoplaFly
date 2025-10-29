import * as Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config/game-constants';

export class ObstacleSystem {
  private obstacleGroup!: Phaser.GameObjects.Group;
  private spikeDistance: number = 0;
  private spikeDistanceMax: number = GAME_CONSTANTS.SPIKE_DISTANCE_MAX;
  private backgroundSpeed: number = GAME_CONSTANTS.BACKGROUND_SPEED;

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    this.obstacleGroup = this.scene.add.group();
  }

  update(): void {
    this.spikeDistance += this.backgroundSpeed;

    if (this.spikeDistance > this.spikeDistanceMax) {
      this.spikeDistance -= this.spikeDistanceMax;
      // Note: addSpike will be called from the main game scene with proper pathY and pathHeight
    }

    // Move obstacles and clean up off-screen ones
    this.obstacleGroup.getChildren().forEach((obstacle) => {
      const sprite = obstacle as Phaser.Physics.Arcade.Sprite;
      sprite.x -= this.backgroundSpeed;
      sprite.refreshBody();

      // Remove obstacles that are off-screen
      if (sprite.x + sprite.width < 0) {
        sprite.destroy();
      }
    });
  }

  shouldAddSpike(): boolean {
    return this.spikeDistance > this.spikeDistanceMax;
  }

  addSpike(pathY: number, pathHeight: number): void {
    this.spikeDistance -= this.spikeDistanceMax;
    const spikeTop = this.scene.physics.add
      .staticSprite(this.scene.scale.width + 50, pathY - pathHeight, 'spikes')
      .setFlipY(true);
    const spikeBottom = this.scene.physics.add.staticSprite(
      this.scene.scale.width + 50,
      pathY + pathHeight,
      'spikes'
    );
    this.obstacleGroup.add(spikeTop);
    this.obstacleGroup.add(spikeBottom);
  }

  getObstacleGroup(): Phaser.GameObjects.Group {
    return this.obstacleGroup;
  }

  clearObstacles(): void {
    if (this.obstacleGroup) {
      this.obstacleGroup.clear(true, true);
    }
    this.spikeDistance = 0;
  }

  reset(): void {
    this.clearObstacles();
  }
}

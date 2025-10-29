import * as Phaser from 'phaser';
import { ASSETS } from '../../config/assets.config';
import { ANIMATION } from '../../config/animation.config';
import { GAME_CONSTANTS } from '../config/game-constants';

export class CoinSystem {
  private coinGroup!: Phaser.GameObjects.Group;
  private coinDistance: number = 0;
  private coinDistanceMax: number = GAME_CONSTANTS.COIN_DISTANCE_MAX;
  private backgroundSpeed: number = GAME_CONSTANTS.BACKGROUND_SPEED;

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    this.coinGroup = this.scene.add.group();
  }

  update(): void {
    this.coinDistance += this.backgroundSpeed;

    if (this.coinDistance > this.coinDistanceMax) {
      this.coinDistance -= this.coinDistanceMax;
      // Note: addCoin will be called from the main game scene with proper pathY
    }

    // Move coins and clean up off-screen ones
    this.coinGroup.getChildren().forEach((coin) => {
      const sprite = coin as Phaser.Physics.Arcade.Sprite;
      sprite.x -= this.backgroundSpeed;
      sprite.refreshBody();

      // Remove coins that are off-screen
      if (sprite.x + sprite.width < 0) {
        sprite.destroy();
      }
    });
  }

  shouldAddCoin(): boolean {
    return this.coinDistance > this.coinDistanceMax;
  }

  addCoin(pathY: number): void {
    this.coinDistance -= this.coinDistanceMax;
    const coin = this.scene.physics.add.staticSprite(
      this.scene.scale.width + 50,
      pathY,
      ASSETS.spritesheet.coin.key
    );
    coin.anims.play(ANIMATION.coin.key, true);
    this.coinGroup.add(coin);
  }

  getCoinGroup(): Phaser.GameObjects.Group {
    return this.coinGroup;
  }

  clearCoins(): void {
    if (this.coinGroup) {
      this.coinGroup.clear(true, true);
    }
    this.coinDistance = 0;
  }

  reset(): void {
    this.clearCoins();
  }
}

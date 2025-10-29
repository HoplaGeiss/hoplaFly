import * as Phaser from 'phaser';
import { ASSETS } from '../../config/assets.config';
import { ANIMATION } from '../../config/animation.config';
import { GAME_CONSTANTS } from '../config/game-constants';

export class PlayerController {
  private player!: Phaser.Physics.Arcade.Sprite;
  private gameStarted: boolean = false;
  private centreX: number = 0;
  private centreY: number = 0;

  constructor(private scene: Phaser.Scene) {
    this.centreX = scene.scale.width * 0.5;
    this.centreY = scene.scale.height * 0.5;
  }

  create(): void {
    this.initPlayer();
    this.initAnimations();
  }

  startGame(): void {
    this.gameStarted = true;
    this.scene.physics.resume();
  }

  fly(): void {
    this.player.setVelocityY(GAME_CONSTANTS.FLY_VELOCITY);
  }

  isGameStarted(): boolean {
    return this.gameStarted;
  }

  getPlayer(): Phaser.Physics.Arcade.Sprite {
    return this.player;
  }

  isPlayerOutOfBounds(): boolean {
    return this.player && (this.player.y > this.scene.scale.height || this.player.y < 0);
  }

  resetPlayer(): void {
    if (this.player) {
      this.player.setPosition(this.centreX, this.centreY);
      this.player.setScale(1);
      this.player.setAlpha(1);
      this.player.setVelocity(0, 0);
    }
    this.gameStarted = false;
  }

  setPlayerPosition(x: number, y: number): void {
    if (this.player) {
      this.player.setPosition(x, y);
    }
  }

  private initPlayer(): void {
    this.player = this.scene.physics.add
      .sprite(200, this.centreY, ASSETS.spritesheet.bat.key)
      .setDepth(100)
      .setCollideWorldBounds(true);
    this.player.anims.play(ANIMATION.bat.key, true);
  }

  private initAnimations(): void {
    this.scene.anims.create({
      key: ANIMATION.bat.key,
      frames: this.scene.anims.generateFrameNumbers(ANIMATION.bat.texture),
      frameRate: ANIMATION.bat.frameRate,
      repeat: ANIMATION.bat.repeat,
    });
  }
}

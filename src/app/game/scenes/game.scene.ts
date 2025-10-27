import * as Phaser from 'phaser';
import { ASSETS } from '../config/assets.config';
import { ANIMATION } from '../config/animation.config';

export class Game extends Phaser.Scene {
  private centreX: number = 0;
  private centreY: number = 0;
  private pathY: number = 0;
  private pathOffset: number = 0;
  private pathOffsetTarget: number = 0;
  private pathOffsetMax: number = 100;
  private pathHeight: number = 300;
  private pathHeightTarget: number = 300;
  private pathHeightMin: number = 50;
  private pathHeightMax: number = 200;

  private score: number = 0;
  private distance: number = 0;
  private distanceMax: number = 200;
  private flyVelocity: number = -200;
  private backgroundSpeed: number = 1;
  private coinDistance: number = 0;
  private coinDistanceMax: number = 50;
  private spikeDistance: number = 0;
  private spikeDistanceMax: number = 18;

  private gameStarted: boolean = false;

  private background1!: Phaser.GameObjects.Image;
  private background2!: Phaser.GameObjects.Image;
  private tutorialText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacleGroup!: Phaser.GameObjects.Group;
  private coinGroup!: Phaser.GameObjects.Group;

  constructor() {
    super('Game');
  }

  create(): void {
    this.centreX = this.scale.width * 0.5;
    this.centreY = this.scale.height * 0.5;
    this.pathHeight = this.pathHeightMax;

    this.cameras.main.setBackgroundColor(0x00ff00);

    this.background1 = this.add.image(0, 0, 'background').setOrigin(0);
    this.background2 = this.add.image(this.background1.width, 0, 'background').setOrigin(0);

    // Create tutorial text
    this.tutorialText = this.add
      .text(this.centreX, this.centreY, 'Tap to fly!', {
        fontFamily: 'Arial Black',
        fontSize: 42,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    // Create score text
    this.scoreText = this.add
      .text(this.centreX, 50, 'Score: 0', {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.initAnimations();
    this.initPlayer();
    this.initInput();
    this.initPhysics();
  }

  override update(): void {
    this.background1.x -= this.backgroundSpeed;
    this.background2.x -= this.backgroundSpeed;

    if (this.background1.x + this.background1.width < 0) {
      this.background1.x += this.background1.width * 2;
    }

    if (this.background2.x + this.background2.width < 0) {
      this.background2.x += this.background2.width * 2;
    }

    if (!this.gameStarted) return;

    this.distance += this.backgroundSpeed;
    this.coinDistance += this.backgroundSpeed;
    this.spikeDistance += this.backgroundSpeed;

    if (this.distance > this.distanceMax) {
      this.distance -= this.distanceMax;
      this.randomPath();
    }

    if (this.coinDistance > this.coinDistanceMax) {
      this.coinDistance -= this.coinDistanceMax;
      this.addCoin();
    }

    if (this.spikeDistance > this.spikeDistanceMax) {
      this.spikeDistance -= this.spikeDistanceMax;
      this.addSpike();
    }

    this.coinGroup.getChildren().forEach((coin) => {
      (coin as Phaser.Physics.Arcade.Sprite).x -= this.backgroundSpeed;
      (coin as Phaser.Physics.Arcade.Sprite).refreshBody();
    }, this);

    this.obstacleGroup.getChildren().forEach((obstacle) => {
      (obstacle as Phaser.Physics.Arcade.Sprite).x -= this.backgroundSpeed;
      (obstacle as Phaser.Physics.Arcade.Sprite).refreshBody();
    }, this);

    this.updatePath();
  }

  private randomPath(): void {
    this.pathOffsetTarget = Phaser.Math.RND.between(-this.pathOffsetMax, this.pathOffsetMax);
    this.pathHeightTarget = Phaser.Math.RND.between(this.pathHeightMin, this.pathHeightMax);
  }

  private updatePath(): void {
    const d1 = this.pathOffsetTarget - this.pathOffset;
    const d2 = this.pathHeightTarget - this.pathHeight;

    this.pathOffset += d1 * 0.01;
    this.pathHeight += d2 * 0.01;

    this.pathY = this.centreY + this.pathOffset;
  }

  private initAnimations(): void {
    this.anims.create({
      key: ANIMATION.bat.key,
      frames: this.anims.generateFrameNumbers(ANIMATION.bat.texture),
      frameRate: ANIMATION.bat.frameRate,
      repeat: ANIMATION.bat.repeat,
    });
    this.anims.create({
      key: ANIMATION.coin.key,
      frames: this.anims.generateFrameNumbers(ANIMATION.coin.texture),
      frameRate: ANIMATION.coin.frameRate,
      repeat: ANIMATION.coin.repeat,
    });
  }

  private initPhysics(): void {
    this.obstacleGroup = this.add.group();
    this.coinGroup = this.add.group();

    this.physics.add.overlap(this.player, this.obstacleGroup, this.hitObstacle, undefined, this);
    this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, undefined, this);
  }

  private initPlayer(): void {
    this.player = this.physics.add
      .sprite(200, this.centreY, ASSETS.spritesheet.bat.key)
      .setDepth(100)
      .setCollideWorldBounds(true);
    this.player.anims.play(ANIMATION.bat.key, true);
  }

  private initInput(): void {
    this.physics.pause();
    this.input.once('pointerdown', () => {
      this.startGame();
    });
  }

  private startGame(): void {
    this.gameStarted = true;
    this.physics.resume();
    this.input.on('pointerdown', () => {
      this.fly();
    });

    this.fly();
    this.tutorialText.setVisible(false);
  }

  private addCoin(): void {
    const coin = this.physics.add.staticSprite(
      this.scale.width + 50,
      this.pathY,
      ASSETS.spritesheet.coin.key
    );
    coin.anims.play(ANIMATION.coin.key, true);
    this.coinGroup.add(coin);
  }

  private addSpike(): void {
    const spikeTop = this.physics.add
      .staticSprite(this.scale.width + 50, this.pathY - this.pathHeight, 'spikes')
      .setFlipY(true);
    const spikeBottom = this.physics.add.staticSprite(
      this.scale.width + 50,
      this.pathY + this.pathHeight,
      'spikes'
    );
    this.obstacleGroup.add(spikeTop);
    this.obstacleGroup.add(spikeBottom);
  }

  private fly(): void {
    this.player.setVelocityY(this.flyVelocity);
  }

  private hitObstacle = (player: any, obstacle: any): void => {
    this.gameStarted = false;
    this.physics.pause();

    this.tweens.add({
      targets: this.player,
      scale: 3,
      alpha: 0,
      duration: 1000,
      ease: Phaser.Math.Easing.Expo.Out,
    });

    this.gameOver();
  };

  private collectCoin = (player: any, coin: any): void => {
    coin.destroy();
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  };

  private gameOver(): void {
    this.time.delayedCall(2000, () => {
      this.scene.start('GameOver');
    });
  }
}

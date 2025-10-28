import * as Phaser from 'phaser';
import { ASSETS } from '../../config/assets.config';
import { ANIMATION } from '../../config/animation.config';
import { UserService } from '../../../services/user.service';
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
  private balanceText!: Phaser.GameObjects.Text;
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacleGroup!: Phaser.GameObjects.Group;
  private coinGroup!: Phaser.GameObjects.Group;
  private userService!: UserService;

  constructor() {
    super('Game');
  }


  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    this.centreX = this.scale.width * 0.5;
    this.centreY = this.scale.height * 0.5;
    this.pathHeight = this.pathHeightMax;

    // Handle window resize
    this.scale.on('resize', this.handleResize, this);

    this.cameras.main.setBackgroundColor(0x040218);

    this.background1 = this.add.image(0, 0, 'background').setOrigin(0);
    this.background2 = this.add.image(0, 0, 'background').setOrigin(0);

    // Scale backgrounds to cover full screen
    const scaleX = this.scale.width / this.background1.width;
    const scaleY = this.scale.height / this.background1.height;
    const scale = Math.max(scaleX, scaleY);

    this.background1.setScale(scale);
    this.background2.setScale(scale);

    // Position second background right after the first one
    this.background2.x = this.background1.displayWidth;

    // Center the backgrounds if they're larger than the screen
    const offsetX = (this.background1.displayWidth - this.scale.width) / 2;
    this.background1.x = -offsetX;
    this.background2.x = this.background1.displayWidth - offsetX;

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

    // Create balance text
    const currentBalance = this.userService?.getHoplaTokens() || 0;
    this.balanceText = this.add
      .text(this.centreX, 90, `hoplaTokens: ${currentBalance}`, {
        fontFamily: 'Arial Black',
        fontSize: 24,
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Quit button
    const quitButton = this.add.text(50, 50, 'ESC - Quit', {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0, 0).setDepth(100).setInteractive();

    quitButton.on('pointerdown', () => {
      this.quitToMenu();
    });

    quitButton.on('pointerover', () => {
      quitButton.setBackgroundColor('#888888');
    });

    quitButton.on('pointerout', () => {
      quitButton.setBackgroundColor('#666666');
    });

    this.initAnimations();
    this.initPlayer();
    this.initInput();
    this.initPhysics();

    // Reset game state after everything is initialized
    this.resetGameState();

    // Update balance display with current data
    this.updateBalanceDisplay();
  }

  override update(): void {
    this.background1.x -= this.backgroundSpeed;
    this.background2.x -= this.backgroundSpeed;

    // Check if UserService is now initialized and update balance if needed
    if (this.userService && this.userService.isUserInitialized() && this.balanceText) {
      const currentBalance = this.userService.getHoplaTokens();
      const displayedBalance = this.balanceText.text.match(/hoplaTokens: (\d+)/)?.[1];
      if (displayedBalance !== currentBalance.toString()) {
        this.updateBalanceDisplay();
      }
    }

    if (this.background1.x + this.background1.displayWidth < 0) {
      this.background1.x += this.background1.displayWidth * 2;
    }

    if (this.background2.x + this.background2.displayWidth < 0) {
      this.background2.x += this.background2.displayWidth * 2;
    }

    if (!this.gameStarted) return;

    // Check if player hits the bottom or top of the screen
    if (this.player && (this.player.y > this.scale.height || this.player.y < 0)) {
      this.gameOver();
      return;
    }

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

    // ESC key to quit to menu
    this.input.keyboard?.on('keydown-ESC', () => {
      this.quitToMenu();
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

    // Check for win condition
    if (this.score >= 5) {
      this.gameWon();
    }
  };

  private gameWon(): void {
    this.gameStarted = false;
    this.physics.pause();

    // Add hoplaToken reward with score
    this.userService.addHoplaTokens(1, this.score);

    // Update balance display after adding tokens
    this.updateBalanceDisplay();

    // Add a celebration effect
    this.tweens.add({
      targets: this.player,
      scale: 1.5,
      duration: 500,
      ease: Phaser.Math.Easing.Bounce.Out,
      yoyo: true,
      repeat: 2,
    });

    this.time.delayedCall(2000, () => {
      this.scene.start('Win');
    });
  }

  private updateBalanceDisplay(): void {
    if (this.balanceText && this.userService) {
      const currentBalance = this.userService.getHoplaTokens();
      this.balanceText.setText(`hoplaTokens: ${currentBalance}`);
    }
  }

  private quitToMenu(): void {
    this.scene.stop('Game');
    this.scene.stop('Preloader');
    this.scene.start('MainMenu');
  }


  private handleResize(gameSize: Phaser.Structs.Size): void {
    // Update center positions when screen resizes
    this.centreX = gameSize.width * 0.5;
    this.centreY = gameSize.height * 0.5;

    // Rescale backgrounds to cover full screen
    if (this.background1 && this.background2) {
      const scaleX = gameSize.width / this.background1.width;
      const scaleY = gameSize.height / this.background1.height;
      const scale = Math.max(scaleX, scaleY);

      this.background1.setScale(scale);
      this.background2.setScale(scale);

      // Position second background right after the first one
      this.background2.x = this.background1.displayWidth;

      // Center the backgrounds if they're larger than the screen
      const offsetX = (this.background1.displayWidth - gameSize.width) / 2;
      this.background1.x = -offsetX;
      this.background2.x = this.background1.displayWidth - offsetX;
    }

    // Update UI elements positions
    if (this.tutorialText) {
      this.tutorialText.setPosition(this.centreX, this.centreY);
    }
    if (this.scoreText) {
      this.scoreText.setPosition(this.centreX, 50);
    }
    if (this.balanceText) {
      this.balanceText.setPosition(this.centreX, 90);
    }
    if (this.player) {
      this.player.setPosition(this.centreX, this.centreY);
    }
  }

  private resetGameState(): void {
    // Reset score and game state
    this.score = 0;
    this.gameStarted = false;
    this.distance = 0;
    this.coinDistance = 0;
    this.spikeDistance = 0;

    // Pause physics initially
    this.physics.pause();

    // Clear existing groups
    if (this.obstacleGroup) {
      this.obstacleGroup.clear(true, true);
    }
    if (this.coinGroup) {
      this.coinGroup.clear(true, true);
    }

    // Reset player position and state
    if (this.player) {
      this.player.setPosition(this.centreX, this.centreY);
      this.player.setScale(1);
      this.player.setAlpha(1);
      this.player.setVelocity(0, 0);
    }

    // Reset tutorial text visibility
    if (this.tutorialText) {
      this.tutorialText.setVisible(true);
    }

    // Reset score display
    if (this.scoreText) {
      this.scoreText.setText('Score: 0');
    }

    // Reset input handling
    this.input.removeAllListeners();
    this.input.once('pointerdown', () => {
      this.startGame();
    });

  }

  private gameOver(): void {
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOver');
    });
  }
}

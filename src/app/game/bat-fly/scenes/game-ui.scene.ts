import * as Phaser from 'phaser';
import { UserService } from '../../../services/user.service';
import { GAME_CONSTANTS } from '../config/game-constants';

export class GameUI extends Phaser.Scene {
  private userService!: UserService;
  private centreX: number = 0;
  private centreY: number = 0;
  private tutorialText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private balanceText!: Phaser.GameObjects.Text;
  private quitButton!: Phaser.GameObjects.Text;
  private score: number = 0;

  constructor() {
    super('GameUI');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    this.centreX = this.scale.width * 0.5;
    this.centreY = this.scale.height * 0.5;

    // Handle window resize
    this.scale.on('resize', this.handleResize, this);

    this.createUI();
    this.setupEventListeners();
  }

  private createUI(): void {
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
      .text(this.centreX, GAME_CONSTANTS.SCORE_Y, 'Score: 0', {
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
      .text(this.centreX, GAME_CONSTANTS.BALANCE_Y, `hoplaTokens: ${currentBalance}`, {
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
    this.quitButton = this.add.text(GAME_CONSTANTS.QUIT_BUTTON_X, GAME_CONSTANTS.QUIT_BUTTON_Y, 'ESC - Quit', {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0, 0).setDepth(100).setInteractive();

    this.quitButton.on('pointerdown', () => {
      this.quitToMenu();
    });

    this.quitButton.on('pointerover', () => {
      this.quitButton.setBackgroundColor('#888888');
    });

    this.quitButton.on('pointerout', () => {
      this.quitButton.setBackgroundColor('#666666');
    });
  }

  private setupEventListeners(): void {
    // Listen for game events
    this.events.on('score-update', (score: number) => {
      this.updateScore(score);
    });

    this.events.on('balance-update', () => {
      this.updateBalance();
    });

    this.events.on('game-start', () => {
      this.hideTutorial();
    });

    this.events.on('game-over', () => {
      this.showGameOver();
    });

    this.events.on('game-won', () => {
      this.showGameWon();
    });

    this.events.on('reset-game', () => {
      this.resetUI();
    });
  }

  private updateScore(score: number): void {
    this.score = score;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  private updateBalance(): void {
    if (this.balanceText && this.userService) {
      const currentBalance = this.userService.getHoplaTokens();
      this.balanceText.setText(`hoplaTokens: ${currentBalance}`);
    }
  }

  private hideTutorial(): void {
    this.tutorialText.setVisible(false);
  }

  private showGameOver(): void {
    // Could add game over UI here if needed
  }

  private showGameWon(): void {
    // Could add win UI here if needed
  }

  private resetUI(): void {
    this.score = 0;
    this.scoreText.setText('Score: 0');
    this.tutorialText.setVisible(true);
    this.updateBalance();
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

    // Update UI elements positions
    if (this.tutorialText) {
      this.tutorialText.setPosition(this.centreX, this.centreY);
    }
    if (this.scoreText) {
      this.scoreText.setPosition(this.centreX, GAME_CONSTANTS.SCORE_Y);
    }
    if (this.balanceText) {
      this.balanceText.setPosition(this.centreX, GAME_CONSTANTS.BALANCE_Y);
    }
  }

  override update(): void {
    // Check if UserService is now initialized and update balance if needed
    if (this.userService && this.userService.isUserInitialized() && this.balanceText) {
      const currentBalance = this.userService.getHoplaTokens();
      const displayedBalance = this.balanceText.text.match(/hoplaTokens: (\d+)/)?.[1];
      if (displayedBalance !== currentBalance.toString()) {
        this.updateBalance();
      }
    }
  }
}

import * as Phaser from 'phaser';
import { UserService } from '../../../services/user.service';

export class TDUI extends Phaser.Scene {
  private userService!: UserService;
  private livesText!: Phaser.GameObjects.Text;
  private goldText!: Phaser.GameObjects.Text;
  private balanceText!: Phaser.GameObjects.Text;
  private startWaveButton!: Phaser.GameObjects.Text;
  private quitButton!: Phaser.GameObjects.Text;
  private lives: number = 0;
  private gold: number = 0;

  constructor() {
    super('TDUI');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    // Handle window resize
    this.scale.on('resize', this.handleResize, this);

    this.createUI();
    this.setupEventListeners();
  }

  private createUI(): void {
    // Lives display (top left)
    this.livesText = this.add.text(20, 20, `Lives: ${this.lives}`, {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20);

    // Gold display (top right)
    this.goldText = this.add.text(this.scale.width - 20, 20, `Gold: ${this.gold}`, {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20).setOrigin(1, 0);

    // Balance display (center top)
    const currentBalance = this.userService?.getHoplaTokens() || 0;
    this.balanceText = this.add.text(this.scale.width / 2, 20, `hoplaTokens: ${currentBalance}`, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20).setOrigin(0.5, 0);

    // Start Wave button (center bottom)
    this.startWaveButton = this.add.text(this.scale.width / 2, this.scale.height - 50, 'Start Wave', {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#ffffff',
      backgroundColor: '#0066ff',
      padding: { x: 20, y: 10 }
    }).setDepth(20).setOrigin(0.5).setInteractive();

    this.startWaveButton.on('pointerdown', () => {
      this.scene.get('TDGame')?.events.emit('start-wave');
    });

    this.startWaveButton.on('pointerover', () => {
      this.startWaveButton.setBackgroundColor('#0088ff');
    });

    this.startWaveButton.on('pointerout', () => {
      this.startWaveButton.setBackgroundColor('#0066ff');
    });

    // Quit button (bottom left)
    this.quitButton = this.add.text(20, this.scale.height - 30, 'ESC - Quit', {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setDepth(20).setOrigin(0, 1).setInteractive();

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
    this.events.on('lives-update', (lives: number) => {
      this.updateLives(lives);
    });

    this.events.on('gold-update', (gold: number) => {
      this.updateGold(gold);
    });

    this.events.on('balance-update', () => {
      this.updateBalance();
    });

    this.events.on('wave-start', () => {
      this.hideStartWaveButton();
    });

    this.events.on('wave-complete', () => {
      this.showStartWaveButton();
    });

    this.events.on('game-over', () => {
      this.showGameOver();
    });

    this.events.on('reset-game', () => {
      this.resetUI();
    });
  }

  private updateLives(lives: number): void {
    this.lives = lives;
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  private updateGold(gold: number): void {
    this.gold = gold;
    this.goldText.setText(`Gold: ${this.gold}`);
  }

  private updateBalance(): void {
    if (this.balanceText && this.userService) {
      const currentBalance = this.userService.getHoplaTokens();
      this.balanceText.setText(`hoplaTokens: ${currentBalance}`);
    }
  }

  private hideStartWaveButton(): void {
    this.startWaveButton.setVisible(false);
  }

  private showStartWaveButton(): void {
    this.startWaveButton.setVisible(true);
  }

  private showGameOver(): void {
    // Could add game over UI here if needed
  }

  private resetUI(): void {
    this.lives = 0;
    this.gold = 0;
    this.livesText.setText('Lives: 0');
    this.goldText.setText('Gold: 0');
    this.showStartWaveButton();
    this.updateBalance();
  }

  private quitToMenu(): void {
    this.scene.stop('TDGame');
    this.scene.stop('TDPreloader');
    this.scene.start('MainMenu');
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    // Update UI elements positions
    if (this.goldText) {
      this.goldText.setPosition(gameSize.width - 20, 20);
    }
    if (this.balanceText) {
      this.balanceText.setPosition(gameSize.width / 2, 20);
    }
    if (this.startWaveButton) {
      this.startWaveButton.setPosition(gameSize.width / 2, gameSize.height - 50);
    }
    if (this.quitButton) {
      this.quitButton.setPosition(20, gameSize.height - 30);
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

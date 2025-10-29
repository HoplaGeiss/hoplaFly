import * as Phaser from 'phaser';
import { UserService } from '../../../services/user.service';

export class TDUI extends Phaser.Scene {
  private userService!: UserService;
  private livesText!: Phaser.GameObjects.Text;
  private goldText!: Phaser.GameObjects.Text;
  private balanceText!: Phaser.GameObjects.Text;
  private startWaveButton!: Phaser.GameObjects.Text;
  private hamburgerButton!: Phaser.GameObjects.Text;
  private hamburgerMenu!: Phaser.GameObjects.Container;
  private isMenuOpen: boolean = false;
  private lives: number = 10; // Initialize with starting lives
  private gold: number = 50; // Initialize with starting gold

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
    // Compact Lives & Gold display (top right)
    this.livesText = this.add.text(this.scale.width - 30, 20, `❤️${this.lives}`, {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20).setOrigin(1, 0);

    this.goldText = this.add.text(this.scale.width - 30, 45, `💰${this.gold}`, {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20).setOrigin(1, 0);

    // Hide hoplaTokens for mobile
    // this.balanceText is not created for mobile

    // Start Wave button (middle top)
    this.startWaveButton = this.add.text(this.scale.width / 2, 20, 'Start Wave', {
      fontFamily: 'Arial',
      fontSize: 28,
      color: '#ffffff',
      backgroundColor: '#0066ff',
      padding: { x: 15, y: 8 }
    }).setDepth(20).setOrigin(0.5, 0).setInteractive();

    this.startWaveButton.on('pointerdown', () => {
      this.scene.get('TDGame')?.events.emit('start-wave');
    });

    this.startWaveButton.on('pointerover', () => {
      this.startWaveButton.setBackgroundColor('#0088ff');
    });

    this.startWaveButton.on('pointerout', () => {
      this.startWaveButton.setBackgroundColor('#0066ff');
    });

    // Hamburger menu button (top left)
    this.hamburgerButton = this.add.text(20, 20, '☰', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 8, y: 4 }
    }).setDepth(20).setOrigin(0, 0).setInteractive();

    this.hamburgerButton.on('pointerdown', () => {
      this.toggleHamburgerMenu();
    });

    this.hamburgerButton.on('pointerover', () => {
      this.hamburgerButton.setBackgroundColor('#888888');
    });

    this.hamburgerButton.on('pointerout', () => {
      this.hamburgerButton.setBackgroundColor('#666666');
    });

    // Create hamburger menu (initially hidden)
    this.createHamburgerMenu();
  }

  private createHamburgerMenu(): void {
    // Create menu container
    this.hamburgerMenu = this.add.container(0, 0);
    this.hamburgerMenu.setDepth(30);
    this.hamburgerMenu.setVisible(false);

    // Semi-transparent overlay
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    );
    this.hamburgerMenu.add(overlay);

    // Menu panel
    const menuPanel = this.add.rectangle(
      150, // Left side panel
      this.scale.height / 2,
      250,
      this.scale.height,
      0x2c3e50,
      0.95
    );
    this.hamburgerMenu.add(menuPanel);

    // Close button
    const closeButton = this.add.text(20, 20, '×', {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#ffffff',
      backgroundColor: '#e74c3c',
      padding: { x: 8, y: 4 }
    }).setOrigin(0, 0).setInteractive();

    closeButton.on('pointerdown', () => {
      this.toggleHamburgerMenu();
    });
    this.hamburgerMenu.add(closeButton);

    // Quit button
    const quitButton = this.add.text(20, 80, 'ESC - Quit to Menu', {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#ffffff',
      backgroundColor: '#e74c3c',
      padding: { x: 15, y: 8 }
    }).setOrigin(0, 0).setInteractive();

    quitButton.on('pointerdown', () => {
      this.quitToMenu();
    });
    this.hamburgerMenu.add(quitButton);

    // Game info
    const gameInfo = this.add.text(20, 140, 'Tower Defense\n\n• Tap to place towers\n• Drag to pan camera\n• Pinch to zoom\n• Double-tap to reset view', {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#ffffff',
      align: 'left'
    }).setOrigin(0, 0);
    this.hamburgerMenu.add(gameInfo);

    // Close menu when clicking overlay
    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      this.toggleHamburgerMenu();
    });
  }

  private toggleHamburgerMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.hamburgerMenu.setVisible(this.isMenuOpen);

    // Animate menu slide
    if (this.isMenuOpen) {
      this.hamburgerMenu.setPosition(-250, 0);
      this.tweens.add({
        targets: this.hamburgerMenu,
        x: 0,
        duration: 300,
        ease: 'Power2.easeOut'
      });
    } else {
      this.tweens.add({
        targets: this.hamburgerMenu,
        x: -250,
        duration: 300,
        ease: 'Power2.easeIn',
        onComplete: () => {
          this.hamburgerMenu.setVisible(false);
        }
      });
    }
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
    this.livesText.setText(`❤️${this.lives}`);
  }

  private updateGold(gold: number): void {
    this.gold = gold;
    this.goldText.setText(`💰${this.gold}`);
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
    this.lives = 10; // Reset to starting lives
    this.gold = 50; // Reset to starting gold
    this.livesText.setText('❤️10');
    this.goldText.setText('💰50');
    this.showStartWaveButton();
    // No balance update for mobile
  }

  private quitToMenu(): void {
    this.scene.stop('TDGame');
    this.scene.stop('TDPreloader');
    this.scene.start('MainMenu');
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    // Update UI elements positions for mobile layout
    if (this.livesText) {
      this.livesText.setPosition(gameSize.width - 30, 20);
    }
    if (this.goldText) {
      this.goldText.setPosition(gameSize.width - 30, 45);
    }
    if (this.startWaveButton) {
      this.startWaveButton.setPosition(gameSize.width / 2, 20);
    }
    if (this.hamburgerButton) {
      this.hamburgerButton.setPosition(20, 20);
    }

    // Update hamburger menu overlay size
    if (this.hamburgerMenu) {
      const overlay = this.hamburgerMenu.list[0] as Phaser.GameObjects.Rectangle;
      if (overlay) {
        overlay.setSize(gameSize.width, gameSize.height);
        overlay.setPosition(gameSize.width / 2, gameSize.height / 2);
      }

      const menuPanel = this.hamburgerMenu.list[1] as Phaser.GameObjects.Rectangle;
      if (menuPanel) {
        menuPanel.setSize(250, gameSize.height);
        menuPanel.setPosition(150, gameSize.height / 2);
      }
    }
  }

  override update(): void {
    // No balance updates for mobile - hoplaTokens are hidden
  }
}

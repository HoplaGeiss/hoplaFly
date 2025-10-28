import * as Phaser from 'phaser';
import { UserService } from '../../services/user.service';

export class MainMenu extends Phaser.Scene {
  private userService!: UserService;
  private balanceText!: Phaser.GameObjects.Text;
  private batFlyButton!: Phaser.GameObjects.Text;
  private towerDefenseButton!: Phaser.GameObjects.Text;

  constructor() {
    super('MainMenu');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    // Set background
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    // Title
    this.add.text(this.scale.width / 2, 100, 'HoplaFly Games', {
      fontFamily: 'Arial Black',
      fontSize: 48,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);

    // Balance display
    this.updateBalanceDisplay();

    // Game selection buttons
    this.createGameButtons();

    // Instructions
    this.add.text(this.scale.width / 2, this.scale.height - 50, 'Choose a game to play!', {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center'
    }).setOrigin(0.5);
  }

  private updateBalanceDisplay(): void {
    const currentBalance = this.userService?.getHoplaTokens() || 0;
    this.balanceText = this.add.text(this.scale.width / 2, 150, `hoplaTokens: ${currentBalance}`, {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5);
  }

  private createGameButtons(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Bat Fly Game Button
    this.batFlyButton = this.add.text(centerX, centerY - 50, '🦇 Bat Fly\nDodge obstacles!', {
      fontFamily: 'Arial Black',
      fontSize: 28,
      color: '#ffffff',
      backgroundColor: '#0066ff',
      padding: { x: 30, y: 20 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    this.batFlyButton.on('pointerdown', () => {
      // Stop any running tower defense scenes
      this.scene.stop('TDGame');
      this.scene.stop('TDPreloader');
      this.scene.stop('TDGameOver');
      this.scene.stop('TDWin');
      this.scene.start('Preloader');
    });

    this.batFlyButton.on('pointerover', () => {
      this.batFlyButton.setBackgroundColor('#0088ff');
    });

    this.batFlyButton.on('pointerout', () => {
      this.batFlyButton.setBackgroundColor('#0066ff');
    });

    // Tower Defense Game Button
    this.towerDefenseButton = this.add.text(centerX, centerY + 50, '🗼 Tower Defense\nDefend the path!', {
      fontFamily: 'Arial Black',
      fontSize: 28,
      color: '#ffffff',
      backgroundColor: '#ff6600',
      padding: { x: 30, y: 20 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    this.towerDefenseButton.on('pointerdown', () => {
      // Stop any running bat fly scenes
      this.scene.stop('Game');
      this.scene.stop('Preloader');
      this.scene.stop('GameOver');
      this.scene.stop('Win');
      this.scene.start('TDPreloader');
    });

    this.towerDefenseButton.on('pointerover', () => {
      this.towerDefenseButton.setBackgroundColor('#ff8800');
    });

    this.towerDefenseButton.on('pointerout', () => {
      this.towerDefenseButton.setBackgroundColor('#ff6600');
    });
  }

  override update(): void {
    // Update balance display if needed
    if (this.userService && this.balanceText) {
      const currentBalance = this.userService.getHoplaTokens();
      this.balanceText.setText(`hoplaTokens: ${currentBalance}`);
    }
  }
}

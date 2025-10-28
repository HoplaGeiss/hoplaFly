import * as Phaser from 'phaser';
import { UserService } from '../../../services/user.service';

export class TDGameOver extends Phaser.Scene {
  private userService!: UserService;

  constructor() {
    super('TDGameOver');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    // Set background
    this.cameras.main.setBackgroundColor(0x8B0000);

    const currentBalance = this.userService?.getHoplaTokens() || 0;

    // Game Over text
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over', {
      fontFamily: 'Arial Black',
      fontSize: 64,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    // Balance display
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, `hoplaTokens: ${currentBalance}`, {
      fontFamily: 'Arial',
      fontSize: 28,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    // Restart button
    const restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Tap to restart', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    // Add input to restart the game
    this.input.once('pointerdown', () => {
      this.scene.start('TDGame');
    });

    // Back to Menu button
    const menuButton = this.add.text(this.scale.width / 2, this.scale.height - 100, 'Back to Menu', {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 15, y: 8 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    menuButton.on('pointerdown', () => {
      this.scene.stop('TDGame');
      this.scene.stop('TDPreloader');
      this.scene.start('MainMenu');
    });

    menuButton.on('pointerover', () => {
      menuButton.setBackgroundColor('#888888');
    });

    menuButton.on('pointerout', () => {
      menuButton.setBackgroundColor('#666666');
    });
  }
}

import * as Phaser from 'phaser';
import { UserService } from '../../../services/user.service';

export class TDWin extends Phaser.Scene {
  private userService!: UserService;

  constructor() {
    super('TDWin');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    // Set background
    this.cameras.main.setBackgroundColor(0x006400);

    const currentBalance = this.userService?.getHoplaTokens() || 0;

    // Victory text
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Victory!', {
      fontFamily: 'Arial Black',
      fontSize: 64,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    // Reward text
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, 'You won 1 hoplaToken!', {
      fontFamily: 'Arial',
      fontSize: 36,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);

    // Balance display
    this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, `Total hoplaTokens: ${currentBalance}`, {
      fontFamily: 'Arial',
      fontSize: 28,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    // Play again button
    const playAgainButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 'Tap to play again', {
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

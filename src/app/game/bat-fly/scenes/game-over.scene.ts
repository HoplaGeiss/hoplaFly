import * as Phaser from 'phaser';
import { UserService } from '../../../services/user.service';

export class GameOver extends Phaser.Scene {
  private background1!: Phaser.GameObjects.Image;
  private userService!: UserService;

  constructor() {
    super('GameOver');
  }


  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    this.background1 = this.add.image(0, 0, 'background').setOrigin(0);

    // Scale background to cover full screen
    this.background1.setScale(
      this.scale.width / this.background1.width,
      this.scale.height / this.background1.height
    );

    const currentBalance = this.userService?.getHoplaTokens() || 0;

    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.4, 'Game Over', {
        fontFamily: 'Arial Black',
        fontSize: 64,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    // Balance display
    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.55, `hoplaTokens: ${currentBalance}`, {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5);

    // Tap to restart text
    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.7, 'Tap to restart', {
        fontFamily: 'Arial Black',
        fontSize: 24,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5);

    // Play Again button
    const playAgainButton = this.add.text(this.scale.width / 2, this.scale.height - 120, 'Play Again', {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff',
      backgroundColor: '#0066ff',
      padding: { x: 15, y: 8 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    playAgainButton.on('pointerdown', () => {
      this.scene.start('Game');
    });

    playAgainButton.on('pointerover', () => {
      playAgainButton.setBackgroundColor('#0088ff');
    });

    playAgainButton.on('pointerout', () => {
      playAgainButton.setBackgroundColor('#0066ff');
    });

    // Back to Menu button
    const menuButton = this.add.text(this.scale.width / 2, this.scale.height - 80, 'Back to Menu', {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 15, y: 8 },
      align: 'center'
    }).setOrigin(0.5).setInteractive();

    menuButton.on('pointerdown', () => {
      this.scene.stop('Game');
      this.scene.stop('Preloader');
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

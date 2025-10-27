import * as Phaser from 'phaser';
import { UserService } from '../../services/user.service';

export class Win extends Phaser.Scene {
  private background1!: Phaser.GameObjects.Image;
  private userService!: UserService;

  constructor() {
    super('Win');
  }

  init(data: { userService: UserService }): void {
    this.userService = data.userService;
  }

  create(): void {
    this.background1 = this.add.image(0, 0, 'background').setOrigin(0);
    
    // Scale background to cover full screen
    this.background1.setScale(
      this.scale.width / this.background1.width,
      this.scale.height / this.background1.height
    );

    const currentBalance = this.userService?.getHoplaTokens() || 0;

    // Main congratulations text
    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.3, 'Congratulations!', {
        fontFamily: 'Arial Black',
        fontSize: 48,
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    // Token reward text
    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.4, 'You won 1 hoplaToken!', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5);

    // Current balance text
    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.5, `Total hoplaTokens: ${currentBalance}`, {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5);

    // Tap to continue text
    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.7, 'Tap to play again', {
        fontFamily: 'Arial Black',
        fontSize: 24,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5);

    // Add input to restart the game
    this.input.once('pointerdown', () => {
      this.scene.start('Game', { userService: this.userService });
    });
  }
}

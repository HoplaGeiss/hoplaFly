import * as Phaser from 'phaser';

export class Win extends Phaser.Scene {
  private background1!: Phaser.GameObjects.Image;

  constructor() {
    super('Win');
  }

  create(): void {
    this.background1 = this.add.image(0, 0, 'background').setOrigin(0);

    // Main congratulations text
    this.add
      .text(this.scale.width * 0.5, this.scale.height * 0.4, 'Congratulations!', {
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
      .text(this.scale.width * 0.5, this.scale.height * 0.5, 'You won 1 hoplaToken!', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#ffffff',
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
      this.scene.start('Game');
    });
  }
}

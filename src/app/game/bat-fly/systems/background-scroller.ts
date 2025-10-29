import * as Phaser from 'phaser';

export class BackgroundScroller {
  private background1!: Phaser.GameObjects.Image;
  private background2!: Phaser.GameObjects.Image;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(): void {
    this.background1 = this.scene.add.image(0, 0, 'background').setOrigin(0);
    this.background2 = this.scene.add.image(0, 0, 'background').setOrigin(0);

    this.resizeBackgrounds();
  }

  update(speed: number): void {
    this.background1.x -= speed;
    this.background2.x -= speed;

    // Loop backgrounds
    if (this.background1.x + this.background1.displayWidth < 0) {
      this.background1.x += this.background1.displayWidth * 2;
    }

    if (this.background2.x + this.background2.displayWidth < 0) {
      this.background2.x += this.background2.displayWidth * 2;
    }
  }

  handleResize(width: number, height: number): void {
    if (!this.background1 || !this.background2) return;

    this.resizeBackgrounds();
  }

  private resizeBackgrounds(): void {
    if (!this.background1 || !this.background2) return;

    // Scale backgrounds to cover full screen
    const scaleX = this.scene.scale.width / this.background1.width;
    const scaleY = this.scene.scale.height / this.background1.height;
    const scale = Math.max(scaleX, scaleY);

    this.background1.setScale(scale);
    this.background2.setScale(scale);

    // Position second background right after the first one
    this.background2.x = this.background1.displayWidth;

    // Center the backgrounds if they're larger than the screen
    const offsetX = (this.background1.displayWidth - this.scene.scale.width) / 2;
    this.background1.x = -offsetX;
    this.background2.x = this.background1.displayWidth - offsetX;
  }
}

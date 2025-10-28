import * as Phaser from 'phaser';
import { TD_ASSETS } from '../config/td-assets.config';

export class TDPreloader extends Phaser.Scene {
  constructor() {
    super('TDPreloader');
  }

  init(): void {
    // Create a simple progress bar
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload(): void {
    // Load tower defense assets
    for (let type in TD_ASSETS) {
      for (let key in (TD_ASSETS as any)[type]) {
        const asset = (TD_ASSETS as any)[type][key];
        if (type === 'image' && asset.path) {
          this.load.image(asset.key, asset.path);
        }
      }
    }
  }

  create(): void {
    // Move to the main tower defense game
    this.scene.start('TDGame');
  }
}

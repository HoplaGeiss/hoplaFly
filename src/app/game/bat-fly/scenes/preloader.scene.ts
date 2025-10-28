import * as Phaser from 'phaser';
import { ASSETS } from '../../config/assets.config';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init(): void {
    //  We loaded this image in our Boot Scene, so we can display it here
    // this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload(): void {
    //  Load the assets for the game - see ./src/assets.js
    for (let type in ASSETS) {
      for (let key in (ASSETS as any)[type]) {
        let args = (ASSETS as any)[type][key].args.slice();
        args.unshift((ASSETS as any)[type][key].key);
        (this.load as any)[type].apply(this.load, args);
      }
    }
  }

  create(): void {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('Game');
  }
}

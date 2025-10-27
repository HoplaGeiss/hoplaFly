import { Injectable, signal, computed } from '@angular/core';
import * as Phaser from 'phaser';
import { Boot } from './scenes/boot.scene';
import { Preloader } from './scenes/preloader.scene';
import { Game } from './scenes/game.scene';
import { GameOver } from './scenes/game-over.scene';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private game = signal<Phaser.Game | null>(null);
  private isGameInitialized = signal(false);
  
  // Computed signal for game state
  gameState = computed(() => ({
    game: this.game(),
    isInitialized: this.isGameInitialized()
  }));

  initializeGame(): void {
    if (this.game()) {
      return; // Game already initialized
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      backgroundColor: '#028af8',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { x: 0, y: 400 }
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [
        Boot,
        Preloader,
        Game,
        GameOver
      ]
    };

    const gameInstance = new Phaser.Game(config);
    this.game.set(gameInstance);
    this.isGameInitialized.set(true);
  }

  destroyGame(): void {
    const currentGame = this.game();
    if (currentGame) {
      currentGame.destroy(true);
      this.game.set(null);
      this.isGameInitialized.set(false);
    }
  }

  getGame(): Phaser.Game | null {
    return this.game();
  }
}

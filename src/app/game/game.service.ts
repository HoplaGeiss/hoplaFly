import { Injectable, signal, computed, inject } from '@angular/core';
import * as Phaser from 'phaser';
import { Boot } from './scenes/boot.scene';
import { Preloader } from './scenes/preloader.scene';
import { Game } from './scenes/game.scene';
import { GameOver } from './scenes/game-over.scene';
import { Win } from './scenes/win.scene';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private userService = inject(UserService);
  private game = signal<Phaser.Game | null>(null);
  private isGameInitialized = signal(false);

  // Computed signal for game state
  gameState = computed(() => ({
    game: this.game(),
    isInitialized: this.isGameInitialized(),
  }));

  initializeGame(): void {
    if (this.game()) {
      return; // Game already initialized
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      backgroundColor: '#028af8',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { x: 0, y: 400 },
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      scene: [Boot, Preloader, Game, GameOver, Win],
    };

    const gameInstance = new Phaser.Game(config);

    // Store the UserService in the game registry so scenes can access it
    gameInstance.registry.set('userService', this.userService);

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

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { GameService } from './game/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <div id="game-container"></div> `,
  styles: [
    `
      :host {
        display: block;
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      
      #game-container {
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    `,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);

  ngOnInit(): void {
    this.gameService.initializeGame();
  }

  ngOnDestroy(): void {
    this.gameService.destroyGame();
  }
}

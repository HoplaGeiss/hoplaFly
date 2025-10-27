import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { GameService } from './game/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <div id="game-container"></div> `,
  styles: [
    `
      #game-container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
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

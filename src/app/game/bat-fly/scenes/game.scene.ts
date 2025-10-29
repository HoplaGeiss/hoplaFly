import * as Phaser from 'phaser';
import { UserService } from '../../../services/user.service';
import { GAME_CONSTANTS } from '../config/game-constants';
import { BackgroundScroller } from '../systems/background-scroller';
import { PathManager } from '../systems/path-manager';
import { PlayerController } from '../systems/player-controller';
import { ObstacleSystem } from '../systems/obstacle-system';
import { CoinSystem } from '../systems/coin-system';

export class Game extends Phaser.Scene {
  private score: number = 0;
  private distance: number = 0;
  private userService!: UserService;

  // Systems
  private backgroundScroller!: BackgroundScroller;
  private pathManager!: PathManager;
  private playerController!: PlayerController;
  private obstacleSystem!: ObstacleSystem;
  private coinSystem!: CoinSystem;

  constructor() {
    super('Game');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    // Set background color
    this.cameras.main.setBackgroundColor(GAME_CONSTANTS.BACKGROUND_COLOR);

    // Initialize systems
    this.backgroundScroller = new BackgroundScroller(this);
    this.pathManager = new PathManager(this);
    this.playerController = new PlayerController(this);
    this.obstacleSystem = new ObstacleSystem(this);
    this.coinSystem = new CoinSystem(this);

    // Create all systems
    this.backgroundScroller.create();
    this.pathManager.create();
    this.playerController.create();
    this.obstacleSystem.create();
    this.coinSystem.create();

    // Set up physics
    this.setupPhysics();

    // Set up input
    this.setupInput();

    // Launch UI scene
    this.scene.launch('GameUI');

    // Reset game state
    this.resetGameState();
  }

  override update(): void {
    // Update systems
    this.backgroundScroller.update(GAME_CONSTANTS.BACKGROUND_SPEED);
    this.pathManager.update();
    this.obstacleSystem.update();
    this.coinSystem.update();

    // Check if game is started
    if (!this.playerController.isGameStarted()) return;

    // Check if player is out of bounds
    if (this.playerController.isPlayerOutOfBounds()) {
      this.gameOver();
      return;
    }

    // Update distance and check for new obstacles/coins
    this.distance += GAME_CONSTANTS.BACKGROUND_SPEED;

    if (this.distance > GAME_CONSTANTS.DISTANCE_MAX) {
      this.distance -= GAME_CONSTANTS.DISTANCE_MAX;
      this.pathManager.randomPath();
    }

    // Add obstacles and coins based on path
    if (this.obstacleSystem.shouldAddSpike()) {
      this.obstacleSystem.addSpike(this.pathManager.getPathY(), this.pathManager.getPathHeight());
    }
    if (this.coinSystem.shouldAddCoin()) {
      this.coinSystem.addCoin(this.pathManager.getPathY());
    }
  }

  private setupPhysics(): void {
    // Set up collision detection
    this.physics.add.overlap(
      this.playerController.getPlayer(),
      this.obstacleSystem.getObstacleGroup(),
      this.hitObstacle,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.playerController.getPlayer(),
      this.coinSystem.getCoinGroup(),
      this.collectCoin,
      undefined,
      this
    );
  }

  private setupInput(): void {
    // Pause physics initially
    this.physics.pause();

    // Start game on first tap
    this.input.once('pointerdown', () => {
      this.startGame();
    });

    // ESC key to quit to menu
    this.input.keyboard?.on('keydown-ESC', () => {
      this.quitToMenu();
    });
  }

  private startGame(): void {
    this.playerController.startGame();
    this.input.on('pointerdown', () => {
      this.playerController.fly();
    });

    this.playerController.fly();

    // Notify UI that game started
    this.events.emit('game-start');
  }

  private hitObstacle = (player: any, obstacle: any): void => {
    this.physics.pause();

    this.tweens.add({
      targets: player,
      scale: 3,
      alpha: 0,
      duration: 1000,
      ease: Phaser.Math.Easing.Expo.Out,
    });

    this.gameOver();
  };

  private collectCoin = (player: any, coin: any): void => {
    coin.destroy();
    this.score++;

    // Notify UI of score update
    this.events.emit('score-update', this.score);

    // Check for win condition
    if (this.score >= GAME_CONSTANTS.WIN_SCORE) {
      this.gameWon();
    }
  };

  private gameWon(): void {
    this.physics.pause();

    // Add hoplaToken reward with score
    this.userService.addHoplaTokens(1, this.score);

    // Notify UI of balance update
    this.events.emit('balance-update');

    // Add a celebration effect
    this.tweens.add({
      targets: this.playerController.getPlayer(),
      scale: 1.5,
      duration: 500,
      ease: Phaser.Math.Easing.Bounce.Out,
      yoyo: true,
      repeat: 2,
    });

    this.time.delayedCall(2000, () => {
      this.scene.start('Win');
    });
  }

  private gameOver(): void {
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOver');
    });
  }

  private resetGameState(): void {
    // Reset score and game state
    this.score = 0;
    this.distance = 0;

    // Pause physics initially
    this.physics.pause();

    // Reset systems
    this.obstacleSystem.reset();
    this.coinSystem.reset();
    this.playerController.resetPlayer();

    // Reset input handling
    this.input.removeAllListeners();
    this.input.once('pointerdown', () => {
      this.startGame();
    });

    // Notify UI to reset
    this.events.emit('reset-game');
  }

  private quitToMenu(): void {
    this.scene.stop('Game');
    this.scene.stop('Preloader');
    this.scene.stop('GameUI');
    this.scene.start('MainMenu');
  }
}

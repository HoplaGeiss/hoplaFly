import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';
import { UserService } from '../../../services/user.service';
import { PathRenderer } from '../systems/path-renderer';
import { GridSystem } from '../systems/grid-system';
import { TowerManager } from '../systems/tower-manager';
import { EnemyManager } from '../systems/enemy-manager';
import { WaveController } from '../systems/wave-controller';

export class TDGame extends Phaser.Scene {
  private userService!: UserService;

  // Systems
  private pathRenderer!: PathRenderer;
  private gridSystem!: GridSystem;
  private towerManager!: TowerManager;
  private enemyManager!: EnemyManager;
  private waveController!: WaveController;

  constructor() {
    super('TDGame');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    // Set background
    this.cameras.main.setBackgroundColor(0x228B22);

    // Initialize systems
    this.pathRenderer = new PathRenderer(this);
    this.gridSystem = new GridSystem(this);
    this.towerManager = new TowerManager(this);
    this.enemyManager = new EnemyManager(this);
    this.waveController = new WaveController(this);

    // Create all systems
    this.pathRenderer.create();
    this.gridSystem.create();
    this.towerManager.create();
    this.enemyManager.create();
    this.waveController.create();

    // Set up input
    this.setupInput();

    // Launch UI scene
    this.scene.launch('TDUI');

    // Set up event listeners
    this.setupEventListeners();
  }

  private setupInput(): void {
    // Grid click for tower placement
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handleGridClick(pointer.x, pointer.y);
    });

    // Grid hover for preview
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.handleGridHover(pointer.x, pointer.y);
    });

    // ESC key to quit to menu
    this.input.keyboard?.on('keydown-ESC', () => {
      this.quitToMenu();
    });
  }

  private setupEventListeners(): void {
    // Listen for UI events
    this.events.on('start-wave', () => {
      this.waveController.startWave();
    });
  }

  private handleGridClick(x: number, y: number): void {
    if (this.waveController.isWaveActive()) return;

    const cell = this.gridSystem.getGridCell(x, y);
    if (!cell) return;

    if (this.towerManager.placeTower(cell.x, cell.y, this.pathRenderer)) {
      // Tower placed successfully
      this.updateGridPreview();
    }
  }

  private handleGridHover(x: number, y: number): void {
    if (this.waveController.isWaveActive()) return;

    const cell = this.gridSystem.getGridCell(x, y);
    this.gridSystem.setHoveredCell(cell);
    this.updateGridPreview();
  }

  private updateGridPreview(): void {
    const hoveredCell = this.gridSystem.getGridCell(this.input.x, this.input.y);
    if (!hoveredCell) {
      this.gridSystem.clearPreview();
      return;
    }

    const canPlace = this.towerManager.canPlaceTower(hoveredCell.x, hoveredCell.y, this.pathRenderer);
    this.gridSystem.updateGridPreview(canPlace);
  }

  private quitToMenu(): void {
    this.scene.stop('TDGame');
    this.scene.stop('TDPreloader');
    this.scene.stop('TDUI');
    this.scene.start('MainMenu');
  }

  override update(): void {
    // Update systems
    this.waveController.update(this.enemyManager);
    this.enemyManager.update();
    this.towerManager.update(this.enemyManager.getEnemies());

    // Update grid preview
    this.updateGridPreview();
  }
}

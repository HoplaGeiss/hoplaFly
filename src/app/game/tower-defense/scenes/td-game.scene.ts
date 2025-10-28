import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';
import { Tower } from '../entities/tower';
import { Enemy } from '../entities/enemy';
import { UserService } from '../../../services/user.service';

export class TDGame extends Phaser.Scene {
  private userService!: UserService;
  private towers: Tower[] = [];
  private enemies: Enemy[] = [];
  private path: any[] = [];
  private lives: number = 0;
  private gold: number = 0;
  private waveActive: boolean = false;
  private enemiesSpawned: number = 0;
  private enemiesToSpawn: number = 0;
  private lastSpawnTime: number = 0;
  private spawnDelay: number = 300; // faster enemy spawning

  // UI Elements
  private livesText!: Phaser.GameObjects.Text;
  private goldText!: Phaser.GameObjects.Text;
  private startWaveButton!: Phaser.GameObjects.Text;
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private hoveredCell: { x: number; y: number } | null = null;

  constructor() {
    super('TDGame');
  }

  create(): void {
    // Get UserService from the game registry
    this.userService = this.registry.get('userService');

    // Initialize game state
    this.lives = TD_CONFIG.GAME.STARTING_LIVES;
    this.gold = TD_CONFIG.GAME.STARTING_GOLD;
    this.path = TD_CONFIG.PATH.POINTS;

    // Set background
    this.cameras.main.setBackgroundColor(0x228B22);

    // Create path
    this.createPath();

    // Create grid
    this.createGrid();

    // Create UI
    this.createUI();

    // Set up input
    this.setupInput();

    // Start update loop
    this.updateBalanceDisplay();
  }

  private createPath(): void {
    this.pathGraphics = this.add.graphics();
    this.pathGraphics.fillStyle(0x666666);

    // Draw continuous path using thick line segments
    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i];
      const end = this.path[i + 1];

      // Draw thick line segment
      this.pathGraphics.lineStyle(TD_CONFIG.PATH.WIDTH, 0x666666);
      this.pathGraphics.beginPath();
      this.pathGraphics.moveTo(start.x, start.y);
      this.pathGraphics.lineTo(end.x, end.y);
      this.pathGraphics.strokePath();
    }

    this.pathGraphics.setDepth(1);
  }

  private createGrid(): void {
    this.gridGraphics = this.add.graphics();
    this.gridGraphics.setDepth(2);
  }

  private createUI(): void {
    // Lives display (top left)
    this.livesText = this.add.text(20, 20, `Lives: ${this.lives}`, {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20);

    // Gold display (top right)
    this.goldText = this.add.text(this.scale.width - 20, 20, `Gold: ${this.gold}`, {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20).setOrigin(1, 0);

    // Start Wave button (center)
    this.startWaveButton = this.add.text(this.scale.width / 2, this.scale.height - 50, 'Start Wave', {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#ffffff',
      backgroundColor: '#0066ff',
      padding: { x: 20, y: 10 }
    }).setDepth(20).setOrigin(0.5);

    // Quit button
    const quitButton = this.add.text(20, this.scale.height - 30, 'ESC - Quit', {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setDepth(20).setOrigin(0, 1).setInteractive();

    quitButton.on('pointerdown', () => {
      this.quitToMenu();
    });

    quitButton.on('pointerover', () => {
      quitButton.setBackgroundColor('#888888');
    });

    quitButton.on('pointerout', () => {
      quitButton.setBackgroundColor('#666666');
    });

    // Balance display
    const currentBalance = this.userService?.getHoplaTokens() || 0;
    this.add.text(this.scale.width / 2, 20, `hoplaTokens: ${currentBalance}`, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(20).setOrigin(0.5, 0);
  }

  private setupInput(): void {
    // Start wave button
    this.startWaveButton.setInteractive();
    this.startWaveButton.on('pointerdown', () => {
      this.startWave();
    });

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

  private startWave(): void {
    if (this.waveActive) return;

    this.waveActive = true;
    this.enemiesToSpawn = TD_CONFIG.GAME.WAVE_SIZE;
    this.enemiesSpawned = 0;
    this.lastSpawnTime = 0;
    this.startWaveButton.setVisible(false);
  }

  private handleGridClick(x: number, y: number): void {
    if (this.waveActive) return;

    const cell = this.getGridCell(x, y);
    if (!cell) return;

    if (this.canPlaceTower(cell.x, cell.y) && this.gold >= TD_CONFIG.TOWER.COST) {
      this.placeTower(cell.x, cell.y);
    }
  }

  private handleGridHover(x: number, y: number): void {
    if (this.waveActive) return;

    const cell = this.getGridCell(x, y);
    this.hoveredCell = cell;
    this.updateGridPreview();
  }

  private getGridCell(x: number, y: number): { x: number; y: number } | null {
    const cellX = Math.floor(x / TD_CONFIG.GRID.CELL_SIZE) * TD_CONFIG.GRID.CELL_SIZE + TD_CONFIG.GRID.CELL_SIZE / 2;
    const cellY = Math.floor(y / TD_CONFIG.GRID.CELL_SIZE) * TD_CONFIG.GRID.CELL_SIZE + TD_CONFIG.GRID.CELL_SIZE / 2;

    return { x: cellX, y: cellY };
  }

  private canPlaceTower(x: number, y: number): boolean {
    // Check if position is on path using line-to-point distance
    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i];
      const end = this.path[i + 1];

      // Calculate distance from point to line segment
      const distanceToLine = this.distanceToLineSegment(x, y, start.x, start.y, end.x, end.y);

      if (distanceToLine < TD_CONFIG.PATH.WIDTH / 2) {
        return false;
      }
    }

    // Check if position is already occupied
    for (const tower of this.towers) {
      if (Phaser.Math.Distance.Between(x, y, tower.x, tower.y) < TD_CONFIG.TOWER.SIZE) {
        return false;
      }
    }

    return true;
  }

  private distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private placeTower(x: number, y: number): void {
    const tower = new Tower(this, x, y);
    this.towers.push(tower);
    this.gold -= TD_CONFIG.TOWER.COST;
    this.updateUI();
  }

  private updateGridPreview(): void {
    this.gridGraphics.clear();

    if (!this.hoveredCell) return;

    const { x, y } = this.hoveredCell;
    const canPlace = this.canPlaceTower(x, y) && this.gold >= TD_CONFIG.TOWER.COST;

    this.gridGraphics.fillStyle(canPlace ? 0x00ff00 : 0xff0000, 0.3);
    this.gridGraphics.fillRect(
      x - TD_CONFIG.GRID.CELL_SIZE / 2,
      y - TD_CONFIG.GRID.CELL_SIZE / 2,
      TD_CONFIG.GRID.CELL_SIZE,
      TD_CONFIG.GRID.CELL_SIZE
    );
  }

  private spawnEnemy(): void {
    const startPoint = this.path[0];
    const enemy = new Enemy(this, startPoint.x, startPoint.y);
    this.enemies.push(enemy);
    this.enemiesSpawned++;
  }

  private updateUI(): void {
    this.livesText.setText(`Lives: ${this.lives}`);
    this.goldText.setText(`Gold: ${this.gold}`);
  }

  private updateBalanceDisplay(): void {
    if (this.userService) {
      const currentBalance = this.userService.getHoplaTokens();
      // Update balance display if needed
    }
  }

  private quitToMenu(): void {
    this.scene.stop('TDGame');
    this.scene.stop('TDPreloader');
    this.scene.start('MainMenu');
  }

  private checkWaveComplete(): void {
    if (!this.waveActive) return;

    const activeEnemies = this.enemies.filter(enemy => enemy.active);
    if (activeEnemies.length === 0 && this.enemiesSpawned >= this.enemiesToSpawn) {
      this.waveActive = false;
      this.startWaveButton.setVisible(true);
      this.enemiesSpawned = 0;
      this.enemiesToSpawn = 0;
    }
  }

  private checkGameOver(): void {
    if (this.lives <= 0) {
      this.scene.start('TDGameOver');
    }
  }

  private checkWin(): void {
    // For now, just check if wave is complete
    // Later we can add more complex win conditions
  }

  override update(): void {
    // Spawn enemies
    if (this.waveActive && this.enemiesSpawned < this.enemiesToSpawn) {
      if (Date.now() - this.lastSpawnTime >= this.spawnDelay) {
        this.spawnEnemy();
        this.lastSpawnTime = Date.now();
      }
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy.active) {
        this.enemies.splice(i, 1);
        continue;
      }

      enemy.update(this.path);

      // Check if enemy reached the end
      if (enemy.pathIndex >= this.path.length - 1) {
        this.lives--;
        this.updateUI();
        enemy.die();
        this.checkGameOver();
      }
    }

    // Update towers
    for (const tower of this.towers) {
      tower.update(this.enemies);
    }

    // Check wave completion
    this.checkWaveComplete();

    // Update grid preview
    this.updateGridPreview();
  }
}

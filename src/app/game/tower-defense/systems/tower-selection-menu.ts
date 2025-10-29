import * as Phaser from 'phaser';
import { TD_CONFIG } from '../config/td-config';

export class TowerSelectionMenu {
  private scene: Phaser.Scene;
  private menuContainer!: Phaser.GameObjects.Container;
  private background!: Phaser.GameObjects.Graphics;
  private towerButtons: Phaser.GameObjects.Container[] = [];
  private onTowerSelected?: (towerType: keyof typeof TD_CONFIG.TOWER_TYPES) => void;
  private onClose?: () => void;
  private currentGold: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    // Create menu container
    this.menuContainer = this.scene.add.container(0, 0);
    this.menuContainer.setDepth(100);
    this.menuContainer.setVisible(false);

    // Create bottom panel background (no overlay)
    this.background = this.scene.add.graphics();
    this.background.fillStyle(0x000000, 0.9);
    this.background.fillRect(0, this.scene.scale.height - 120, this.scene.scale.width, 120);
    this.background.lineStyle(2, 0xffffff);
    this.background.strokeRect(0, this.scene.scale.height - 120, this.scene.scale.width, 120);
    this.menuContainer.add(this.background);

    // Create close button (top right of bottom panel, avoiding border)
    const closeButton = this.scene.add.text(this.scene.scale.width - 15, this.scene.scale.height - 110, '✕', {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#ffffff'
    }).setInteractive().setOrigin(0.5, 0.5);
    closeButton.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this.hide();
    });
    this.menuContainer.add(closeButton);

    // Create tower selection buttons
    this.createTowerButtons();
  }

  private createTowerButtons(): void {
    const centerX = this.scene.scale.width / 2;
    const bottomY = this.scene.scale.height - 60; // Bottom of screen
    const buttonSpacing = 120; // Reduced spacing to fit 400px total width
    const startX = centerX - buttonSpacing;

    const towerTypes = Object.keys(TD_CONFIG.TOWER_TYPES) as Array<keyof typeof TD_CONFIG.TOWER_TYPES>;

    towerTypes.forEach((towerType, index) => {
      const config = TD_CONFIG.TOWER_TYPES[towerType];
      const x = startX + (index * buttonSpacing);
      const y = bottomY;

      // Create button container
      const buttonContainer = this.scene.add.container(x, y);
      this.menuContainer.add(buttonContainer);

      // Create button background - ultra compact for 400px total width
      const buttonBg = this.scene.add.graphics();
      buttonBg.fillStyle(config.color, 0.8);
      buttonBg.fillRoundedRect(-50, -35, 100, 70, 6);
      buttonBg.lineStyle(2, 0xffffff);
      buttonBg.strokeRoundedRect(-50, -35, 100, 70, 6);
      buttonContainer.add(buttonBg);

      // Create tower icon (top center)
      const icon = this.scene.add.text(0, -20, config.icon, {
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#ffffff'
      }).setOrigin(0.5, 0.5);
      buttonContainer.add(icon);

      // Create tower name (below icon)
      const name = this.scene.add.text(0, -8, `${config.name}`, {
        fontFamily: 'Arial',
        fontSize: 12,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5, 0.5);
      buttonContainer.add(name);

      // Create cost (below name)
      const cost = this.scene.add.text(0, 5, `💰${config.cost}`, {
        fontFamily: 'Arial',
        fontSize: 11,
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5, 0.5);
      buttonContainer.add(cost);

      // Create stats display (bottom)
      const stats = this.scene.add.text(0, 18, `⚔️${config.damage} | 🎯${config.range}`, {
        fontFamily: 'Arial',
        fontSize: 9,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5, 0.5);
      buttonContainer.add(stats);

      // Make button interactive
      buttonContainer.setSize(100, 70);
      buttonContainer.setInteractive();
      buttonContainer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        this.selectTower(towerType);
      });
      buttonContainer.on('pointerover', () => {
        buttonBg.clear();
        buttonBg.fillStyle(config.color, 1.0);
        buttonBg.fillRoundedRect(-50, -35, 100, 70, 6);
        buttonBg.lineStyle(2, 0xffff00);
        buttonBg.strokeRoundedRect(-50, -35, 100, 70, 6);
      });
      buttonContainer.on('pointerout', () => {
        buttonBg.clear();
        buttonBg.fillStyle(config.color, 0.8);
        buttonBg.fillRoundedRect(-50, -35, 100, 70, 6);
        buttonBg.lineStyle(2, 0xffffff);
        buttonBg.strokeRoundedRect(-50, -35, 100, 70, 6);
      });

      this.towerButtons.push(buttonContainer);
    });
  }

  public show(x: number, y: number, onTowerSelected: (towerType: keyof typeof TD_CONFIG.TOWER_TYPES) => void, onClose: () => void, currentGold: number): void {
    this.onTowerSelected = onTowerSelected;
    this.onClose = onClose;
    this.currentGold = currentGold;
    this.menuContainer.setVisible(true);
    this.updateButtonStates();
  }

  public hide(): void {
    this.menuContainer.setVisible(false);
    if (this.onClose) {
      this.onClose();
    }
  }

  private updateButtonStates(): void {
    const towerTypes = Object.keys(TD_CONFIG.TOWER_TYPES) as Array<keyof typeof TD_CONFIG.TOWER_TYPES>;

    this.towerButtons.forEach((buttonContainer, index) => {
      const towerType = towerTypes[index];
      const config = TD_CONFIG.TOWER_TYPES[towerType];
      const canAfford = this.currentGold >= config.cost;

      // Update button interactivity
      buttonContainer.setInteractive(canAfford);

      // Update visual appearance based on affordability
      const buttonBg = buttonContainer.list[0] as Phaser.GameObjects.Graphics;
      if (buttonBg) {
        buttonBg.clear();
        if (canAfford) {
          buttonBg.fillStyle(config.color, 0.8);
          buttonBg.lineStyle(2, 0xffffff);
        } else {
          buttonBg.fillStyle(0x666666, 0.5); // Grayed out
          buttonBg.lineStyle(2, 0x999999);
        }
        buttonBg.fillRoundedRect(-50, -35, 100, 70, 6);
        buttonBg.strokeRoundedRect(-50, -35, 100, 70, 6);
      }
    });
  }

  private selectTower(towerType: keyof typeof TD_CONFIG.TOWER_TYPES): void {
    const config = TD_CONFIG.TOWER_TYPES[towerType];
    if (this.currentGold < config.cost) {
      return; // Don't select if can't afford
    }

    console.log('Tower selected:', towerType);
    if (this.onTowerSelected) {
      this.onTowerSelected(towerType);
    }
    this.hide();
    console.log('Menu hidden');
  }

  public destroy(): void {
    if (this.menuContainer) {
      this.menuContainer.destroy();
    }
  }
}

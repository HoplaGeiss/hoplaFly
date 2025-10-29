import * as Phaser from 'phaser';

export class CameraController {
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private isPanning: boolean = false;
  private panStartX: number = 0;
  private panStartY: number = 0;
  private lastZoom: number = 1;
  private minZoom: number = 0.5;
  private maxZoom: number = 2;
  private zoomSpeed: number = 0.1;
  private panSpeed: number = 1;
  private bounds: { x: number; y: number; width: number; height: number } | null = null;

  constructor(private scene: Phaser.Scene) {}

  create(): void {
    this.camera = this.scene.cameras.main;
    this.setupCameraBounds();
    this.setupInputHandlers();
  }

  update(): void {
    this.handlePanning();
  }

  private setupCameraBounds(): void {
    // Set camera bounds to the game world
    const worldWidth = this.scene.scale.width * 2; // Allow panning beyond screen
    const worldHeight = this.scene.scale.height * 2;

    this.bounds = {
      x: -worldWidth / 4,
      y: -worldHeight / 4,
      width: worldWidth,
      height: worldHeight
    };

    this.camera.setBounds(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height
    );
  }

  private setupInputHandlers(): void {
    // Single pointer down - start potential pan
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.panStartX = pointer.x;
      this.panStartY = pointer.y;
      this.isPanning = false;
    });

    // Pointer move - handle panning
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        const deltaX = pointer.x - this.panStartX;
        const deltaY = pointer.y - this.panStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Start panning if moved more than 5 pixels
        if (distance > 5) {
          this.isPanning = true;
          this.panCamera(-deltaX * this.panSpeed, -deltaY * this.panSpeed);
          this.panStartX = pointer.x;
          this.panStartY = pointer.y;
        }
      }
    });

    // Pointer up - stop panning
    this.scene.input.on('pointerup', () => {
      this.isPanning = false;
    });

    // Double tap - reset camera
    let lastTapTime = 0;
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const currentTime = this.scene.time.now;
      if (currentTime - lastTapTime < 300) { // Double tap within 300ms
        this.resetCamera();
      }
      lastTapTime = currentTime;
    });

    // Mouse wheel zoom (for desktop)
    this.scene.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any[], deltaX: number, deltaY: number, deltaZ: number) => {
      const zoomDelta = -deltaY * 0.001;
      const newZoom = Phaser.Math.Clamp(
        this.camera.zoom + zoomDelta,
        this.minZoom,
        this.maxZoom
      );
      this.setZoom(newZoom);
    });
  }

  private handlePanning(): void {
    // Smooth camera movement
    if (this.isPanning) {
      // Camera panning is handled in pointer move event
    }
  }

  private panCamera(deltaX: number, deltaY: number): void {
    const newX = this.camera.scrollX + deltaX;
    const newY = this.camera.scrollY + deltaY;

    // Constrain to bounds
    if (this.bounds) {
      const constrainedX = Phaser.Math.Clamp(
        newX,
        this.bounds.x,
        this.bounds.x + this.bounds.width - this.camera.width
      );
      const constrainedY = Phaser.Math.Clamp(
        newY,
        this.bounds.y,
        this.bounds.y + this.bounds.height - this.camera.height
      );

      this.camera.setScroll(constrainedX, constrainedY);
    } else {
      this.camera.setScroll(newX, newY);
    }
  }

  private handlePinchZoom(): void {
    // For now, we'll implement a simpler zoom using mouse wheel or touch gestures
    // Multi-touch pinch zoom would require more complex input handling
    // This is a placeholder for future enhancement
  }

  setZoom(zoom: number): void {
    const clampedZoom = Phaser.Math.Clamp(zoom, this.minZoom, this.maxZoom);
    this.camera.setZoom(clampedZoom);
  }

  getZoom(): number {
    return this.camera.zoom;
  }

  resetCamera(): void {
    this.camera.setZoom(1);
    this.camera.centerOn(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2
    );
  }

  isCurrentlyPanning(): boolean {
    return this.isPanning;
  }

  // Helper method to check if a tap should be treated as a game action vs camera control
  shouldProcessGameInput(pointer: Phaser.Input.Pointer): boolean {
    // Don't process game input if we're panning
    return !this.isPanning;
  }
}

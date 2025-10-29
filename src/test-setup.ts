// Mock Phaser completely to avoid loading the real library
vi.mock('phaser', () => ({
  Scene: class MockScene {},
  GameObjects: {
    Graphics: class MockGraphics {
      fillStyle = vi.fn();
      fillRect = vi.fn();
      setPosition = vi.fn();
      setDepth = vi.fn();
      lineStyle = vi.fn();
      strokeCircle = vi.fn();
      setVisible = vi.fn();
      destroy = vi.fn();
      clear = vi.fn();
      fillCircle = vi.fn();
    }
  },
  Math: {
    Distance: {
      Between: vi.fn((x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2))
    },
    Angle: {
      Between: vi.fn((x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1))
    }
  }
}));

// Mock Date.now for consistent testing
vi.useFakeTimers();

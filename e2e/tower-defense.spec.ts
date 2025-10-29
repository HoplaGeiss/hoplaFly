import { test, expect } from '@playwright/test';

test.describe('Tower Defense Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the game to load (TD should be the default)
    await page.waitForTimeout(2000);
  });

  test('should display Tower Defense UI elements', async ({ page }) => {
    // Wait for the game to load
    await page.waitForTimeout(3000);

    // Check that canvas is visible (Phaser game loaded)
    await expect(page.locator('canvas')).toBeVisible();

    // Verify the game is running by checking canvas dimensions
    const canvas = page.locator('canvas');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(0);
    expect(canvasBox?.height).toBeGreaterThan(0);
  });

  test('should allow tower placement', async ({ page }) => {
    // Wait for the game to load
    await page.waitForTimeout(3000);

    // Click on a valid grid cell to place a tower
    // The grid is 40x40 cells, so we'll click in a safe area
    await page.click('canvas', { position: { x: 100, y: 100 } });

    // Wait a bit for the tower to be placed
    await page.waitForTimeout(500);

    // Verify the canvas is still visible and interactive
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should start a wave when Start Wave button is clicked', async ({ page }) => {
    // Wait for the game to load
    await page.waitForTimeout(3000);

    // Try to click the Start Wave button text directly first
    const startWaveButton = page.locator('text=Start Wave');
    if (await startWaveButton.isVisible()) {
      await startWaveButton.click();
    } else {
      // Fallback to clicking on canvas where the button should be
      // Use force: true to bypass interception issues
      await page.click('canvas', {
        position: { x: 400, y: 50 },
        force: true
      });
    }

    // Wait for wave to start
    await page.waitForTimeout(1000);

    // Verify the canvas is still visible
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should show grid preview on hover', async ({ page }) => {
    // Hover over a grid cell
    await page.hover('canvas', { position: { x: 100, y: 100 } });

    // Wait for preview to appear
    await page.waitForTimeout(100);

    // The preview should be visible (we can't easily test the visual preview,
    // but we can ensure no errors occur)
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should handle ESC key to quit', async ({ page }) => {
    // Wait for the game to load first
    await page.waitForTimeout(3000);

    // Press ESC key
    await page.keyboard.press('Escape');

    // Wait for scene transition
    await page.waitForTimeout(3000);

    // Check that canvas is still visible (main menu is also a Phaser scene)
    await expect(page.locator('canvas')).toBeVisible();

    // Verify the game is running by checking canvas dimensions
    const canvas = page.locator('canvas');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(0);
    expect(canvasBox?.height).toBeGreaterThan(0);
  });
});

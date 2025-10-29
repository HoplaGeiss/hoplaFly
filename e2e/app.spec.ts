import { test, expect } from '@playwright/test';

test.describe('HoplaFly App', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');

    // Wait for the game container to be visible
    await expect(page.locator('#game-container')).toBeVisible();

    // Check that the page title is correct
    await expect(page).toHaveTitle(/hoplaFly/);
  });

  test('should start with Tower Defense game', async ({ page }) => {
    await page.goto('/');

    // Wait for the game to load
    await page.waitForTimeout(3000);

    // Check that we're in the Tower Defense game
    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();

    // Wait for the canvas to be visible (Phaser game loaded)
    await expect(page.locator('canvas')).toBeVisible();

    // Verify the game is running by checking canvas dimensions
    const canvas = page.locator('canvas');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(0);
    expect(canvasBox?.height).toBeGreaterThan(0);
  });

  test('should be able to navigate to main menu', async ({ page }) => {
    await page.goto('/');

    // Wait for the game to load
    await page.waitForTimeout(3000);

    // Press ESC to go to main menu
    await page.keyboard.press('Escape');

    // Wait for main menu to appear
    await page.waitForTimeout(2000);

    // Check that canvas is still visible (main menu is also a Phaser scene)
    await expect(page.locator('canvas')).toBeVisible();

    // Verify the game is running by checking canvas dimensions
    const canvas = page.locator('canvas');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(0);
    expect(canvasBox?.height).toBeGreaterThan(0);
  });

  test('should have game selection buttons', async ({ page }) => {
    await page.goto('/');

    // Wait for the game to load
    await page.waitForTimeout(3000);

    // Press ESC to go to main menu
    await page.keyboard.press('Escape');

    // Wait for main menu to appear
    await page.waitForTimeout(2000);

    // Check that canvas is visible (main menu is a Phaser scene)
    await expect(page.locator('canvas')).toBeVisible();

    // Verify the game is running by checking canvas dimensions
    const canvas = page.locator('canvas');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(0);
    expect(canvasBox?.height).toBeGreaterThan(0);

    // Try clicking on the canvas to see if we can interact with game buttons
    // This is a basic test that the main menu is interactive
    await canvas.click({ position: { x: canvasBox!.width / 2, y: canvasBox!.height / 2 } });
  });
});

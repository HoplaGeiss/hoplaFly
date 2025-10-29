import { test, expect } from '@playwright/test';

test.describe.skip('Bat Fly Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Wait for the game to load
    await page.waitForTimeout(2000);

    // Press ESC to go to main menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Click on Bat Fly game button - use partial text match
    await page.click('text=/🦇 Bat Fly/');

    // Wait for Bat Fly game to load
    await page.waitForTimeout(2000);
  });

  test('should display Bat Fly UI elements', async ({ page }) => {
    // Check for Bat Fly UI elements
    await expect(page.locator('text=Tap to fly!')).toBeVisible();
    await expect(page.locator('text=Score: 0')).toBeVisible();
    await expect(page.locator('text=hoplaTokens:')).toBeVisible();
    await expect(page.locator('text=ESC - Quit')).toBeVisible();
  });

  test('should start game on tap', async ({ page }) => {
    // Click to start the game
    await page.click('canvas');

    // Wait for game to start
    await page.waitForTimeout(500);

    // The tutorial text should be hidden
    await expect(page.locator('text=Tap to fly!')).not.toBeVisible();
  });

  test('should handle multiple taps for flying', async ({ page }) => {
    // Start the game
    await page.click('canvas');
    await page.waitForTimeout(500);

    // Tap multiple times to fly
    await page.click('canvas');
    await page.waitForTimeout(100);
    await page.click('canvas');
    await page.waitForTimeout(100);
    await page.click('canvas');

    // Game should still be running
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should handle ESC key to quit', async ({ page }) => {
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

  test('should have dark background (Bat Fly)', async ({ page }) => {
    // Check that we're in the Bat Fly game (dark background)
    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();

    // The Bat Fly game should have a dark background
    const backgroundColor = await gameContainer.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Check for dark background (Bat Fly)
    expect(backgroundColor).toMatch(/rgb\(4, 2, 24\)/); // #040218
  });
});

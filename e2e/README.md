# End-to-End Testing with Playwright

This directory contains end-to-end tests for the HoplaFly application using Playwright.

## Test Structure

- `app.spec.ts` - General application tests (loading, navigation)
- `tower-defense.spec.ts` - Tower Defense game specific tests
- `bat-fly.spec.ts` - Bat Fly game specific tests

## Running Tests

### Run all tests
```bash
pnpm run test:e2e
```

### Run tests with UI
```bash
pnpm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
pnpm run test:e2e:headed
```

### Debug tests
```bash
pnpm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test e2e/tower-defense.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

The tests are configured in `playwright.config.ts` at the project root. Key settings:

- **Base URL**: `http://localhost:4200` (Angular dev server)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Auto-start**: Dev server starts automatically before tests
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Tests run in parallel by default

## Writing Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('selector')).toBeVisible();
});
```

### Game Testing Tips

1. **Wait for Game Load**: Use `page.waitForTimeout(2000)` after navigation to allow Phaser games to initialize
2. **Canvas Interaction**: Use `page.click('canvas', { position: { x, y } })` for precise canvas clicks
3. **Text Locators**: Use `page.locator('text=Button Text')` for text-based element selection
4. **Keyboard**: Use `page.keyboard.press('Escape')` for keyboard interactions

### Common Patterns

```typescript
// Wait for game to load
await page.waitForTimeout(2000);

// Click on canvas at specific coordinates
await page.click('canvas', { position: { x: 100, y: 100 } });

// Check for text visibility
await expect(page.locator('text=Score: 0')).toBeVisible();

// Press keyboard keys
await page.keyboard.press('Escape');

// Check background color
const backgroundColor = await page.locator('#game-container').evaluate((el) => {
  return window.getComputedStyle(el).backgroundColor;
});
```

## CI/CD

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

Test reports are uploaded as artifacts and available for 30 days.

## Debugging

1. **Use the UI mode**: `pnpm run test:e2e:ui` for interactive debugging
2. **Use headed mode**: `pnpm run test:e2e:headed` to see the browser
3. **Use debug mode**: `pnpm run test:e2e:debug` to step through tests
4. **Add breakpoints**: Use `await page.pause()` in your test code
5. **Screenshots**: Playwright automatically takes screenshots on failure

## Best Practices

1. **Use data-testid attributes** for more reliable element selection
2. **Wait for elements** instead of using fixed timeouts when possible
3. **Test user workflows** rather than implementation details
4. **Keep tests independent** - each test should be able to run in isolation
5. **Use page object pattern** for complex test suites

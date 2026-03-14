import { test, expect } from '@playwright/test';

test('should display the main page correctly', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:5173');

  // Check that the title is correct
  await expect(page).toHaveTitle(/OllamaCheck/);

  // Check that the header exists
  await expect(page.getByRole('heading', { name: 'OllamaCheck' })).toBeVisible();

  // Check that category tabs are visible
  await expect(page.getByText('Code Agents')).toBeVisible();
  await expect(page.getByText('Vision')).toBeVisible();
  await expect(page.getByText('NLP')).toBeVisible();
  await expect(page.getByText('Embeddings')).toBeVisible();

  // Check that model cards are displayed
  const modelCards = page.getByRole('article');
  await expect(modelCards).toHaveCount(2); // Should have at least 2 mock cards
});
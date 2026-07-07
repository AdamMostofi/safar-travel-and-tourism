import { expect, test } from '@playwright/test'

test('packages list renders seeded Packages', async ({ page }) => {
  await page.goto('/packages')

  await expect(page.getByRole('heading', { level: 1, name: 'Packages' })).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Get the Best out of Maldives' }),
  ).toBeVisible()
})

test('a Package detail page renders from the data layer', async ({ page }) => {
  await page.goto('/packages')
  await page.getByRole('link', { name: /Get the Best out of Maldives/ }).click()

  await expect(page).toHaveURL(/\/packages\/maldives$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Get the Best out of Maldives' }),
  ).toBeVisible()
  await expect(page.getByText('Starting $1299')).toBeVisible()
})

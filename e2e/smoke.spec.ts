import { expect, test } from '@playwright/test'

test('home page renders featured content, proof metrics, and footer', async ({ page }) => {
  await page.goto('/')

  // Cinematic hero headline.
  await expect(
    page.getByRole('heading', { level: 1, name: /Journeys worth taking/ }),
  ).toBeVisible()

  // Featured sections pulled from the data layer.
  await expect(
    page.getByRole('heading', { level: 2, name: 'Featured Packages' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Featured Destinations' }),
  ).toBeVisible()

  // A proof-metric counter from SiteSettings.
  await expect(page.getByText('Years of experience')).toBeVisible()

  // Footer with real contact details from SiteSettings.
  const footer = page.getByRole('contentinfo')
  await expect(
    footer.getByRole('link', { name: 'info@safartravelandtourism.com' }),
  ).toHaveAttribute('href', 'mailto:info@safartravelandtourism.com')
  await expect(footer.getByRole('link', { name: 'WhatsApp us' })).toHaveAttribute(
    'href',
    'https://wa.me/96181800480',
  )
})

test('home hero content stays visible under reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: /Journeys worth taking/ }),
  ).toBeVisible()
  // Counters jump straight to the final value rather than ticking.
  await expect(page.getByText('Years of experience')).toBeVisible()

  await context.close()
})

test('packages list renders seeded Packages', async ({ page }) => {
  await page.goto('/packages')

  await expect(page.getByRole('heading', { level: 1, name: 'Packages' })).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Maldives' }),
  ).toBeVisible()
})

test('a Package detail page renders from the data layer', async ({ page }) => {
  await page.goto('/packages')
  await page.getByRole('link', { name: /Maldives/ }).first().click()

  await expect(page).toHaveURL(/\/packages\/maldives$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Maldives' }),
  ).toBeVisible()
  await expect(page.getByText('Starting $1299')).toBeVisible()
})

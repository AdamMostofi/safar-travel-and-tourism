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

test('the home page shows traveller testimonials from the CMS', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Travellers on Safar' }),
  ).toBeVisible()
  // First Featured testimonial (sorted by author).
  await expect(page.getByText('Karim Nassar')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Next testimonial' }),
  ).toBeVisible()
})

test('packages list renders seeded Packages', async ({ page }) => {
  await page.goto('/packages')

  await expect(page.getByRole('heading', { level: 1, name: 'Packages' })).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Maldives' }),
  ).toBeVisible()
})

test('a Package detail page renders information, inclusions, and gallery', async ({
  page,
}) => {
  await page.goto('/packages/maldives')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Maldives' }),
  ).toBeVisible()
  await expect(page.getByText('Starting $1299')).toBeVisible()

  // Inclusions list from the data layer.
  await expect(page.getByRole('heading', { name: /included/i })).toBeVisible()
  await expect(page.getByText('Accommodation')).toBeVisible()

  // Rotating photo gallery carousel.
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible()
})

test('filtering Packages by Destination narrows the grid', async ({ page }) => {
  await page.goto('/packages')

  // Both a Maldives and a Turkey Package are present unfiltered.
  await expect(page.getByRole('heading', { level: 2, name: 'Maldives' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Istanbul' })).toBeVisible()

  // Selecting the Maldives chip drops the Turkey Package.
  await page.getByRole('button', { name: /^Maldives/ }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Maldives' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Istanbul' })).toHaveCount(0)
})

test('a Destination page lists its Packages', async ({ page }) => {
  await page.goto('/destinations')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Destinations' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Explore Turkey' }).click()
  await expect(page).toHaveURL(/\/destinations\/turkey$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Turkey' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Packages to Turkey' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Istanbul' })).toBeVisible()
})

test('the Cruises index lists Cruises and a detail page renders', async ({ page }) => {
  await page.goto('/cruises')

  await expect(page.getByRole('heading', { level: 1, name: 'Cruises' })).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'MSC Seaside' }),
  ).toBeVisible()

  await page.getByRole('link', { name: /MSC Seaside/ }).first().click()
  await expect(page).toHaveURL(/\/cruises\/msc-seaside$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'MSC Seaside' }),
  ).toBeVisible()
  await expect(page.getByText('Starting $2100')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible()
})

test('an unknown Cruise slug renders the branded not-found', async ({ page }) => {
  await page.goto('/cruises/not-a-cruise')
  await expect(
    page.getByRole('heading', { name: /couldn.t find that page/i }),
  ).toBeVisible()
})

test('the About page presents the story, services, and mission', async ({ page }) => {
  await page.goto('/about')

  await expect(page.getByRole('heading', { level: 1, name: /Beirut travel agency/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: /between the daydream/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: 'Curated Packages' })).toBeVisible()
  await expect(page.getByText('Our mission')).toBeVisible()
})

test('the Contact page shows CMS-driven, clickable channels', async ({ page }) => {
  await page.goto('/contact')

  await expect(page.getByRole('heading', { level: 1, name: 'Contact us' })).toBeVisible()

  const main = page.getByRole('main')

  // Phone numbers are real tel: links (fixing the old site's non-clickable numbers).
  await expect(
    main.getByRole('link', { name: '+961 81 800 480' }),
  ).toHaveAttribute('href', 'tel:+96181800480')

  // Email + WhatsApp deep-link from SiteSettings.
  await expect(
    main.getByRole('link', { name: 'info@safartravelandtourism.com' }),
  ).toHaveAttribute('href', 'mailto:info@safartravelandtourism.com')
  await expect(
    main.getByRole('link', { name: /Message us on WhatsApp/ }),
  ).toHaveAttribute('href', /wa\.me\/96181800480/)

  // Address + map location cue.
  await expect(main.getByText('Clemenceau, Beirut, Lebanon')).toBeVisible()
  await expect(main.getByRole('link', { name: /View on Google Maps/ })).toBeVisible()
})

test('the Request-this-trip form captures an enquiry and confirms', async ({ page }) => {
  await page.goto('/packages/maldives')

  const form = page.locator('#enquire')
  await expect(form.getByRole('heading', { name: 'Request this trip' })).toBeVisible()

  // The WhatsApp CTA is prefilled with the trip and Starting Price.
  await expect(
    form.getByRole('link', { name: /ask on WhatsApp/i }),
  ).toHaveAttribute('href', /wa\.me\/96181800480.*Maldives/)

  await form.getByLabel('Your name').fill('E2E Traveller')
  await form.getByLabel('Phone, email, or WhatsApp').fill('e2e@example.com')
  await form.getByRole('button', { name: 'Request this trip' }).click()

  await expect(
    page.getByRole('heading', { name: /Enquiry sent/ }),
  ).toBeVisible()
})

test('an unknown slug renders the branded not-found', async ({ page }) => {
  await page.goto('/packages/does-not-exist')

  await expect(page.getByRole('heading', { name: /couldn.t find that page/i })).toBeVisible()
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Browse Packages' }),
  ).toBeVisible()
})

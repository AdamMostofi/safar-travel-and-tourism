import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Automated accessibility pass (issue #9). Runs axe-core against the key page
 * types and fails on any WCAG 2 A/AA violation — covering the gaps the crawl
 * flagged on the old site (landmarks, labelled fields, alt text, heading order,
 * aria-labelled icon controls). Complements the manual landmark/heading checks.
 */
const KEY_PAGES = [
  { name: 'home', path: '/' },
  { name: 'packages index', path: '/packages' },
  { name: 'package detail (with enquiry form)', path: '/packages/maldives' },
  { name: 'destinations index', path: '/destinations' },
  { name: 'destination detail', path: '/destinations/turkey' },
  { name: 'cruise detail', path: '/cruises/msc-seaside' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
]

for (const { name, path } of KEY_PAGES) {
  test(`${name} has no automatically-detectable a11y violations`, async ({ page }) => {
    await page.goto(path)
    // A single <main> landmark on every page.
    await expect(page.getByRole('main')).toHaveCount(1)

    // Force every element to its final, revealed state: the reveal-on-scroll
    // primitive starts content at opacity 0, and axe would otherwise measure
    // colour contrast against a mid-fade (near-transparent) foreground. This
    // tests the real, settled content colours — not a transient animation frame.
    await page.addStyleTag({
      content:
        '*, *::before, *::after { opacity: 1 !important; transition: none !important; animation: none !important; }',
    })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
}

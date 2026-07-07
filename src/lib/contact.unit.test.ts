import { describe, expect, it } from 'vitest'

import { mailtoLink, telLink, whatsappLink } from './contact'

/**
 * Contact details on the home page and footer come from `SiteSettings` and must
 * become correct, clickable links (PRD story 29). These pure builders encode
 * that formatting so the footer/CTA components stay declarative and the link
 * shapes are asserted here rather than in a browser.
 */
describe('contact links', () => {
  describe('telLink', () => {
    it('builds a tel: href, keeping the leading + and dropping spaces', () => {
      expect(telLink('+961 81 800 480')).toBe('tel:+96181800480')
    })

    it('is null for blank input', () => {
      expect(telLink(null)).toBeNull()
      expect(telLink(undefined)).toBeNull()
      expect(telLink('')).toBeNull()
    })
  })

  describe('mailtoLink', () => {
    it('builds a mailto: href', () => {
      expect(mailtoLink('info@safartravelandtourism.com')).toBe(
        'mailto:info@safartravelandtourism.com',
      )
    })

    it('is null when there is no email', () => {
      expect(mailtoLink(null)).toBeNull()
    })
  })

  describe('whatsappLink', () => {
    it('builds a wa.me link from digits only', () => {
      expect(whatsappLink('96181800480')).toBe('https://wa.me/96181800480')
    })

    it('strips non-digits (e.g. a formatted number) before building the link', () => {
      expect(whatsappLink('+961 81 800 480')).toBe('https://wa.me/96181800480')
    })

    it('appends a URL-encoded prefilled message when given one', () => {
      expect(whatsappLink('96181800480', 'Hi Safar, I have a question')).toBe(
        'https://wa.me/96181800480?text=Hi%20Safar%2C%20I%20have%20a%20question',
      )
    })

    it('is null when there is no number', () => {
      expect(whatsappLink(null)).toBeNull()
      expect(whatsappLink('')).toBeNull()
    })
  })
})

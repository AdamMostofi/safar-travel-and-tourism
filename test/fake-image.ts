import type { ImageFetcher } from '../src/seed/seedContent'

/**
 * A 1×1 transparent PNG — the smallest valid image Payload's uploads pipeline
 * (sharp) will accept. Tests and the e2e setup inject `fakeImageFetcher` so
 * seeding uploads this placeholder instead of hitting the network, keeping
 * runs fast and deterministic.
 */
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

export const fakeImageFetcher: ImageFetcher = async (url) => {
  const { pathname } = new URL(url)
  const base = decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1))
  // Force a .png name so the extension agrees with the PNG bytes we upload.
  const name = `${base.replace(/\.[^.]+$/, '')}.png`
  return { data: PNG_1x1, mimetype: 'image/png', name }
}

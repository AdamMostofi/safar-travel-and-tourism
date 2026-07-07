import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bo.safartravelandtourism.com',
      },
    ],
  },
}

export default withPayload(nextConfig)

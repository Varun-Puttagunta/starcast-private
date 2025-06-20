/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: '*.space.com',
      },
      {
        protocol: 'https',
        hostname: '*.spaceflightnow.com',
      },
      {
        protocol: 'https',
        hostname: '*.arstechnica.net',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'www.nasaspaceflight.com',
      },
      {
        protocol: 'https',
        hostname: 'spacenews.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.arstechnica.net',
      },
      {
        protocol: 'https',
        hostname: 'www.teslarati.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'mk0spaceflightnoa02a.kinstacdn.com',
      },
      {
        protocol: 'https',
        hostname: 'www.esa.int',
      },
    ],
    domains: [
      'spacepolicyonline.com',
      'europeanspaceflight.com',
      // add other domains as needed
    ],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Allow large video file uploads (200MB)
  api: {
    bodyParser: false,
    responseLimit: '200mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
}

module.exports = nextConfig

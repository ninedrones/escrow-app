/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/01994aa1-65fa-c2af-dd85-7356cc88d601',
        permanent: false, // 307 Temporary Redirect
      },
    ];
  },
}

module.exports = nextConfig

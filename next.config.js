/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack: (config, { dev, isServer }) => {
    // Disable filesystem cache when in development mode
    if (dev) {
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

module.exports = nextConfig; 
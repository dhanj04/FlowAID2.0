/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    
    // When using output: 'export', images must be unoptimized
    images: {
      unoptimized: true,
    },
    
    // Disable the X-Powered-By header
    poweredByHeader: false,
    
    // For a GitHub Pages deployment with a custom domain or username.github.io, use:
    basePath: process.env.NODE_ENV === 'production' ? '/beautiful-reactive-website' : '',

    // Adjust webpack config to fix module issues
    webpack: (config) => {
      return config;
    },
};

module.exports = nextConfig;
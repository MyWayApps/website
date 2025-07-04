/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Add any other Next.js config options here
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;
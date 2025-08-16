/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  async rewrites() {
    return [
      // Remove or update this block if present:
      // {
      //   source: '/api/analyze/:path*',
      //   destination: 'https://api.example.com/:path*',
      // },
      // If you want to keep a rewrite for /api, update accordingly:
      // {
      //   source: '/api/:path*',
      //   destination: 'https://api.example.com/:path*',
      // },
    ]
  },
};

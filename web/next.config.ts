import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  rewrites: async () => ({
    beforeFiles: [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ],
  }),
};

export default config;

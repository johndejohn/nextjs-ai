import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disabled cacheComponents because the app uses dynamic data (database, auth, cookies)
  // which requires dynamic rendering
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;

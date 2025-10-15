import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: process.env.DOMAIN_URL!,
        pathname: '/media/**',
      }
    ],
  },

};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
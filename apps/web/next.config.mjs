/** @type {import('next').NextConfig} */
const isVercel = !!process.env.VERCEL;

const nextConfig = {
  output: isVercel ? undefined : 'standalone',
  transpilePackages: ['@toolkit/shared', '@toolkit/database'],
  poweredByHeader: false,
  async rewrites() {
    const internal = process.env.API_INTERNAL_URL;
    if (!internal) return [];
    return [{ source: '/api/:path*', destination: `${internal}/api/:path*` }];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  }
};

export default nextConfig;

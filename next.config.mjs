/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/rarityaudit',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

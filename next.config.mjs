/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/rarityaudit',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: '/demo',
        destination: 'https://demo.dhisoft.in/',
        permanent: true,
      },
    ];
  },
  experimental: {
    cpus: 2,
  },
};
export default nextConfig;

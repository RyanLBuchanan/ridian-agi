/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath: process.env.NEXT_PUBLIC_APP_BASE_PATH || "",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

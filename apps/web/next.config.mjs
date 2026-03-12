/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  basePath: process.env.NEXT_PUBLIC_APP_BASE_PATH || "",
};

export default nextConfig;

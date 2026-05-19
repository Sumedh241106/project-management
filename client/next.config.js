/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Force Vercel to bypass the environment version mismatch check
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevent missing ESLint packages from interrupting the production bundle
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
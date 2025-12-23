// next.config.mjs (Updated)
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Option 2: Turbopack warning ko silence karne ke liye
  turbopack: {},

  // Aur Webpack config jo pehle se maujood hai
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;

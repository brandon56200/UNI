/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        readline: false,
        net: false,
        tls: false,
        'parquet-types': false,
        '../gen-nodejs/parquet_types': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 
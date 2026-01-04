import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure images for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8001',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
    ],
    domains: ['127.0.0.1', 'localhost', 'uyfoz23z622dkniz.public.blob.vercel-storage.com', 'randomuser.me'],
  },

  // Configure experimental features including Turbopack
  experimental: {
    turbo: {
      // Turbopack configuration
      rules: {
         "*.mdx": ["mdx-loader"]
      },
      resolveAlias: {
        // Add any path aliases here if needed
      },
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },
  
  // Configure webpack for non-Turbopack builds
  webpack: (config, { dev, isServer }) => {
    // Apply webpack-specific optimizations
    if (dev) {
      // Disable caching in development to avoid manifest issues
      config.cache = false;
    }
    
    // Configure file system fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
  
  // Configure build settings
  generateBuildId: async () => {
    // Use timestamp for build id to avoid caching issues
    return `build-${Date.now()}`;
  },
  
  // Improve build stability
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;

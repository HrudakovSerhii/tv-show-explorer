import type { NextConfig } from 'next';

async function headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://static.tvmaze.com https://images.unsplash.com; connect-src 'self'; frame-ancestors 'none';",
        },
      ],
    },
  ];
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'static.tvmaze.com',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  cacheLife: {
    search: {
      stale: 300, // 5 minutes
      revalidate: 600, // 10 minutes
      expire: 3600, // 1 hour
    },
    show: {
      stale: 3600, // 1 hour
      revalidate: 7200, // 2 hours
      expire: 86400, // 1 day
    },
    episode: {
      stale: 86400, // 1 day
      revalidate: 172800, // 2 days
      expire: 604800, // 7 days
    },
    season: {
      stale: 86400, // 1 day
      revalidate: 172800, // 2 days
      expire: 604800, // 7 days
    },
  },
  turbopack: {},
  webpack: (config, { defaultLoaders, isServer }) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        defaultLoaders.babel,
        {
          loader: '@compiled/webpack-loader',
          options: {
            extract: true, // Extract CSS to separate files
            transformerBabelPlugins: ['@atlaskit/tokens/babel-plugin'],
          },
        },
      ],
    });

    return config;
  },
  // If you use CSS extraction, you might need to ensure Next.js handles the generic CSS
  // usually, Next.js handles extracted .css files automatically if they are imported.
  headers,
};

export default nextConfig;

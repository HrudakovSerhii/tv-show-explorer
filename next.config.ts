import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
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
};

export default nextConfig;

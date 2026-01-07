// babel.config.js
module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['@atlaskit/tokens/babel-plugin', { shouldUseAutoFallback: true }],
    [
      '@compiled/babel-plugin',
      {
        transformerBabelPlugins: ['@atlaskit/tokens/babel-plugin'],
        importReact: false,
      },
    ],
  ],
};

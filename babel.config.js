// babel.config.js
module.exports = {
    presets: ['next/babel'], // Keeps Next.js defaults
    plugins: [
        ['@atlaskit/tokens/babel-plugin', { shouldUseAutoFallback: true }],
        [
            '@compiled/babel-plugin',
            {
                transformerBabelPlugins: ['@atlaskit/tokens/babel-plugin'],
                importReact: false, // Next.js handles React import
            },
        ],
    ],
};

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import atlaskitPlugin from '@atlaskit/eslint-plugin-design-system';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
  ]),
  {
    plugins: {
      '@atlaskit/design-system': atlaskitPlugin,
    },
    rules: {
      ...atlaskitPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'vitest.setup.tsx', 'src/test-utils.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
    },
  },
  prettierConfig,
]);

export default eslintConfig;

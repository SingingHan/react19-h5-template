const tsParser = require('@typescript-eslint/parser');
const tsPluginRaw = require('@typescript-eslint/eslint-plugin');
const reactHooksPluginRaw = require('eslint-plugin-react-hooks');
const reactRefreshPluginRaw = require('eslint-plugin-react-refresh');
const prettierConfig = require('eslint-config-prettier');

const tsPlugin = tsPluginRaw.default ?? tsPluginRaw;
const reactHooksPlugin = reactHooksPluginRaw.default ?? reactHooksPluginRaw;
const reactRefreshPlugin = reactRefreshPluginRaw.default ?? reactRefreshPluginRaw;

module.exports = [
  {
    ignores: ['dist', 'node_modules', 'coverage', '**/*.d.ts']
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.eslint.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': 'warn'
    }
  }
];

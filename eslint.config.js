import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

// Architecture rules (see README "Architecture"):
//   app  ->  features  ->  shared      (imports only point to the right)
//   a feature reaches another feature only through its index.js
const NO_DEEP_FEATURE_IMPORTS = {
  group: ['@features/*/*'],
  message: "Import other features through their public index: '@features/<name>'.",
}
const NO_APP_IMPORTS = {
  group: ['@app', '@app/*'],
  message: 'Only src/main.jsx and src/app may import from @app.',
}
const NO_FEATURE_IMPORTS = {
  group: ['@features', '@features/*'],
  message: 'shared/ must not depend on features. Pass data in through props instead.',
}

export default [
  { ignores: ['dist', 'node_modules'] },
  { settings: { react: { version: 'detect' } } },

  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,

  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react/prop-types': 'off', // plain JavaScript project without PropTypes
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': 'warn',
      // These three rules prepare code for the React Compiler, which this project
      // does not use. They flag working patterns (a ref kept in sync during render,
      // state reset in an effect, a forwarded dependency list); changing those would
      // change runtime behaviour. Turn them back on if the compiler is adopted.
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      'no-restricted-imports': ['error', { patterns: [NO_DEEP_FEATURE_IMPORTS] }],
    },
  },
  {
    files: ['src/features/**/*.{js,jsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [NO_DEEP_FEATURE_IMPORTS, NO_APP_IMPORTS] }] },
  },
  {
    files: ['src/shared/**/*.{js,jsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [NO_FEATURE_IMPORTS, NO_APP_IMPORTS] }] },
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },

  // Turns off formatting rules that would conflict with Prettier. Keep last.
  prettier,
]

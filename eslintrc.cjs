// .eslintrc.cjs
// Configuração do ESLint usada por "npm run lint" (eslint . --ext ts,tsx).
module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  // Pastas e arquivos gerados pelo build (o "tsc -b" gera vite.config.js e vite.config.d.ts ao lado do vite.config.ts).
  ignorePatterns: ['dist', 'node_modules', 'vite.config.js', 'vite.config.d.ts', '*.tsbuildinfo'],
};

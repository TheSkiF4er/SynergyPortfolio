/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js'],
  // Проект на ESM (type: module). Для Jest нужно включить vm-modules через NODE_OPTIONS.
};

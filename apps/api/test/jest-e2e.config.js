/** E2E test: test/**\/*.e2e-spec.ts (khởi động cả ứng dụng Nest, gọi HTTP). */
module.exports = {
  rootDir: '.',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.json' }] },
  testEnvironment: 'node',
};

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__test__/**/*.test.ts'], 
    setupFiles: ['<rootDir>/jest.setup.ts'],
    testTimeout: 30000,
};
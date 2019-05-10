module.exports = {
    coveragePathIgnorePatterns: [
        '<rootDir>/test/', 
        '<rootDir>/node_modules/'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js'
    ],
    collectCoverage: true,
    coverageDirectory: '<rootDir>/test/coverage',
    testEnvironment: 'node'
}
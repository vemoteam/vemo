module.exports = {
    coveragePathIgnorePatterns: [
        '<rootDir>/test/', 
        '<rootDir>/node_modules/'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js'
    ],
    collectCoverage: true,
    testEnvironment: 'node'
}
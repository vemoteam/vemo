const utils = require('./../dist/utils')

describe('utils.js', () => {
    test('cpuNum getter', () => {
        expect(utils.cpuNum).toBeGreaterThanOrEqual(4)
    })

    test('logger', () => {
        const { logger } = utils
        const levels = ['log', 'info', 'success', 'warn', 'error']
        const valid = levels.reduce((pre, current) => pre && typeof logger[current] === 'function', true)
        expect(valid).toBeTruthy()
    })
})
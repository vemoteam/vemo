const utils = require('./../dist/utils')

describe('utils.js', () => {
    test('cpuNum getter', () => {
        expect(utils.cpuNum).toBeGreaterThanOrEqual(4)
    })
})
const utils = require('./../src/utils')

describe('utils.js', () => {
    test('cpuNum getter', () => {
        expect(utils.cpuNum).toBeGreaterThanOrEqual(4)
    })
})
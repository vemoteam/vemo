const { VemoError } = require('./../src/error')


describe('error.js', () => {

    test('Throw VemoError', () => {
        function throwVemoError() {
            throw new VemoError()
        }

        expect(throwVemoError).toThrow(Error)
        expect(throwVemoError).toThrow(VemoError)
    })

    test('VemoError should have code and message', () => {
        const properties = ['code', 'message']
        const vemoError = new VemoError()
        expect(
            properties.every(prop => vemoError.hasOwnProperty(prop))
        ).toBe(true)
    })

})

// const vemoError = new VemoError(VemoFileNotExist, 'vemo file not exist')
// console.log(vemoError instanceof Error)
// console.log(vemoError.hasOwnProperty('code'))
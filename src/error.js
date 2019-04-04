class VemoError extends Error {
    constructor(code, message) {
        super(message)
        this.code = code
        this.message = message
    }
}

exports.VemoError = VemoError

exports.VemoFileNotExist = 'VemoFileNotExist'
exports.ConfigRootNotExist = 'ConfigRootNotExist'
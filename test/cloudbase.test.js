const { 
    secretId, 
    secretKey 
} = require('./config')

const options = {
    secretId,
    secretKey,
    env: true,
    isProduction: true
}

const axios = require('axios')
const cloudBaseMiddleware = require('./../src/cloudbase')(options)

jest.mock('axios')

describe('cloudbase.js', () => {

    beforeEach(() => new Promise((resolve) => {
        process.env.TENCENTCLOUD_SESSIONTOKEN = -1
        process.env.TENCENTCLOUD_SECRETEXPIRE = -1
        resolve(true)
    }))

    afterEach(() => new Promise((resolve) => {
        process.env.TENCENTCLOUD_SESSIONTOKEN = null
        process.env.TENCENTCLOUD_SECRETEXPIRE = null
        resolve(true)
    }))

    test('cloudBaseMiddleware should run async funtion', async () => {
        expect.assertions(1)
        
        let time = 0
        async function sleep() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    time = 100
                    resolve(true)
                }, 100)
            })
        }
    
        await cloudBaseMiddleware({}, sleep)
        expect(time).toEqual(100)
    
    })
    
    test('getTempSecret should get tencent cloud temporary secret', async () => {
        axios.get.mockResolvedValue({
            data: {
                TmpSecretId: 'testTmpSecretId',
                TmpSecretKey: 'testTmpSecretKey',
                Token: 'testToken',
                ExpiredTime: Date.now()
            }
        })
        
        await cloudBaseMiddleware({}, async () => {})
    })

})


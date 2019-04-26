process.chdir(__dirname) // change work dir for positioning vemofile.js 
require('./../../src/') // run server

const axios = require('axios')
const config = require('./vemofile')
const instance = axios.create({
    baseURL: `http://${config.host}:${config.port}`
})

describe('index.js api server', () => {

    test('template response should be HTML', async () => {
        expect.assertions(2)
        const { data, status } = await instance.get('/home')

        expect(status).toEqual(200)
        expect(data).toMatch(/<html>.*<\/html>/is)
    })

    test('post and validate check', async () => {
        expect.assertions(2)
        const params = {
            param1: 'test',
            param2: 123
        }
        const { data, status } = await instance.post('/api', params)
        
        expect(status).toEqual(200)
        expect(JSON.stringify(data))
            .toEqual(JSON.stringify(params))
    })

})

describe('index.js static server', () => {

    test('', async () => {
        expect.assertions(3)
        const { 
            data,
            status, 
            headers 
        } = await instance.get('/demo.txt')

        expect(typeof data).toEqual('string')
        expect(status).toEqual(200)
        expect(headers['content-type']).toMatch(/text\/plain/i)
    })
})

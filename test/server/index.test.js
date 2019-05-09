process.chdir(__dirname) // change work dir for positioning vemofile.js 
require('./../../dist/') // run server

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

    test('check file type, content and status', async () => {
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

describe('index.js websocket server', () => {

    test('connect should be ok', async () => {
        expect.assertions(1)
        const {data} = await instance.get('/chat')

        expect(data).toMatch(/<html>.*<\/html>/is)
    })

    test('client receive msg from server and update dom content', async () => {
        expect.hasAssertions()

        async function launchBrowser() {
            try {
                const puppeteer = require('puppeteer')
                const browser = await puppeteer.launch()
                return browser
            } catch(error) {
                console.log(
                    'Don\'t run test in Windows. \n' + 
                    'If you fail to launch on UNIX, please install dependencies. \n' +
                    'More info: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md. \n'
                )
                return null
            }
        }

        const browser = await launchBrowser()
        if(browser) {
            const page = await browser.newPage()
            await page.goto(`http://${config.host}:${config.port}/chat`)
            await page.waitFor(2000)
            const content = await page.content()
            expect(content).toMatch(/baby/is)
            await page.close()
            await browser.close()
        } else {
            expect(browser).toBeNull()
        }
    })

})

const puppeteer = require('puppeteer')
const { readdirSync } = require('fs')
const { setTimeout } = require('timers/promises')
const DownloadTimeoutError = require('../../errors/browser/DownloadTimeoutError')
const { exec } = require('child_process')
const get = require('../../utils/request/get')
const BrowserConnectionError = require('../../errors/browser/BrowserConnectionError')
const { env } = require('../../env')
const { URL } = require('url')

class PuppeteerAdapter {

    #page = null
    /**
      * @param config {import('puppeteer-core').LaunchOptions & import('puppeteer-core').BrowserConnectOptions & import('puppeteer-core').BrowserLaunchArgumentOptions}
      * @returns {import('puppeteer-core').Browser & {closeAllPages: Function}}
      */
    async handleBrowser(config) {
        if (global.browser && global.browser.isConnected()) return global.browser / usr / bin / google - chrome - stable

        if (env.CREATE_BROWSER_BY_WS_ENDPOINT) {
            const chromeCommandStart = this.#getChromeCommandStart()
            exec(chromeCommandStart)
            await setTimeout(5000)
            const chromeDebugData = await get(env.CHROME_REMOTE_DEBUGGING_URL)
            const webSocketDebuggerUrl = chromeDebugData?.data?.webSocketDebuggerUrl
            if (!webSocketDebuggerUrl) {
                throw new BrowserConnectionError('Não foi possível obter o webSocketDebuggerUrl')
            }
            global.browser = await puppeteer.connect({
                browserWSEndpoint: webSocketDebuggerUrl,
                ...config
            })

            global.browser.closeAllPages = () => this.closeAllPages(global.browser)

            return global.browser
        }
        global.browser = await puppeteer.launch(config)
        global.browser.closeAllPages = () => this.closeAllPages(global.browser)

        return global.browser
    }

    /**
      * @param config {import('puppeteer-core').LaunchOptions & import('puppeteer-core').BrowserConnectOptions & import('puppeteer-core').BrowserLaunchArgumentOptions}
      * @param browser {import('puppeteer-core').Browser}
      * @returns {import('puppeteer-core').Page & {setDownloadDirectory: Function, waitForDownload: Function, clearAllCookies: Function, closeAllPages: Function}}
      */
    async handlePage(browser, config) {
        this.#page = await browser.newPage()

        this.#page.setDefaultTimeout(config.defaultTimeout)
        this.#page.setDefaultNavigationTimeout(config.defaultNavigationTimeout)

        await this.#page.setViewport(config.defaultViewport)

        config.pathDownload ? await this.setDownloadDirectory(config.pathDownload) : ''

        this.#page.setDownloadDirectory = this.setDownloadDirectory
        this.#page.waitForDownload = this.waitForDownload
        this.#page.clearAllCookies = () => this.clearAllCookies()


        return this.#page
    }

    /**
     *
     * @param path  {string}
     * @param page  {import('puppeteer-core').Page}
     */
    async setDownloadDirectory(path) {
        const client = await this.#page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
            downloadPath: path,
            behavior: 'allow'
        })
    }


    /**
     *   @param browser {import('puppeteer-core').Browser}
    */
    async closeAllPages(browser) {
        try {
            const pages = await browser.pages()
            for (const page of pages) {
                await page.close()
            }
        } catch (error) { }
    }

    async clearAllCookies() {
        const client = await this.#page.target().createCDPSession()
        await client.send('Network.clearBrowserCookies')
    }

    async waitForDownload(pathDownload, limit = 0) {
        if (limit >= 60000) {
            throw new DownloadTimeoutError('Limite para o download excedido')
        }
        const string = readdirSync(pathDownload).join('')
        if (!string.includes('crdownload')) {
            if (env.FILE_NAME_DOWNLOAD && !string.includes(env.FILE_NAME_DOWNLOAD)) {
                await setTimeout(1500)
                return await this.waitForDownload(pathDownload, limit + 1500)
            }
        }

        return true
    }

    #getChromeCommandStart() {
        const url = new URL(env.CHROME_REMOTE_DEBUGGING_URL)
        if (process.platform === 'win32') {
            return `"${env.EXECUTABLE_PATH} --remote-debugging-port=${url.port}"`
        }
        return `${env.EXECUTABLE_PATH} --remote-debugging-port=${url.port}`
    }
}

module.exports = PuppeteerAdapter

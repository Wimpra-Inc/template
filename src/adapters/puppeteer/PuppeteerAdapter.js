const puppeteer = require('puppeteer')
const { readdirSync } = require('fs')
const { setTimeout } = require('timers/promises')
const DownloadTimeoutError = require('../../errors/browser/DownloadTimeoutError')
const { spawn } = require('child_process')
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
  async handleBrowser (config) {
    if (global.app.BROWSER && global.app.BROWSER.connected) {
      return global.app.BROWSER
    }

    if (env.CREATE_BROWSER_BY_WS_ENDPOINT) {
      const chromeCommandStart = this.#getChromeCommandStart()
      const webSocketDebuggerUrl = await this.#startChrome(
        chromeCommandStart
      )
      if (!webSocketDebuggerUrl) {
        throw new BrowserConnectionError(
          'Não foi possível obter o webSocketDebuggerUrl'
        )
      }
      global.app.BROWSER = await puppeteer.connect({
        browserWSEndpoint: webSocketDebuggerUrl,
        ...config
      })

      global.app.BROWSER.closeAllPages = () =>
        this.closeAllPages(global.app.BROWSER)

      return global.app.BROWSER
    }
    global.app.BROWSER = await puppeteer.launch(config)
    global.app.BROWSER.closeAllPages = () => this.closeAllPages(global.app.BROWSER)

    return global.app.BROWSER
  }

  /**
     * @param config {import('puppeteer-core').LaunchOptions & import('puppeteer-core').BrowserConnectOptions & import('puppeteer-core').BrowserLaunchArgumentOptions}
     * @param browser {import('puppeteer-core').Browser}
     * @returns {import('puppeteer-core').Page & {setDownloadDirectory: Function, waitForDownload: Function, clearAllCookies: Function, closeAllPages: Function}}
     */
  async handlePage (browser, config) {
    this.#page = await browser.newPage()

    this.#page.setDefaultTimeout(config.defaultTimeout)
    this.#page.setDefaultNavigationTimeout(config.defaultNavigationTimeout)

    await this.#page.setViewport(config.defaultViewport)

    config.pathDownload
      ? await this.setDownloadDirectory(config.pathDownload)
      : ''

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
  async setDownloadDirectory (path) {
    const client = await this.#page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
      downloadPath: path,
      behavior: 'allow'
    })
  }

  /**
     *   @param browser {import('puppeteer-core').Browser}
     */
  async closeAllPages (browser) {
    try {
      const pages = await browser.pages()
      for (const page of pages) {
        await page.close()
      }
    } catch (error) {}
  }

  async clearAllCookies () {
    const client = await this.#page.target().createCDPSession()
    await client.send('Network.clearBrowserCookies')
  }

  async waitForDownload (pathDownload, limit = 0) {
    if (limit >= 60000) {
      throw new DownloadTimeoutError('Limite para o download excedido')
    }
    const string = readdirSync(pathDownload).join('')
    if (!string.includes('crdownload')) {
      if (
        env.FILE_NAME_DOWNLOAD &&
                !string.includes(env.FILE_NAME_DOWNLOAD)
      ) {
        await setTimeout(1500)
        return await this.waitForDownload(pathDownload, limit + 1500)
      }
    }

    return true
  }

  #startChrome (command) {
    return new Promise((resolve, reject) => {
      const processo = spawn(command, { shell: true })
      let debbugingUrl = null

      processo.stdout.on('data', (data) => {
        const texto = data.toString()
        if (texto.includes('DevTools listening on')) {
          debbugingUrl = texto
            .replace('DevTools listening on', '')
            .trim()
          resolve(debbugingUrl)
        }
      })

      processo.stderr.on('data', (data) => {
        const texto = data.toString()
        if (texto.includes('DevTools listening on')) {
          debbugingUrl = texto
            .replace('DevTools listening on', '')
            .trim()
          resolve(debbugingUrl)
        }
      })

      processo.on('close', async (code) => {
        if (code === 0) {
          if (!debbugingUrl) {
            const chromeDebugData = await get(
              env.CHROME_REMOTE_DEBUGGING_URL
            )
            resolve(chromeDebugData?.data?.webSocketDebuggerUrl)
          }
          resolve(code)
        } else {
          reject(new Error(`Processo finalizado com código ${code}`))
        }
      })

      processo.on('error', (err) => {
        reject(err)
      })
    })
  }

  #getChromeCommandStart () {
    const url = new URL(env.CHROME_REMOTE_DEBUGGING_URL)
    const executablePath =
            process.platform === 'win32'
              ? `"${env.EXECUTABLE_PATH}"`
              : `${env.EXECUTABLE_PATH}`

    return `${executablePath} --remote-debugging-port=${url.port} --user-data-dir="${env.USER_DATA_DIR}" --profile-direcotry="${env.CHROME_PROFILE_DIRECTORY}"`
  }
}

module.exports = PuppeteerAdapter

const puppeteer = require('puppeteer-core')

class BrowserAdapter {
  /**
    * @param config {import('puppeteer-core').LaunchOptions & import('puppeteer-core').BrowserConnectOptions & import('puppeteer-core').BrowserLaunchArgumentOptions}
    * @returns {{browser: import('puppeteer-core').Browser, page: import('puppeteer-core').Page}}
    */
  async handle (config) {
    const browser = await puppeteer.launch(config)
    const page = await browser.newPage()

    page.setDefaultTimeout(config.defaultTimeout)
    page.setDefaultNavigationTimeout(config.defaultNavigationTimeout)

    await page.setViewport(config.defaultViewport)

    config.downloadPath ? await this.setDownloadDIrectory(config.downloadPath) : ''

    return { browser, page }
  }

  async setDownloadDirectory (path, page) {
    await page.__client.send('Page.setDownloadBehavior', {
      downloadPath: path,
      behavior: 'allow'
    })
  }
}

module.exports = BrowserAdapter

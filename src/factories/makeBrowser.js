const { Browser } = require('puppeteer-core')
const BrowserAdapter = require('../utils/browser/browserAdapter')
const { getEnvBrowser } = require('../utils/env')

module.exports = async function () {
  const config = getEnvBrowser()
  const browserAdapter = new BrowserAdapter()
  const { browser, page } = await browserAdapter.handle(config)
  return { browser, page, setDownloadDirectory: browserAdapter.setDownloadDirectory }
}

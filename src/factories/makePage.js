const PuppeteerAdapter = require('../adapters/puppeteer/PuppeteerAdapter')
const { env } = require('../env')

module.exports = async function (browser) {
  const puppeteerAdapter = new PuppeteerAdapter()
  const page = await puppeteerAdapter.handlePage(browser, {
    args: env.ARGS,
    executablePath: env.EXECUTABLE_PATH,
    headless: env.HEADLESS,
    userDataDir: env.USER_DATA_DIR,
    slowMo: env.SLOW_MO,
    ignoreHTTPSErrors: env.IGNORE_HTTP_ERRORS,
    defaultViewport: env.DEFAULT_VIEW_PORT,
    defaultTimeout: env.SET_DEFAULT_TIMEOUT,
    defaultNavigationTimeout: env.SET_DEFAULT_NAVIGATION_TIMEOUT,
    ignoreDefaultArgs: env.IGNORE_DEFAULT_ARGS,
    pathDownload: env.PATH_DOWNLOAD
  })
  return {
    page
  }
}

const makeBrowser = require('./factories/makeBrowser')
const { WrongUserKey, ZeroBalance } = require('./errors/captcha')
const makePage = require('./factories/makePage')
const DownloadTimeoutError = require('./errors/browser/DownloadTimeoutError')
/**
 *
 * @param {{values : Array, __root_dir : string}} data
 * @param {import('../selectors.json')} selectors
 * @param {Function(string)} log
 */
module.exports = async (data, selectors, log) => {
  try {
    let browser, page, index
    ({ browser } = await makeBrowser())
    try {
      ({ page } = await makePage(browser))
      await page.goto(selectors.site_url, { waitUntil: 'networkidle0' })
      log('template robots')
      await browser.close()
      return {
        status: true
      }
    } catch (error) {
      log(error.message)
      if (error instanceof WrongUserKey) {
        return {
          status: false,
          continue: false,
          error: error.message
        }
      }
      if (error instanceof ZeroBalance) {
        return {
          status: false,
          continue: false,
          error: error.message
        }
      }

      if (error instanceof DownloadTimeoutError) {
        return {
          status: false,
          continue: true,
          error: error.message,
          repeat: true,
          lastIndex: index
        }
      }

      return {
        status: false,
        continue: true,
        repeat: true,
        lastIndex: index,
        error: error?.message
      }
    }
  } catch (error) {
    log('Erro ao inicializar robo')
    return {
      status: false,
      continue: false,
      error: error?.message
    }
  }
}

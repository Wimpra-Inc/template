const makeBrowser = require('./factories/makeBrowser')
const { WrongUserKey, ZeroBalance } = require('./errors/captcha')
const makePage = require('./factories/makePage')
const {BrowserConnectionError,DownloadTimeoutError, PageError} = require('./errors/browser')
/**
 *
 * @param {{values : Array, __root_dir : string}} data
 * @param {import('../selectors.json')} selectors
 * @param {Function(string)} log
 */
module.exports = async (data, selectors, log) => {
  try {
    let browser, page
    ({ browser } = await makeBrowser())
    try {
      ({ page } = await makePage(browser))
      await page.goto(selectors.site_url, { waitUntil: 'networkidle0' })
      log({ message: 'PROCESSANDO DADOS', progress: 50 })
      await page.waitForTimeout(5000)
      log({message: 'ENVIANDO DADOS', progress: 75})
      await page.waitForTimeout(5000)
      await browser.close()
      log({message: 'Robo finalizado', progress: 100})
      return {
        status: true
      }
    } catch (error) {
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
          lastIndex: data.currentIndex
        }
      }

      if (error instanceof BrowserConnectionError) {
        return {
          status: false,
          continue: false,
          error: error.message
        }
      }

      if (error instanceof PageError) {
        return {
          status: false,
          continue: true,
          repeat: false,
          error: `${currentData?.RAZAO};${currentData?.CNPJ};${error.message}`,
          lastIndex: data.currentIndex
        }
      }

      return {
        status: false,
        continue: true,
        repeat: true,
        lastIndex: data.currentIndex,
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

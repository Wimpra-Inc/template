const makeBrowser = require('./factories/makeBrowser')
const { WrongUserKey, ZeroBalance } = require('./errors/captcha')
const makePage = require('./factories/makePage')
const {
  BrowserConnectionError,
  DownloadTimeoutError,
  PageError
} = require('./errors/browser')
const { getProgress, setProcessedItens } = require('./utils/global/functions')
const connection = require('./database/connection')
const gerarCSV = require('./utils/excel/gerarCSV')
const { setTimeout } = require('timers/promises')
const waitForInterval = require('./utils/date/waitForInterval')
const { env } = require('./env')
/**
 *
 * @param {{values : Array, __root_dir : string, currentIndex: number}} data
 * @param {import('../selectors.json')} selectors
 * @param {Function(string)} log
 */
module.exports = async (data, selectors, log) => {
  try {
    let browser, page, razao, lastIndex
    const conn = await connection();
    ({ browser } = await makeBrowser())
    try {
      ({ page } = await makePage(browser))
      const values = await conn
        .table('processing')
        .select('*')
        .where('processed', false)
        .orderBy('id')

      for (const [, value] of Object.entries(values)) {
        await waitForInterval(env.MUST_START_AT, env.MUST_FINISH_AT)
        console.log(value)
        lastIndex = value.id
        razao = value?.razao
        // await page.goto(selectors.site_url, { waitUntil: 'networkidle0' })
        await setTimeout(1500)

        await setProcessedItens(lastIndex)
        log({
          message: `${razao} PROCESSADO`,
          progress: await getProgress()
        })
      }

      gerarCSV()
      await browser.close()
      return {
        status: true
      }
    } catch (error) {
      console.log(error)
      // await page.clearAllCookies()
      await browser.closeAllPages()

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
          error: `${razao} - ${error.message}`,
          repeat: true,
          lastIndex
        }
      }

      if (error instanceof BrowserConnectionError) {
        return {
          status: false,
          continue: false,
          error: `${razao} - ${error.message}`
        }
      }

      if (error instanceof PageError) {
        return {
          status: false,
          continue: true,
          repeat: false,
          error: `${razao} - ${error.message}`,
          lastIndex
        }
      }

      return {
        status: false,
        continue: true,
        repeat: true,
        lastIndex,
        error: `${razao} - ${error.message}`
      }
    }
  } catch (error) {
    console.log(error)
    log('Erro ao inicializar robo')
    return {
      status: false,
      continue: true,
      error: error?.message
    }
  }
}

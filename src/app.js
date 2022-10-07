const makeBrowser = require('./factories/makeBrowser')
const { WrongUserKey, ZeroBalance } = require('./errors/captcha')
const makePage = require('./factories/makePage')
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
      console.log('template robots')
      await browser.close()
      return {
        status: true
      }
    } catch (error) {
      console.log(error)
      if (error instanceof WrongUserKey) {
        log('Erro ao enviar o usuario para o serviço de captcha')
        return {
          status: true,
          continue: false,
          error: error.message
        }
      }
      if (error instanceof ZeroBalance) {
        log('Erro ao descriptografar captcha: não a saldo disponivel')
        return {
          status: true,
          continue: false,
          error: error.message
        }
      }
      log(error)
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

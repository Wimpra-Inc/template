const makeBrowser = require('./factories/makeBrowser')
const { join } = require('path')
const resolveCaptcha = require('./utils/captcha/resolve')
const { WrongUserKey, ZeroBalance } = require('./errors/captcha')
const { rmSync } = require('fs')

/**
 *
 * @param {{values : Array, __root_dir : string}} data
 * @param {import('../selectors.json')} selectors
 * @param {Function(string)} log
 */
module.exports = async (data, selectors, log) => {
  const { browser, page } = await makeBrowser()
  try {
    await page.goto(selectors.site_url, { waitUntil: 'networkidle0' })
    const imageCaptcha = await page.$('#imgCaptcha')
    await imageCaptcha.screenshot({
      path: join(global.pathTemp, 'captcha.png'),
      type: 'png'
    })
    const captchaResolved = await resolveCaptcha(join(global.pathTemp, 'captcha.png'))
    await browser.close()
  } catch (error) {
    if (error instanceof WrongUserKey) {
      log('Erro ao enviar o usuario para o serviço de captcha')
    }
    if (error instanceof ZeroBalance) {
      log('Erro ao descriptografar captcha: não a saldo disponivel')
    }
    console.log(error)
  } finally {
    rmSync(global.pathTemp, { force: true, recursive: true })
    process.exit()
  }
}

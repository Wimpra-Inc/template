const makeBrowser = require('./factories/makeBrowser')
const { WrongUserKey, ZeroBalance } = require('./errors/captcha')
const makePage = require('./factories/makePage')
const { BrowserConnectionError, DownloadTimeoutError, PageError } = require('./errors/browser')
const { getProgress, setProcessedItens, clearAttemps } = require('./utils/global/functions')
/**
 *
 * @param {{values : Array, __root_dir : string, currentIndex: number}} data
 * @param {import('../selectors.json')} selectors
 * @param {Function(string)} log
 */
module.exports = async (data, selectors, log) => {
    try {
        let browser, page
        ({ browser } = await makeBrowser())
        try {
            ({ page } = await makePage(browser))
            for (const [index, value] of Object.entries(data.values.slice(data.currentIndex))) {
                await page.goto(selectors.site_url, { waitUntil: 'networkidle0' })
                data.currentIndex += 1
                setProcessedItens(data.currentIndex)
                clearAttemps()
                log({ message: 'DADOS PROCESSADOS', progress: getProgress() })
            }
            await browser.close()
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
                    error: error.message,
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

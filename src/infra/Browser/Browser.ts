import { IBrowser } from './protocols'
import puppeteer from 'puppeteer-core'

export class Browser {
  // @ts-ignore
  private config : IBrowser

  async handle (config : IBrowser) {
    this.config = config
    const browser = process.env.TYPE_CONNECTION_BROWSER === 'ws' ? await this.createWsEndpointBrowser() : await this.createDefaultBrowser()
    const page = await browser.newPage()

    page.setDefaultTimeout(this.config.defaultTimeout)
    page.setDefaultNavigationTimeout(this.config.defaultNavigationTimeout)

    return { browser, page }
  }

  async createDefaultBrowser () : Promise<puppeteer.Browser> {
    return await puppeteer.launch(this.config)
  }

  async createWsEndpointBrowser (): Promise<puppeteer.Browser> {
    return await puppeteer.connect({})
  }

  static async pathDownload (page: puppeteer.Page, path: string) {
    // @ts-ignore
    await page._client.send('Page.setDownloadBehavior', {
      downloadPath: path,
      behavior: 'allow'
    })
  }

  static async closeBrowser (browser: puppeteer.Browser) : Promise<void> {
    async function closeAllPages (pages : Array<puppeteer.Page>) : Promise<any> {
      if (pages.length === 0) {
        return true
      }
      await pages.pop()?.close()
      return await closeAllPages(pages)
    }

    const pages = await browser.pages()
    await closeAllPages(pages)
    await browser.close().catch(e => 'browser closed')
  }
}

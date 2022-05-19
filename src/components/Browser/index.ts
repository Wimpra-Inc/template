import puppeteer from 'puppeteer-core'

export default class HandleBrowser {
  // @ts-ignore
  public browser : puppeteer.Browser
  // @ts-ignore
  public page : puppeteer.Page

  public async create () {
    if (process.env.TYPE_CONNECTION_BROWSER === 'ws') {
      this.browser = await this.createBrowserWSEndpont()
    } else {
      this.browser = await this.createDefaultBrowser()
    }
    this.page = await this.browser.newPage()
    return { browser: this.browser, page: this.page }
  }

  private createBrowserWSEndpont () : Promise<puppeteer.Browser> {
    return puppeteer.connect({})
  }

  private async createDefaultBrowser () : Promise<puppeteer.Browser> {
    return puppeteer.launch({
      executablePath: process.env.EXECUTABLE_PATH,
      args: process.env.ARGS?.split(','),
      headless: process.env.HEADLESS !== 'false',
      slowMo: Number(process.env.SLOW_MO),
      ignoreHTTPSErrors: process.env.IGNORE_HTTP_ERRORS !== 'false',
      userDataDir: process.env.USER_DATA_DIR,
      defaultViewport: JSON.parse(process.env.DEFAULT_VIEW_PORT || ''),
      ignoreDefaultArgs: process.env.IGNORE_DEFAULT_ARGS?.split(',')
    })
  }
}

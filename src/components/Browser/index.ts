import { launch, Browser, connect, Page } from 'puppeteer-core'

export default class HandleBrowser {
  // @ts-ignore
  public browser : Browser
  // @ts-ignore
  public page : Page

  public async create () {
    if (process.env.TYPE_CONNECTION_BROWSER === 'ws') {
      this.browser = await this.createBrowserWSEndpont()
    } else {
      this.browser = await this.createDefaultBrowser()
    }
    this.page = await this.browser.newPage()
    return { browser: this.browser, page: this.page }
  }

  private createBrowserWSEndpont () : Promise<Browser> {
    return connect({})
  }

  private async createDefaultBrowser () : Promise<Browser> {
    return launch({
      executablePath: process.env.EXECUTABLE_PATH,
      args: process.env.ARGS?.split(','),
      headless: process.env.HEADLESS !== 'false',
      slowMo: Number(process.env.SLOW_MO),
      ignoreHTTPSErrors: process.env.IGNORE_HTTTP_ERRORS !== 'false',
      userDataDir: process.env.USER_DATA_DIR,
      defaultViewport: JSON.parse(process.env.DEFAULT_VIEW_PORT || '')
    })
  }
}

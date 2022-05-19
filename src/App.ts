import HandleBrowser from './components/Browser/index'

export default class App {
  public async main () {
    const handleBrowser = new HandleBrowser()
    const { browser, page } = await handleBrowser.create()
    await page.goto('http://google.com.br', { waitUntil: 'networkidle0' })
    await page.waitForTimeout(5000)
    await browser.close()
  }
}

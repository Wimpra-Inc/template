import 'dotenv/config'
import { Browser } from './infra/Browser'
import { App } from './main/app'

(async () => {
  const { page, browser } = await App()
  await page.goto('https://www.google.com.br')
  await page.waitForTimeout(4000)
  await Browser.closeBrowser(browser)
})()

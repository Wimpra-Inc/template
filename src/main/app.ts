import { IBrowser } from '../infra/Browser/protocols'
import { Browser } from '../infra/Browser/Browser'

export async function App () {
  const config = {
    pathDownload: process.env.pathDownload || '',
    executablePath: process.env.executablePath || '',
    userDataDir: process.env.userDataDir || '',
    slowMo: parseInt(process.env.slowMo || '10', 10),
    args: process.env.args?.split(',') || [],
    defaultViewport: JSON.parse(process.env.defaultViewport || '{}'),
    ignoreDefaultArgs: process.env.ignoreDefaultArgs?.split(',') || [],
    ignoreHTTPSErrors: process.env.ignoreHTTPSErrors !== 'false',
    headless: process.env.headless !== 'false',
    defaultNavigationTimeout: Number(process.env.defaultNavigationTimeout) || 60000,
    defaultTimeout: Number(process.env.defaultTimeout) || 60000
  } as IBrowser
  const { browser, page } = await (new Browser().handle(config))
  return { browser, page }
}

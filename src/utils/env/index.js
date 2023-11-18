const { stringToBoolean } = require('../string')

module.exports = {
  getEnv: function (variable) {
    if (!variable) {
      return process.env
    }
    return process.env[variable]
  },

  setEnv: function (variable, value) {
    process.env[variable] = value
  },

  getEnvBrowser: function () {
    return {
      pathDownload: process.env.PATH_DOWNLOAD,
      executablePath: process.env.EXECUTABLE_PATH,
      userDataDir: process.env.USER_DATA_DIR,
      slowMo: parseInt(process.env.SLOW_MO, 10),
      args: process.env.ARGS.split(','),
      defaultViewport: JSON.parse(process.env.DEFAULT_VIEW_PORT),
      ignoreDefaultArgs: process.env.IGNORE_DEFAULT_ARGS.split(','),
      ignoreHTTPSErrors: stringToBoolean(process.env.IGNORE_HTTP_ERRORS),
      headless: stringToBoolean(process.env.HEADLESS),
      defaultTimeout: +process.env.SET_DEFAULT_TIMEOUT,
      defaultNavigationTimeout: +process.env.SET_DEFAULT_NAVIGATION_TIMEOUT,
      chromeRemoteDebuggingPort: +process.env.CHROME_REMOTE_DEBUGGING_PORT,
      CREATE_BROWSER_BY_WS_ENDPOINT: stringToBoolean(process.env.CREATE_BROWSER_BY_WS_ENDPOINT),
      CHROME_REMOTE_DEBUGGING_URL: process.env.CHROME_REMOTE_DEBUGGING_URL.replace('PORT', process.env.CHROME_REMOTE_DEBUGGING_PORT)
    }
  }
}

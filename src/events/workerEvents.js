const { parentPort } = require('worker_threads')
const { pathToZip } = require('../utils/files/zip');
const { parse } = require('path');
/**
 *
 * @param events {string[]}
 * @param callback {Function}
 */
module.exports = function (rootDir) {
  parentPort.on('message', async (message) => {
    if (message === 'close') {
      await pathToZip(parse(global.ROOT_DIR).name + '.zip', global.PATH_SAIDA)
      process.exit()
    }
  })
}

const { join } = require('path')
const { createDirectory } = require('./utils/path')

module.exports = (rootDir) => {
  const pathEntrada = join(rootDir, 'entrada')
  const pathTemp = join(rootDir, 'temp')
  const pathSaida = join(rootDir, 'saida')

  createDirectory(pathEntrada, pathSaida, pathTemp)

  global.PATH_ENTRADA = pathEntrada
  global.PATH_TEMP = pathTemp
  global.PATH_SAIDA = pathSaida
  global.ROOT_DIR = rootDir
}

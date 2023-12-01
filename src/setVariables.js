const { join } = require('path')
const { createDirectory } = require('./utils/path')

module.exports = (rootDir) => {
  const pathEntrada = join(rootDir, 'entrada')
  const pathTemp = join(rootDir, 'temp')
  const pathSaida = join(rootDir, 'saida')

  createDirectory(pathEntrada, false)
  createDirectory(pathSaida, true)
  createDirectory(pathTemp, true)

  global.PATH_ENTRADA = pathEntrada
  global.PATH_TEMP = pathTemp
  global.PATH_SAIDA = pathSaida
  global.ROOT_DIR = rootDir
  global.PROGRESS = 0
  global.TOTAL_ITENS = 1
  global.PROCESSED_ITENS = 0
  global.ATTEMPTS = 0
}

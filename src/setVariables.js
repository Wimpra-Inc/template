const { existsSync, rmSync, mkdirSync } = require('fs')
const { join } = require('path')

module.exports = (rootDir) => {
  const pathEntrada = join(rootDir, 'entrada')
  const pathTemp = join(rootDir, 'temp')
  if (existsSync(pathEntrada)) {
    rmSync(pathEntrada, { recursive: true, force: true })
    mkdirSync(pathEntrada)
  } else {
    mkdirSync(pathEntrada)
  }

  if (existsSync(pathTemp)) {
    rmSync(pathTemp, { recursive: true, force: true })
    mkdirSync(pathTemp)
  } else {
    mkdirSync(pathTemp)
  }

  global.pathEntrada = pathEntrada
  global.pathTemp = pathTemp
}

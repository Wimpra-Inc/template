const { join } = require('path')
const { createDirectory } = require('./utils/path')
const { rmSync } = require('fs')

// Adiciona variáveis globais e cria as pastas padrão
module.exports = {
  setVariables: (rootDir) => {
    const pathEntrada = join(rootDir, 'entrada')
    const pathTemp = join(rootDir, 'temp')
    const pathSaida = join(rootDir, 'saida')
    const pathProcessando = join(rootDir, 'processando')

    /** @type {import('./@types/global.d.js').AppContext} */
    globalThis.app = {
      PATH_ENTRADA: pathEntrada,
      PATH_TEMP: pathTemp,
      PATH_PROCESSANDO: pathProcessando,
      PATH_SAIDA: pathSaida,
      ROOT_DIR: rootDir,
      PROGRESS: 0,
      TOTAL_ITENS: 1,
      PROCESSED_ITENS: 0,
      ATTEMPTS: 0
    }
  },

  createDefaultDirectories: (removeIfExist = true) => {
    createDirectory(global.app.PATH_TEMP, true)
    createDirectory(global.app.PATH_ENTRADA, false)
    createDirectory(global.app.PATH_SAIDA, removeIfExist)
    createDirectory(global.app.PATH_PROCESSANDO, removeIfExist)
  },

  removeDefaultDirectories: (removeIfExist) => {
    rmSync(global.app.PATH_TEMP, { force: true, recursive: true })
    if (removeIfExist) {
      rmSync(global.app.PATH_ENTRADA, { force: true, recursive: true })
      rmSync(global.app.PATH_SAIDA, { force: true, recursive: true })
      rmSync(global.app.PATH_PROCESSANDO, { force: true, recursive: true })
    }
  }
}

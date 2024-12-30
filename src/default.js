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

        global.PATH_ENTRADA = pathEntrada
        global.PATH_TEMP = pathTemp
        global.PATH_PROCESSANDO = pathProcessando
        global.PATH_SAIDA = pathSaida
        global.ROOT_DIR = rootDir
        global.PROGRESS = 0
        global.TOTAL_ITENS = 1
        global.PROCESSED_ITENS = 0
        global.ATTEMPTS = 0
    },

    createDefaultDirectories: (removeIfExist = true) => {
        createDirectory(global.PATH_TEMP, true)
        createDirectory(global.PATH_ENTRADA, false)
        createDirectory(global.PATH_SAIDA, removeIfExist)
        createDirectory(global.PATH_PROCESSANDO, removeIfExist)
    },

    removeDefaultDirectories: (removeIfExist) => {
        rmSync(global.PATH_TEMP, { force: true, recursive: true })
        if (removeIfExist) {
            rmSync(global.PATH_ENTRADA, { force: true, recursive: true })
            rmSync(global.PATH_SAIDA, { force: true, recursive: true })
            rmSync(global.PATH_PROCESSANDO, { force: true, recursive: true })
        }
    }
}

const {
  workerData,
  Worker,
  isMainThread,
  parentPort
} = require('worker_threads')
const { join, parse } = require('path')
require('dotenv').config({
  path: isMainThread
    ? join(parse(__dirname).dir, '.env')
    : join(workerData.__root_dir, '.env')
})
const app = require('./app')
const SELECTORS = require('../selectors.json')
const workerEvents = require('./events/workerEvents')
const { appendFileSync } = require('fs')
const { pathToZip } = require('./utils/files/zip')
const {
  incrementsAttemps,
  setTotalItens,
  setProcessedItens,
  getProgress,
  getAttemps
} = require('./utils/global/functions')
const reset = require('./database/reset')
const parseXLSToDatabase = require('./utils/excel/parseXLSToDatabase')
const {
  setVariables,
  createDefaultDirectories
} = require('./default');

(async () => {
  if (isMainThread) {
    const worker = new Worker(__filename, {
      workerData: {
        __root_dir: process.cwd(),
        restart: true,
        sheetName: 'Planilha1'
      }
    })
    worker.on('message', (message) => {
      message =
                typeof message === 'object' ? JSON.stringify(message) : message
      process.stdout.write(message + '\n')
      if (process.env.CREATE_CONSOLE_FILE === 'false') return true
      appendFileSync(
        join(process.cwd(), 'saida', 'console.txt'),
                `${message}\n`
      )
    })
    worker.on('exit', () => console.log('FIM'))
    worker.on('online', () =>
      console.log({ message: 'Robo Iniciado', progress: 0 })
    )
    worker.on('error', (error) => console.log(error))
    // worker.postMessage('close')
  } else {
    setVariables(workerData.__root_dir)
    createDefaultDirectories(workerData.restart)
    workerEvents()

    if (workerData.restart) {
      await reset()
      await parseXLSToDatabase(
        global.app.PATH_ENTRADA,
        workerData?.sheetName
      )
    }

    const data = {
      ...workerData
    } // ARRAY COM OS DADOS A PROCESSAR
    await setTotalItens()

    while (true) {
      const execution = await app(
        data,
        SELECTORS,
        parentPort.postMessage.bind(parentPort)
      )

      if (!execution.status) {
        const messageError = `${execution?.error}\n`
        const fileError = join(global.app.PATH_SAIDA, 'erros.csv')

        if (!execution.continue) {
          appendFileSync(fileError, messageError)
          break
        }

        if (execution.repeat) {
          if (getAttemps() > 3) {
            appendFileSync(fileError, messageError)
            await setProcessedItens(execution.lastIndex)
            parentPort.postMessage({
              message: messageError,
              progress: await getProgress()
            })
            continue
          }
          incrementsAttemps()
          continue
        }
        appendFileSync(fileError, messageError)
        await setProcessedItens(execution.lastIndex)
        parentPort.postMessage({
          message: messageError,
          progress: await getProgress()
        })
        continue
      }
      break
    }

    pathToZip(
      join(global.app.ROOT_DIR, parse(global.app.ROOT_DIR).name + '.zip'),
      global.app.PATH_SAIDA
    )
    process.exit()
  }
})()

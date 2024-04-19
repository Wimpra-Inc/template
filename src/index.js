require('dotenv').config()
const { workerData, Worker, isMainThread, parentPort } = require('worker_threads')
const app = require('./app')
const SELECTORS = require('../selectors.json')
const workerEvents = require('./events/workerEvents')
const setVariables = require('./setVariables')
const { join, parse } = require('path')
const { rmSync, appendFileSync } = require('fs');
const { pathToZip } = require('./utils/files/zip');
const { incrementsAttemps, setTotalItens, setProcessedItens, getProgress, clearAttemps } = require('./utils/global/functions');

(async () => {
  if (isMainThread) {
    const worker = new Worker(__filename, {
      workerData: {
        __root_dir: process.cwd()
      }
    })
    require('dotenv').config({
      path: join(parse(__dirname).dir, '.env')
    })
    worker.on('message', (message) => {
      message = typeof message === 'object' ? JSON.stringify(message) : message
      process.stdout.write(message + '\n')
      if (process.env.CREATE_CONSOLE_FILE === 'false') return true
      appendFileSync(join(process.cwd(), 'saida', 'console.txt'), `${message}\n`)
    })
    worker.on('exit', () => console.log('FIM'))
    worker.on('online', () => console.log({message: 'Robo Iniciado', progress: 0}))
    worker.on('error', (error) => console.log(error))
    // worker.postMessage('close')
  } else {
    require('dotenv').config({
      path: join(workerData.__root_dir, '.env')
    })
    setVariables(workerData.__root_dir)
    workerEvents()
    const data = {
        currentIndex: 0,
        values: Array.from({ length: 10 }, (_, i) => i),
        ...workerData,
    } // ARRAY COM OS DADOS A PROCESSAR
    setTotalItens(data.values.length)
    while (true) {
      const execution = await app(data, SELECTORS, parentPort.postMessage.bind(parentPort))

      if (!execution.status) {
        const messageError = `${execution?.error}\n`
        const fileError = join(global.PATH_SAIDA, 'erros.csv')

        if (!execution.continue) {
          appendFileSync(fileError, messageError)
          break
        }
        if (execution.repeat) {
          if (global.attempts > 3) {
            appendFileSync(fileError, messageError)
            clearAttemps(0)
            setProcessedItens(execution.lastIndex)
            data.currentIndex = execution.lastIndex + 1
            parentPort.postMessage({ message: messageError, progress: getProgress() })
            continue
          }
          incrementsAttemps(1)
          continue
        }
        appendFileSync(fileError, messageError)
        clearAttemps(0)
        setProcessedItens(execution.lastIndex)
        data.currentIndex = execution.lastIndex + 1
        parentPort.postMessage({ message: messageError, progress: getProgress() })
        continue
      }
      break
    }

    rmSync(global.PATH_TEMP, { force: true, recursive: true })
    rmSync(global.PATH_ENTRADA, { force: true, recursive: true })
    pathToZip(join(global.ROOT_DIR, (parse(global.ROOT_DIR).name + '.zip')), global.PATH_SAIDA)
    rmSync(global.PATH_SAIDA, { force: true, recursive: true })
    process.exit()
  }
})()

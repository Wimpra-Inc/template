require('dotenv').config()
const { workerData, Worker, isMainThread, parentPort } = require('worker_threads')
const app = require('./app')
const SELECTORS = require('../selectors.json')
const workerEvents = require('./events/workerEvents')
const setVariables = require('./setVariables')
const { join, parse } = require('path')
const { rmSync, appendFileSync } = require('fs');
const { pathToZip } = require('./utils/files/zip');

(async () => {
  if (isMainThread) {
    const worker = new Worker(__filename, {
      workerData: {
        values: [],
        __root_dir: process.cwd()
      }
    })
    require('dotenv').config({
      path: join(parse(__dirname).dir, '.env')
    })
    worker.on('message', (message) => {
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
    const data = workerData
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
            data.values = data.values.filter((_, index) => index > execution.lastIndex)
            global.attempts = 0
            continue
          }
          data.values = data.values.filter((_, index) => index >= execution.lastIndex)
          global.attempts++
          continue
        }
        appendFileSync(fileError, messageError)
        data.values = data.values.filter((_, index) => index > execution.lastIndex)
        global.attempts = 0
        continue
      }
      break
    }

    rmSync(global.PATH_TEMP, { force: true, recursive: true })
    await pathToZip(parse(global.ROOT_DIR).name + '.zip', global.PATH_SAIDA)
    process.exit()
  }
})()

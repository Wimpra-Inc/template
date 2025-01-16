require('dotenv').config()
const { workerData, Worker, isMainThread, parentPort } = require('worker_threads')
const app = require('./app')
const SELECTORS = require('../selectors.json')
const workerEvents = require('./events/workerEvents')
const { join, parse } = require('path')
const { appendFileSync } = require('fs');
const { pathToZip } = require('./utils/files/zip');
const { incrementsAttemps, setTotalItens, setProcessedItens, getProgress, clearAttemps, getAttemps } = require('./utils/global/functions');
const reset = require('./database/reset');
const parseXLSToDatabase = require('./utils/excel/parseXLSToDatabase');
const { setVariables, createDefaultDirectories, removeDefaultDirectories } = require('./default');

(async () => {
    if (isMainThread) {
        const worker = new Worker(__filename, {
            workerData: {
                __root_dir: process.cwd(),
                restart: true,
                sheetName: 'Planilha1'
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
        worker.on('online', () => console.log({ message: 'Robo Iniciado', progress: 0 }))
        worker.on('error', (error) => console.log(error))
        // worker.postMessage('close')
    } else {
        require('dotenv').config({
            path: join(workerData.__root_dir, '.env')
        })
        setVariables(workerData.__root_dir)
        createDefaultDirectories(workerData.restart)
        workerEvents()

        if (workerData.restart) {
            await reset()
            await parseXLSToDatabase(global.PATH_ENTRADA, workerData?.sheetName)
        }

        const data = {
            ...workerData,
        } // ARRAY COM OS DADOS A PROCESSAR
        await setTotalItens()

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
                    if (getAttemps() > 3) {
                        appendFileSync(fileError, messageError)
                        clearAttemps(0)
                        await setProcessedItens(execution.lastIndex)
                        parentPort.postMessage({ message: messageError, progress: await getProgress() })
                        continue
                    }
                    incrementsAttemps(1)
                    continue
                }
                appendFileSync(fileError, messageError)
                clearAttemps(0)
                await setProcessedItens(execution.lastIndex)
                parentPort.postMessage({ message: messageError, progress: await getProgress() })
                continue
            }
            break
        }

        pathToZip(join(global.ROOT_DIR, (parse(global.ROOT_DIR).name + '.zip')), global.PATH_SAIDA)
        removeDefaultDirectories(workerData.restart)
        process.exit()
    }
})()

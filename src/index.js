require('dotenv').config()
const { workerData, Worker, isMainThread, parentPort } = require('worker_threads')
const app = require('./app')
const SELECTORS = require('../selectors.json')
const workerEvents = require('./events/workerEvents')
const setVariables = require('./setVariables');

(async () => {
  if (isMainThread) {
    const worker = new Worker(__filename, {
      workerData: {
        values: [],
        __root_dir: process.cwd()
      }
    })
    worker.on('message', (message) => console.log(message))
    worker.on('exit', () => console.log('FIM'))
    worker.on('online', () => console.log('running'))
    worker.on('error', (error) => console.log(error))
    // worker.postMessage('close')
  } else {
    workerEvents()
    setVariables(workerData.__root_dir)
    app(workerData, SELECTORS, parentPort.postMessage.bind(parentPort))
  }
})()

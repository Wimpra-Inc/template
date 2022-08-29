const { workerData, parentPort } = require('worker_threads');
const { setTimeout } = require('timers/promises');


(async () => {

    parentPort.on('message', (message) => {
        if (message === 'close') return process.exit()
    });

    console.log(workerData)
    await setTimeout(30000)
    parentPort.postMessage('MENSAGEM 1')
    await setTimeout(20000)
    parentPort.postMessage('MENSAGEM 2')
    await setTimeout(20000)
    parentPort.postMessage('MENSAGEM 3')
    throw new Error('teste')
    process.exit()
})()

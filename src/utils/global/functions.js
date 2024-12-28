const connection = require("../../database/connection")

function incrementsAttemps(attempts) {
    global.ATTEMPTS += attempts
}

function clearAttemps() {
    global.ATTEMPTS = 0
}

function getAttemps() {
    return global.ATTEMPTS
}
async function setTotalItens() {
    const conn = await connection()
    const [{ total }] = await conn.table('processing').count('* as total')
    global.TOTAL_ITENS = total
}
async function setProcessedItens(id) {
    const conn = await connection()
    await conn.table('processing').update('processed', true).where('id', id)
    global.PROCESSED_ITENS += 1
}

async function getProgress() {
    const conn = await connection()
    const [{ progress }] = await conn.table('processing').where('processed', true).count('* as progress')

    return (progress / global.TOTAL_ITENS * 100) || 0
}

module.exports = {
    incrementsAttemps,
    setTotalItens,
    setProcessedItens,
    getProgress,
    clearAttemps,
    getAttemps,
}

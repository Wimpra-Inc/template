const connection = require('../../database/connection')

function incrementsAttemps () {
  global.app.ATTEMPTS += 1
}

function clearAttemps () {
  global.app.ATTEMPTS = 0
}

function getAttemps () {
  return global.app.ATTEMPTS
}

async function setTotalItens () {
  const conn = await connection()
  const [{ total }] = await conn.table('processing').count('* as total')
  global.app.TOTAL_ITENS = total
}

async function setProcessedItens (id) {
  const conn = await connection()
  await conn.table('processing').update('processed', true).where('id', id)
  global.app.PROCESSED_ITENS += 1
  clearAttemps()
}

async function getProgress () {
  const conn = await connection()
  const [{ progress }] = await conn
    .table('processing')
    .where('processed', true)
    .count('* as progress')

  return (progress / global.app.TOTAL_ITENS) * 100 || 0
}

module.exports = {
  incrementsAttemps,
  setTotalItens,
  setProcessedItens,
  getProgress,
  clearAttemps,
  getAttemps
}

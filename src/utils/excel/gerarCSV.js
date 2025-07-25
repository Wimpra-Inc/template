const { join } = require('path')
const connection = require('../../database/connection')
const { appendFileSync } = require('fs')
const { isJson } = require('../validators')

module.exports = async () => {
  const conn = await connection()

  let dados = await conn.table('processing').where({ processed: true }).select('dados').distinct()

  dados = dados.flatMap(dado => dado.dados && isJson(dado.dados) ? JSON.parse(dado.dados) : dados.dados ? [dado.dados] : []).map(dado => Object.values(dado).join(';')).join('\n')

  appendFileSync(join(global.app.PATH_SAIDA, 'dados.csv'), dados)
}

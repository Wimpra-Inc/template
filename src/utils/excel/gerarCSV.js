const { join } = require("path")
const connection = require("../../database/connection")
const { appendFileSync } = require('fs')

module.exports = async () => {
    const conn = await connection()

    let dados = await conn.table('processing').where({ processed: true }).select('dados').distinct()

    dados = dados.flatMap(dado => JSON.parse(dado.dados)).map(dado => Object.values(dado).join(';')).join('\n')

    appendFileSync(join(global.PATH_SAIDA, 'dados.csv'), dados)

}

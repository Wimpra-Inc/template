const connection = require("../../database/connection");
const parseXLSToJson = require("./parseXLSToJson");

module.exports = async (path, sheetName) => {
    const data = parseXLSToJson(path, sheetName).map(item => ({
        razao: item.RAZAO,
        cnpj: item.CNPJ,
        processed: false,
    }))
    const conn = await connection()
    await conn.batchInsert('processing', data, 1000)
}

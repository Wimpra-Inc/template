const connection = require('./connection')

module.exports = async () => {
  const conn = await connection()

  await conn.schema.dropTableIfExists('processing')
  await conn.schema.createTable('processing', table => {
    table.increments('id').primary()
    table.string('razao').notNullable()
    table.string('cnpj').notNullable()
    table.text('dados').nullable()
    table.text('cookies').nullable()
    table.boolean('processed').defaultTo(false)
  })
}

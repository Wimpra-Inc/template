const { join } = require('path')
const knex = require('knex')

async function isConnected () {
  try {
    await global.app.CONNECTION.raw('select 1')
    return true
  } catch (error) {
    return false
  }
}

/**
 * @returns {Promise<import('knex').Knex>}
 */
module.exports = async () => {
  if (await isConnected()) {
    return global.app.CONNECTION
  }
  global.app.CONNECTION = knex({
    client: 'sqlite3',
    connection: {
      filename: join(global.app.PATH_PROCESSANDO, 'database.sqlite')
    },
    useNullAsDefault: true
  })

  return global.app.CONNECTION
}

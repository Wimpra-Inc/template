const { join } = require('path')
const knex = require('knex')

global.connection = null;


async function isConnected() {
    try {
        await global.connection.raw('select 1')
        return true
    } catch (error) {
        return false
    }

}

/**
 * @returns {import('knex').Knex}
 */
module.exports = async () => {
    if (await isConnected()) {
        return global.connection
    }
    global.connection = knex({
        client: 'sqlite3',
        connection: {
            filename: join(global.PATH_PROCESSANDO, 'database.sqlite')
        },
        useNullAsDefault: true
    })


    return global.connection
}

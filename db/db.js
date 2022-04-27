import Knex from 'knex'
import knexfile from './knexfile.js'


const db = Knex(knexfile.development)

/*export default function db(){
    const config = Knex(knexfile.development)

    return config
}
*/

export default db

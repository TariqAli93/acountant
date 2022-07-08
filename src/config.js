import path from 'path'
import chmodr from 'chmodr';

const isBuild = process.env.NODE_ENV === 'production'
const pathToDbFile = path.join(isBuild ? __dirname : __static, '../src/accountant.db');

chmodr(pathToDbFile, 0o777, (err) => {
    if (err) {
        console.log('Failed to execute chmod', err);
    } else {
        console.log('Success');
    }
});

const knex = require('knex')({
    client: 'better-sqlite3',
    connection: {
        filename: pathToDbFile,
        flags: ['OPEN_URI', 'OPEN_SHAREDCACHE', 'READ_WRITE', 'CREATE_IF_NECESSARY'],
    },
});

export default knex
import db from '../config'

const format = () => {
    db('activities').del().where('activitieId', '!=', 'null')
    db('customers').del().where('customersId', '!=', 'null')
    db('account').del().where('accountId', '!=', 'null')
    db('sqlite_sequence').truncate().where('name', '!=', 'null')
}

export default format
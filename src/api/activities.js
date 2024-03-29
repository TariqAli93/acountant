import db from '../config'

export const GetActivities = () => {
  return new Promise((resolve, reject) => {
    db('activities')
      .join('customers', 'customers.customerId', 'activities.customerId')
      .join('account', 'account.accountId', 'activities.accountId')
      .select(
        'activities.activitieId',
        'activities.activitieType',
        'activities.activitieBy',
        'activities.amount',
        'activities.note',
        'activities.createdAt',
        'activities.customerId',
        'customers.customerName',
        'customers.customerId',
        'customers.customerType',
        'account.accountId',
        'account.accountName',
        'account.isDeleted',
      )
      .where('activities.isDeleted', '=', 0)
      .where('activities.activitieStatus', '=', 1)
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        console.log(sortedData)
        resolve(sortedData)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const GetActivitiesByQuery = (query) => {
  return new Promise((resolve, reject) => {
    let Query = db('activities')
      .join('customers', 'customers.customerId', 'activities.customerId')
      .join('account', 'account.accountId', 'activities.accountId')
      .select(
        'activities.activitieId',
        'activities.activitieType',
        'activities.activitieBy',
        'activities.amount',
        'activities.note',
        'activities.createdAt',
        'activities.customerId',
        'customers.customerName',
        'customers.customerId',
        'customers.customerType',
        'account.accountId',
        'account.accountName',
        'account.isDeleted',
      )

    Query.where('activities.isDeleted', '=', 0)

    if (query.activitieType) {
      Query.where('activities.activitieType', query.activitieType)
    }

    if (query.customerId) {
      Query.where('activities.customerId', query.customerId)
    }

    if (query.accountId) {
      Query.where('account.accountId', query.accountId)
    }

    if (query.startDate && query.endDate) {
      Query.whereBetween('activities.createdAt', [query.startDate, query.endDate])
    }

    if (query.startDate && !query.endDate) {
      Query.where('activities.createdAt', '>=', query.startDate)
      Query.where('activities.createdAt', '<=', new Date().toISOString().split('T')[0])
    }

    if (!query.startDate && query.endDate) {
      Query.where('activities.createdAt', '>=', '1970-01-01')
      Query.where('activities.createdAt', '<=', query.endDate)
    }

    Query.then((data) => {
      const sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      console.log(sortedData)
      resolve(sortedData)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const GetActivitiesByCustomer = (id) => {
  return new Promise((resolve, reject) => {
    let Query = db('activities')
      .join('customers', 'customers.customerId', 'activities.customerId')
      .join('account', 'account.accountId', 'activities.accountId')
      .select(
        'activities.activitieId',
        'activities.activitieType',
        'activities.activitieBy',
        'activities.amount',
        'activities.activitieStatus',
        'activities.note',
        'activities.createdAt',
        'activities.customerId',
        'account.accountId',
        'account.accountName',
        'account.isDeleted',
        'customers.customerName',
        'customers.customerId',
        'customers.customerType',
        'customers.customerAmount',
      )
      
      Query.where('activities.isDeleted', '=', 0)
      Query.where('activities.customerId', id)
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        console.log(sortedData)
        resolve(sortedData)
      }).catch((err) => {
        reject(err)
      })
  })
}

export const DeleteActivity = (id) => {
  return new Promise((resolve, reject) => {
    db('activities').where('activities.activitieId', '=', id)
      .update({ isDeleted: 1 })
      .then((data) => {
        resolve(data)
      }).catch((err) => {
        reject(err)
      })
  })
}
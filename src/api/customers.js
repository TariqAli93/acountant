import db from '../config'

export const GetCustomers = () => {
    return new Promise((resolve, reject) => {
        db.select().table('customers').then(customers => {
            resolve(customers)
        }).catch(err => {
            reject(err)
        })
    })
}


export const CreateCustomer = (customer) => {
    return new Promise((resolve, reject) => {
        db.insert({ customerName: customer.customerName, customerType: customer.customerType }).into('customers').then(cust => {
            resolve(cust)
        }).catch(err => {
            reject(err)
        })
    })
}

export const DecrementCustomerBalance = (customer) => {
    return new Promise((resolve, reject) => {
        db('customers')
            .decrement({ customerAmount: customer.customerAmount * 1 })
            .where('customerId', customer.customerId)
            .then(cust => {
                resolve(cust)
            }).catch(err => {
                reject(err)
            })
    })
}


export const IncrementCustomerBalance = (customer) => {
    return new Promise((resolve, reject) => {
        db('customers')
            .increment({ customerAmount: customer.customerAmount * 1 })
            .where('customerId', customer.customerId)
            .then(cust => {
                resolve(cust)
            }).catch(err => {
                reject(err)
            })
    })
}


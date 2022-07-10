import db from '../config'

export const GetAccount = () => {
    return new Promise((resolve, reject) => {
        db.select().table('account').where('isDeleted', 0).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

export const CreateAccount = (account) => {
    return new Promise((resolve, reject) => {
        db.select().table('account').where('isDefault', 1).where('isDeleted', 0).then(data => {
            if (data.length > 0 && account.isDefault === 1) {
                reject('الحساب الاساسي موجود بالفعل')
            } else {
                db.insert({ accountName: account.accountName, amount: account.amount, userId: account.userId, isDefault: account.isDefault })
                    .into('account')
                    .then(data => {
                        resolve(data)
                    }).catch(err => {
                        reject(err)
                    })
            }
        })

    })
}

export const UpdateAccount = (account) => {
    return new Promise((resolve, reject) => {
        db('account').update({
            accountName: account.accountName,
            amount: account.amount,
            userId: account.userId,
            isDefault: account.isDefault
        }).where('accountId', account.accountId).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

export const DeleteAccount = (account) => {
    console.log(account)
    return new Promise((resolve, reject) => {
        db('account').update('isDeleted', 1)
            .where('accountId', account)
            .then(data => {
                resolve(data)
            }).catch(err => {
                reject(err)
            })
    })
}

export const withdrawAccount = (account) => {
    return new Promise((resolve, reject) => {
        db('account').decrement({ amount: account.amount }).where('accountId', account.accountId).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}


export const createActivities = (activitie) => {
    return new Promise((resolve, reject) => {
        db.insert(
            {
                activitieType: activitie.activitieType,
                activitieBy: activitie.activitieBy,
                amount: activitie.amount,
                note: activitie.note,
                createdAt: activitie.createdAt,
                customerId: activitie.customerId,
                accountId: activitie.accountId
            })
            .into('activities')
            .then(data => resolve(data))
            .catch(err => reject(JSON.stringify(err)))
    })
}

export const depositAccount = (account) => {
    return new Promise((resolve, reject) => {
        db('account').increment({ amount: account.amount }).where('accountId', account.accountId).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}
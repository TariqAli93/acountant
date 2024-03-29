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

                        if (account.amount > 0) {
                            const logData = {
                                idAccount: account.accountId,
                                amount: account.amount,
                                isEmpty: account.amount < 1 ? 1 : 0,
                                date: new Date().toISOString().split("T")[0]
                            }

                            db.insert(logData)
                                .into('log')
                                .then((log) => {
                                    console.log('%caccounts.js line:48 log', 'color: #007acc;', log);
                                }).catch(lerr => console.log(lerr))
                        }
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
            if (account.amount * 1 < 1) {
                const logData = {
                    idAccount: account.accountId,
                    amount: account.amount,
                    isEmpty: 1,
                    date: new Date().toISOString().split("T")[0]
                }

                db.insert(logData)
                    .into('log')
                    .then((log) => {
                        console.log('%caccounts.js line:48 log', 'color: #007acc;', log);
                    }).catch(lerr => console.log(lerr))
            } else {
                console.log(account.oldAmount)
                if (account.oldAmount * 1 < 1) {

                    const logData = {
                        idAccount: account.accountId,
                        amount: account.amount,
                        isEmpty: 0,
                        date: new Date().toISOString().split("T")[0]
                    }

                    db.insert(logData)
                        .into('log')
                        .then((log) => {
                            console.log('%caccounts.js line:48 log', 'color: #007acc;', log);
                        }).catch(lerr => console.log(lerr))
                }
            }
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
            const Query = db.select().table('account')
            Query.where('isDeleted', 0)
            Query.where('accountId', account.accountId).then(sData => {
                const { amount } = sData[0]
                if (amount * 1 < 1) {

                    const logData = {
                        idAccount: account.accountId,
                        amount: 0,
                        isEmpty: 1,
                        date: new Date().toISOString().split("T")[0]
                    }

                    db.insert(logData)
                        .into('log')
                        .then((log) => {
                            console.log('%caccounts.js line:48 log', 'color: #007acc;', log);
                        }).catch(lerr => console.log(lerr))
                }
                console.log(amount)
            }).catch(err => {
                reject(err)
            })
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
                accountId: activitie.accountId,
                activitieStatus: activitie.activitieStatus
            })
            .into('activities')
            .then(data => resolve(data))
            .catch(err => reject(JSON.stringify(err)))
    })
}

export const depositAccount = (account) => {
    return new Promise((resolve, reject) => {
        db('account').increment({ amount: account.amount }).where('accountId', account.accountId).then(data => {
            const oldAmount = account.oldAmount * 1
            console.log(oldAmount)
            if (oldAmount < 1) {
                const logData = {
                    idAccount: account.accountId,
                    amount: account.amount,
                    isEmpty: 0,
                    date: new Date().toISOString().split("T")[0]
                }

                db.insert(logData)
                    .into('log')
                    .then((log) => {
                        console.log('%caccounts.js line:48 log', 'color: #007acc;', log);
                    }).catch(lerr => console.log(lerr))
            }
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getAccountLog = (idAccount) => {
    return new Promise((resolve, reject) => {
        const Query = db.select().table('log')
        Query.where('idAccount', '=', idAccount * 1)
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}
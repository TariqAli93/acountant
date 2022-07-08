import db from '../config'
const Login = (username, password) => {
    return new Promise((resolve, reject) => {
        db.select().table('users').where('username', username).andWhere('password', password).then(user => {
            if (user.length) {
                const mapUser = user.map(u => {
                    return {
                        id: u.userId,
                        username: u.userName,
                        password: u.password,
                    }
                })

                const loggedUser = {
                    id: mapUser[0].id,
                    username: mapUser[0].username,
                    password: mapUser[0].password,
                }

                resolve(loggedUser)
            } else {
                reject('User not found')
            }
        }).catch(err => {
            reject(err)
        })
    });
}

export default Login;
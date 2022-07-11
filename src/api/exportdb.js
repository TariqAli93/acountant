import { remote } from 'electron';
import fs from 'fs';
import path from 'path';


const exportDb = async () => {
    const isBuild = process.env.NODE_ENV === 'production'
    const database_path = path.join(isBuild ? __dirname : __static, '../src/accountant.db');
    const dist = path.join(remote.app.getPath('desktop'));
    const date = new Date().toISOString().toString().replace(/[^0-9]/g, '');
    const fileName = `accountant-${date}.db`;

    fs.copyFileSync(database_path, path.join(dist, fileName));
}

export default exportDb;
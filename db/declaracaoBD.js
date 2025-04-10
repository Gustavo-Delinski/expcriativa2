import 'mysql';
import senhaDB from './senhaSQL.js';
import sequelize from 'sequelize';


function criaBD() {
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: senhaDB
    });
    db.query("CREATE DATABASE IF NOT EXISTS localtop")
    db.end()
}

const sequelize = sequelize('localtop', 'root', senhaDB, {
    host: 'localhost',
    dialect: 'mysql'
});

db.connect((err) => {
    if (err) {console.log(err);}
    if (err) throw err;
    console.log("Conectado ao banco de dados");
});



export default sequelize;
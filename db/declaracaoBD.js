import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import senhaDB from './senhaSQL.js';


async function criarDB() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: senhaDB
    });
    await connection.query("CREATE DATABASE IF NOT EXISTS localtop")
    await connection.end()
}

const sequelize = new Sequelize('localtop', 'root', senhaDB, {
    host: 'localhost',
    dialect: 'mysql'
});


async function iniciarDB() {
    await criarDB();
    await sequelize.sync();
}

iniciarDB().then(() => {
    console.log('Banco de dados sincronizado');
}).catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});

export default sequelize;
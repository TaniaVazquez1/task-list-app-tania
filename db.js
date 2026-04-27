const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: process.env.DB_HOST === 'localhost' ? undefined : { rejectUnauthorized: false }
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
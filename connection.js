const mysql = require('mysql2/promise');
const { dev, prod } = require('./config');

let config = prod.host ? prod : dev;

const pool = mysql.createPool(config);

const MySQL = {
    getPool : async () => {
        return pool;
    }
}

module.exports = MySQL;
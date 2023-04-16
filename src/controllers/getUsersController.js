const MySQL = require('../../connection')
const getValuesUsers = async (req, res) => {
    const sql = req.body.sql
    const pool = await MySQL.getPool();
    const findUsers = await pool.query(`SELECT * FROM empleados WHERE ${sql} LIKE ?`, [`%${req.body.value}%`])
    res
    .status(200)
    .json(findUsers[0]);
}

module.exports = {
    getValuesUsers
}
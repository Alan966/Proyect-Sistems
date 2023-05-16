const MySQL = require('../../connection');


const KnowIfIsANotaria = async (req, res) => {
    const notaria = req.body.notaria;
    if(!notaria){
        res.json({
            success: false,
            message: 'Faltan datos'
        })
        return;
    }
    const pool = await MySQL.getPool();
    const find_notaria_query = 'SELECT * FROM notarias WHERE notaria = ?';
    const find_notaria_result = await pool.query(find_notaria_query, [notaria]);
    if(find_notaria_result[0].length !== 1){
        res.json({
            success: false,
            message: 'Notaria no encontrada',
        })
        return;
    }
    res.json({
        success: true,
        message: 'Notaria encontrada',
    })
}

const getAllNotarias = async (req, res) => {
    const pool = await MySQL.getPool();
    const find_notarias_query = 'SELECT notaria FROM notarias';
    const notarias_data = await pool.query(find_notarias_query);
    const all_notarias  = notarias_data[0];
    if(all_notarias.length < 1){
        res.json({
            success: false,
            message: 'No hay notarias registradas'
        })
        return;
    }
    res.json({
        success: true,
        notarias: all_notarias
    })
}

const getNotaria = async (req, res) => {
    const notaria = req.params.notaria
    const pool = await MySQL.getPool();
    const find_notaria_query = 'SELECT * FROM notarias WHERE notaria = ?';
    const notaria_data = await pool.query(find_notaria_query, [notaria]);
    const data = notaria_data[0]
    if(data.length !== 1){
        res.send('Notaria no encontrada')
        return;
    }
    const user = req.user;
    const auth_cookie = req.auth_token;
    res.render('notaria', {
        title: 'Notaria',
        notaria: data[0],
        user: user.nameacount,
        email: user.email,
        auth_token: auth_cookie})
}

module.exports = {
    getNotaria,
    getAllNotarias,
    KnowIfIsANotaria
}
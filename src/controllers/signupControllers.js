const bycrypt = require('bcrypt');
const saltRounds = 10;
const MySQL = require('../../connection');
function encryptPassword(password){
    return new Promise((resolve, reject) => {
        bycrypt.genSalt(saltRounds, async function(err, salt) {
             bycrypt.hash(password, salt, function(err, hash) {
                resolve(hash)
                reject(err);
            });
        });
    })
}

async function giveMeAValidId(){
    const id_user = Math.floor(Math.random() * 1000000000);
    const chec_if_that_id_exist = 'SELECT * FROM users WHERE id_user = ?';
    const pool = await MySQL.getPool();
    const chec_if_that_id_exist_result = await pool.query(chec_if_that_id_exist, [id_user]);
    if(chec_if_that_id_exist_result[0].length > 0){
        giveMeAValidId();
    }else{
        return id_user;
    }
}

async function checkIfAValuedExist( values, check_if_value_exist){
    const pool = await MySQL.getPool();
    const check_if_user_exist_result = await pool.query(check_if_value_exist, [values]);
    if(check_if_user_exist_result[0].length > 0){
        return true;
    }else{
        return false;
    }
}

const signup = async (req, res) => {
    if(!req.body.password || !req.body.username || !req.body.email) {
        res.status(400).json({
            success: false,
            message: 'Faltan datos'
        })
        return;
    }

    const id_user = await giveMeAValidId();
    const check_if_user_exist = 'SELECT * FROM users WHERE nameacount = ?';
    const check_if_email_exist = 'SELECT * FROM users WHERE email = ?';
    const check_if_user_exist_result = await checkIfAValuedExist(req.body.username, check_if_user_exist);
    const check_if_email_exist_result = await checkIfAValuedExist(req.body.email, check_if_email_exist);

    if(check_if_user_exist_result === true || check_if_email_exist_result === true){
        return res.status(406).json({
            success: false,
            message: 'El usuario o el email ya existe'
        })
    }

    const passwordCript = await encryptPassword(req.body.password);
    const inset_user_table_user = 'INSERT INTO users(id_user,password, nameacount, email) VALUES(?,?,?,?)';
    const add_user_query_data = {
        id_user: id_user,
        password: passwordCript,
        nameacount: req.body.username,
        email: req.body.email
    };
    const pool = await MySQL.getPool();
    await pool.query(inset_user_table_user, Object.values(add_user_query_data));
    return res.status(200).json({
        success: true,
        message: 'Usuario creado'
    });
}

module.exports = {
    signup
}
const bycrypt = require('bcrypt');
const saltRounds = 10;
const MySQL = require('../../connection');
const jose = require('jose');
const signin = async (req, res) => {

    if(!req.body.password || !req.body.username) {
        res.status(400).json({
            success: false,
            message: 'Faltan datos'
        })
        return;
    }

    const pool = await MySQL.getPool();
    const find_user_query = 'SELECT * FROM users WHERE nameacount = ?';
    const signin = await pool.query(find_user_query,[req.body.username]);
    if(signin[0].length !== 1){
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado'
        })
    }
    const password = signin[0][0].password
    const compare = await bycrypt.compare(req.body.password, password);
    if(compare === false){
        return res.status(401).json({
            success: false,
            message: 'Contraseña incorrecta'
        })
    }
    const secret = new TextEncoder().encode(process.env.JWT_PRIVATE_KEY);
    const auth_token = await new jose.SignJWT({
        signin: signin[0][0].id_user
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10h')
    .sign(secret);


    res.cookie('auth_token', auth_token, {
        httpOnly: true,
        secure: true,
        maxAge: 36000000 // 10 hours
    })
    res
    .status(200)
    .json({
        success: true,
        message: 'Go to Dashboard',
        auth_token
    })
    return;
}

module.exports = {
    signin
}
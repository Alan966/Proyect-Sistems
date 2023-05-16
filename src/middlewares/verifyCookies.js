const jose = require('jose');
const MySQL = require('../../connection');
const verifyCookies = async (req, res, next) => {
    const auth_cookie = req.cookies.auth_token;
    if(!auth_cookie){
        res
        .status(401)
        .redirect('/signin');
        return;
    }
    req.auth_token = auth_cookie;
    const encoder = new TextEncoder();
    const { payload } = await jose.jwtVerify(
        auth_cookie,
        encoder.encode(process.env.JWT_PRIVATE_KEY)
    ).catch((err) => {
        res
        .status(401)
        .redirect('/signin');
        return;
    })

    const id_user = payload.signin;
    const find_user_query = 'SELECT * FROM users WHERE id_user = ?';
    const pool = await MySQL.getPool();
    const find_user = await pool.query(find_user_query, [id_user]);
    req.user = find_user[0][0];
    if(!req.user){
        res
        .status(401)
        .redirect('/signin');
        return;
    }else{
        next();
    }
}


exports.verifyCookies = verifyCookies;
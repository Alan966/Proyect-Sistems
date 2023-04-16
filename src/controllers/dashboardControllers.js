const jose = require('jose');
const MySQL = require('../../connection');
const getDashboard = async (req, res) => {

    const auth_cookie = req.cookies.auth_token;
    if(!auth_cookie){
        res
        .status(401)
        .redirect('/signin');
        return;
    }

    const encoder = new TextEncoder();
    const { payload } = await jose.jwtVerify(
        auth_cookie,
        encoder.encode(process.env.JWT_PRIVATE_KEY)
    ).catch((err) =>{
        res
        .status(401)
        .redirect('/signin');
        return;
    })

    const pool = await MySQL.getPool();
    const find_user_query = 'SELECT * FROM users WHERE id_user = ?';
    const profile = await pool.query(find_user_query,[payload.signin]);
    const id_user = profile[0][0].id_user;
    const name = profile[0][0].nameacount;
    const email = profile[0][0].email;
    res.render('dashboard', {title: 'Dashboard', name, email})
}

module.exports = {
    getDashboard
};
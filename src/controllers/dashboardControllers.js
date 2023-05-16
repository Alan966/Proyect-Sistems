const jose = require('jose');
const MySQL = require('../../connection');
const getDashboard = async (req, res) => {

    const user = req.user;
    const auth_cookie = req.auth_token;

    const name = user.nameacount;
    const email = user.email;
    res.render('dashboard', {title: 'Dashboard', name, email,
    token: auth_cookie })
}

module.exports = {
    getDashboard
};
const MySQL = require('../../connection');
const getEmployer = async  (req, res) => {
    const matricula = req.params.matricula;
    const pool = await MySQL.getPool();
    const findEmployer = await pool.query('SELECT * FROM empleados WHERE MATRICULA = ?', [matricula])
    const dataBases = [
        'gastos_escritura',
        'gastos_escrituracion',
        'pagares_mediano',
        'pagares_vehiculos'
    ];
    let allPrestamos = new Map();
    let counter = 1
    for(let i = 0; i < dataBases.length; i++){
        const findServicesUser = await pool.query(`SELECT * FROM ${dataBases[i]} WHERE MATRICULA = ?`, [matricula])
        for(service of findServicesUser[0]){
            allPrestamos.set(`${dataBases[i]}${counter++}`, service)
        }
    }

   const user = req.user;
   const auth_cookie = req.auth_token;
    res
    .status(200)
    .render('employer', {
        allPrestamos,
        employer: findEmployer[0],
        user: user.nameacount,
        email: user.email,
        auth_token: auth_cookie
    })
}


module.exports = {
    getEmployer
}
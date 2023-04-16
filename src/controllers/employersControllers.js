const MySQL = require('../../connection');


const getEmployer = async (req, res) => {
    const matricula = req.params.matricula.replace(/:/g, "")
    const pool = await MySQL.getPool();
    const findUser = await pool.query('SELECT * FROM empleados WHERE matricula = ?', [matricula])
    const dataBases = [
        'finaciamiento_escritura',
        'gatos_escrituracion',
        'pagares_mediano',
        'pagares_vehiculos'
    ];
    let prestamos = [];
    for(i = 0; i < dataBases.length; i++){
        const findServicesUser = await pool.query(`SELECT * FROM ${dataBases[i]} WHERE matricula_clie = ?`, [matricula])
        if(findServicesUser[0].length > 0){
            findServicesUser[0][0].type = dataBases[i]
            prestamos.push(findServicesUser[0][0])
        }
    }
    res
    .status(200)
    .render('employer', {
        prestamos,
        user: findUser[0]
    })
}


module.exports = {
    getEmployer
}
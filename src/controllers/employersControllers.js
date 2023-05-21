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

const createEmployer = (req, res) => {
    const user = req.user;
    const auth_cookie = req.auth_token;
    res
    .render('createEmployer', {
        user: user.nameacount,
        email: user.email,
        auth_token: auth_cookie
    })
}

const createEmployerPost = async (req, res) => {
    if(!req.body.complete_name){
        res
        .status(400)
        .json({
            success: false,
            message: 'El nombre completo es requerido'
        })
        return;
    }

    const matircula = await getValidMatricula();
    const complete_name = req.body.complete_name;
    const query_create_employer = 'INSERT INTO empleados (MATRICULA, Nombre) VALUES (?, ?)';
    const pool = await MySQL.getPool();
    try {
        const result_create_employer = await pool.query(query_create_employer, [matircula, complete_name]);
        res.json({
            success: true,
            message: 'Empleado creado con exito',
            name: complete_name,
            matricula: matircula
        })
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: 'Error al crear el empleado'
        })
        return;
    }

}


async function getValidMatricula(){
    const matricula = Math.floor(Math.random() * 1000000000);

    const query_get_matricula = 'SELECT matricula FROM empleados WHERE matricula = ?';

    const pool = await MySQL.getPool();

    const result_matricula = await pool.query(query_get_matricula, [matricula]);

    if(result_matricula[0].length > 0){
        return getValidMatricula();
    }else{
        return matricula;
    }
}


module.exports = {
    getEmployer,
    createEmployer,
    createEmployerPost
}
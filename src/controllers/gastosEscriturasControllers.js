const MYSQL = require('../../connection');
const { v4: uuidv4 }  = require('uuid');
const getDatosEscrituras = async (req, res) => {

    const query_select_all_gastos_escrituras = 'SELECT * FROM gastos_escrituracion INNER JOIN empleados ON gastos_escrituracion.matricula = empleados.MATRICULA LIMIT 0, 50';
    const pool = await MYSQL.getPool();
    const query_select_all_gastos_result = await pool.query(query_select_all_gastos_escrituras);
    if(query_select_all_gastos_result[0].length < 1){
        res
        .status(500)
        .send('No hay gastos de escrituracion que mostrar');
        return;
    }

    const user = req.user;
    const auth_cookie = req.auth_token;

    res.render('gastosEscrituras', {
        title: 'Gastos de Escrituras',
        allGastosEscrituras : query_select_all_gastos_result[0],
        user: user.nameacount,
        email: user.email,
        auth_token: auth_cookie
    })
};
const getGastoEscriturailterBy = async (req, res) => {
    const pool = await MYSQL.getPool();
    const filterby = req.params.filterby;
    const value = req.body.value;
    const query_find_gastos_escrituras = `SELECT * FROM gastos_escrituracion INNER JOIN empleados ON gastos_escrituracion.matricula = empleados.MATRICULA WHERE gastos_escrituracion.${filterby} LIKE '%${value}%'`;

    const query_find_gastos_escrituras_result = await pool.query(query_find_gastos_escrituras);
    const gastos_escrituras_result = query_find_gastos_escrituras_result[0];
    if(gastos_escrituras_result.length < 1){
        res.json({
            success: false,
            message: 'No se encontraron Gastos de Escrituras con los datos proporcionados'
        })
        return;
    }

    res.json({
        success: true,
        gastos_escrituras_result
    })
};


const createGastoEscrituracion = async (req, res) => {
    const body = req.body;
    console.log(body);
    if( !body.entregado ||
        !body.orden ||
        !body.fecha_recepcion ||
        !body.no_oficio_recepcion ||
        !body.fecha_oficio_recepcion ||
        !body.matricula ||
        !body.fecha_pagare ||
        !body.fecha_contrato ||
        !body.no_oficio_entrega ||
        !body.fecha_oficio_entrega ||
        !body.fecha_entrega ||
        !body.destino){
            res.json({
                success: false,
                message: 'Datos insuficientes para crear el gasto de escrituracion'
            })
            return;
        }


        const body_query = {
            no_escrituracion: uuidv4(),
            entregado: body.entregado,
            orden: body.orden,
            fecha_recepcion: body.fecha_recepcion,
            no_oficio_recepcion: body.no_recepcion_oficio,
            fecha_oficio_recepcion: body.fecha_oficio_recepcion,
            matricula: body.matricula,
            fecha_pagare: body.fecha_pagare,
            fecha_contrato: body.fecha_contrato,
            no_oficio_entrega: body.no_oficio_entrega,
            fecha_oficio_entrega: body.fecha_oficio_entrega,
            fecha_entrega: body.fecha_entrega,
            destino: body.destino
        }
        const query_create_gasto_escrituracion = `INSERT INTO gastos_escrituracion(
            no_escrituracion,
            orden,
            entregado,
            fecha_recepcion,
            no_oficio_recepcion,
            fecha_oficio_recepcion,
            matricula,
            fecha_pagare,
            fecha_contrato,
            no_oficio_entrega,
            fecha_oficio_entrega,
            fecha_entrega,
            destino
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);
        `
        const pool = await MYSQL.getPool();
        try {
            await pool.query(query_create_gasto_escrituracion, Object.values(body_query));
            res.json({
                success: true,
                message: 'Se creo el Gasto de Escrituracion'
            })
        } catch (error) {
            console.log(error);
            res.json({
                success: false,
                message: 'Ocurrio un error al crear el gasto de escrituracion'
            })
        }
}

const updateGastosEscrituracion = async (req, res) => {

    if(!req.body.no_escrituracion){
        res.json({
            success: false,
            message: 'Datos insuficientes para actualizar los datos de esta escrituracion'
        })
        return;
    }

    const query = createQueryUpdateEscrituracion(req.body);
    delete req.body.no_escrituracion;
    const pool = await MYSQL.getPool();
    try {
        const response = await pool.query(query, Object.values(req.body));
        if(response[0].affectedRows !== 1){
            res.json({
                success: false,
                message: 'Error no se puedo encontrar la escrituracion que se desea actualizar'
            })
            return;
        }
        res.json({
            success: true,
            message: 'Se actualizo correctamente'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Ocurrio un error al actualizar los datos de esta escrituracion'
        })
    }
};

function createQueryUpdateEscrituracion(body){
    let query = 'UPDATE gastos_escrituracion SET ';
    let keys = Object.keys(body);
    let values = Object.values(body);
    for(let i = 1; i < keys.length; i++){
        if(i === keys.length -1){
            query += `${keys[i]} = ? WHERE no_escrituracion = '${values[0]}'`;
        }else{
            query += `${keys[i]} = ?, `;
        }
    }
    return query;
}

const deleteGastosEscrituracion = async (req, res) => {

    const { identificador } = req.body;
    if(!identificador){
        res.json({
            success: false,
            message: 'Datos insuficientes para eliminar esta escrituracion'
        })
        return
    }

    const query_delete_escrituracion = 'DELETE FROM gastos_escrituracion WHERE no_escrituracion = ?';
    const pool = await MYSQL.getPool();

    try {
        await pool.query(query_delete_escrituracion, [identificador]);
        res.json({
            success: true,
            message: 'El gasto de escrituracion se elimino correctamente'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Ocurrio un error al eliminar el gasto de escrituracion'
        })
    }
}

module.exports ={
    updateGastosEscrituracion,
    getDatosEscrituras,
    createGastoEscrituracion,
    deleteGastosEscrituracion,
    getGastoEscriturailterBy
};
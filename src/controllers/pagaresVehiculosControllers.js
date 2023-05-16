const MYSQL = require('../../connection');
const { v4: uuidv4 }  = require('uuid');

const getPagaresVehiculos = async (req, res) => {

    const query_get_all_pagares_vehiculos = 'SELECT * FROM pagares_vehiculos INNER JOIN empleados ON pagares_vehiculos.matricula = empleados.MATRICULA ORDER BY pagares_vehiculos.no_pagare ASC LIMIT 0, 50';
    const pool = await MYSQL.getPool();

    const result_query_get_all_pagares_vehiculos = await pool.query(query_get_all_pagares_vehiculos);
    if(result_query_get_all_pagares_vehiculos[0].length < 1){
        res.send('No hay Pagares de Vehiculos que mostrar')
        return;
    }
    const allPagaresVehiculos = result_query_get_all_pagares_vehiculos[0];
    const user = req.user;
    const auth_cookie = req.auth_token;

    res.render('pagaresVehiculos', {
        title: 'Pagares de Vehiculos',
        allPagaresVehiculos,
        user: user.nameacount,
        email: user.email,
        auth_token: auth_cookie
    })
}

const getPagaresVehiculosBy = async (req, res) => {
    const pool = await MYSQL.getPool();
    const filterby = req.params.filterby;
    const value = req.body.value;
    const query_find_pagares_vehiculos = `SELECT * FROM pagares_vehiculos INNER JOIN empleados ON
        pagares_vehiculos.matricula = empleados.MATRICULA WHERE pagares_vehiculos.${filterby} LIKE '%${value}%'`;

    const query_find_pagares_vehiculos_result = await pool.query(query_find_pagares_vehiculos);
    const pagares_vehiculos_result = query_find_pagares_vehiculos_result[0];
    if(pagares_vehiculos_result.length < 1){
        res.json({
            success: false,
            message: 'No se encontraron Pagares Vehiculos con los datos proporcionados'
        })
        return;
    }

    res.json({
        success: true,
        pagares_vehiculos_result
    })
};


const updatePagareVehiculo = async (req, res) => {
    const { no_pagare } = req.body;
    if(!no_pagare){
        res.json({
            success: false,
            message: 'No hay suficientes datos para actualizar el pagare de vehiculo'
        })
        return;
    }
    const query_update_financiamiento_vehiculo = createQueryUpdate(req.body);
    delete req.body.no_pagare;
    const pool = await MYSQL.getPool();
    try {
         const response = await pool.query(query_update_financiamiento_vehiculo, Object.values(req.body));
         if(response[0].affectedRows !== 1){
            res.json({
                success: true,
                message: 'No se encontro el pagare de vehiculo a actualizar'
            });
            return;
         }
            res.json({
                success: true,
                message: 'Pagare de vehiculo actualizado correctamente'
            });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error al actualizar el pagare de vehiculo'
        });
    }
}

function createQueryUpdate(data){
    let query = 'UPDATE pagares_vehiculos SET ';
    let keys = Object.keys(data);
    let values = Object.values(data);
    for(let i = 1; i < keys.length; i++){
        if(i == keys.length -1){
            query += `${keys[i]} = ? WHERE no_pagare = '${values[0]}'`
        }else{
            query += `${keys[i]} = ?, `
        }
    }
    return query;
}


const deletePagareVehiculo = async (req, res) => {
    const { identificador } = req.body;
    if(!identificador){
        res.json({
            success: false,
            message: 'Datos insuficientes para eliminar el pagare'
        })
        return;
    }

    const query_delete_pagare = 'DELETE FROM pagares_vehiculos WHERE no_pagare = ?';
    const pool = await MYSQL.getPool();
    try {
        await pool.query(query_delete_pagare, [identificador]);
        res.json({
            success: true,
            message: 'Pagare eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error al eliminar el pagare'
        });
    }
}

const createPagareVehiculo = async (req, res) => {
    const body = req.body;
    if(
        !body.entregado ||
        !body.orden ||
        !body.fecha_recepcion ||
        !body.no_oficio ||
        !body.matricula||
        !body.no_solicitud ||
        !body.fecha_solicitud ||
        !body.fecha_entrega ||
        !body.destino ||
        !body.no_factura
    ){
        res.json({
            success: false,
            message: 'Datos insuficientes para crear el pagare del Vehiculo'
        });
        return;
    }
    const body_quey = {
        no_pagare: uuidv4(),
        entregado: body.entregado,
        orden: body.orden,
        fecha_recepcion: body.fecha_recepcion,
        no_oficio: body.no_oficio,
        matricula: body.matricula,
        no_solicitud: body.no_solicitud,
        fecha_solicitud: body.fecha_solicitud,
        fecha_entrega: body.fecha_entrega,
        destino: body.destino,
        no_factura: body.no_factura
    }

    const query_create_pagare_vehiculo = ` INSERT INTO pagares_vehiculos(
        no_pagare,
        entregado,
        orden,
        fecha_recepcion,
        no_oficio,
        matricula,
        no_solicitud,
        fecha_solicitud,
        fecha_entrega,
        destino,
        no_factura
    ) VALUES(? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const pool = await MYSQL.getPool();

    try {
         await pool.query(query_create_pagare_vehiculo, Object.values(body_quey));
        res.json({
            success: true,
            message: 'Pagare del vehiculo creado correctamente'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error al crear el pagare del vehiculo'
        });
    }

}
module.exports = {
    getPagaresVehiculos,
    updatePagareVehiculo,
    deletePagareVehiculo,
    createPagareVehiculo,
    getPagaresVehiculosBy
};
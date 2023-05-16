const MYSQL = require('../../connection');
const { v4: uuidv4 }  = require('uuid');

const getAllPagaresMediano = async (req, res) => {
    const query_get_all_pagares_mediano = 'SELECT * FROM pagares_mediano INNER JOIN empleados ON pagares_mediano.matricula = empleados.matricula ORDER BY pagares_mediano.orden LIMIT 0, 50';
    const pool = await MYSQL.getPool();
    const result_query_get_all_pagares_mediano = await pool.query(query_get_all_pagares_mediano);
    if(result_query_get_all_pagares_mediano[0].length < 1){
        res
        .send('No hay Pagares Mediano Plazo que mostrar')
        return;
    }


    const allPagaresMediano = result_query_get_all_pagares_mediano[0];
    const user = req.user;
    const auth_cookie = req.auth_token;
    res.render(
        'pagaresMediano',
        {
            title: 'Pagares Mediano Plazo',
            allPagaresMediano,
            user: user.nameacount,
            email: user.email,
            auth_token: auth_cookie
        })
};

const getPagaresMedinaoBy = async (req, res) => {
    const pool = await MYSQL.getPool();
    const filterby = req.params.filterby;
    const value = req.body.value;
    const query_find_pagares_mediano = `SELECT * FROM pagares_mediano INNER JOIN empleados ON pagares_mediano.matricula = empleados.MATRICULA WHERE pagares_mediano.${filterby} LIKE '%${value}%'`;

    const query_find_pagares_mediano_result = await pool.query(query_find_pagares_mediano);
    const pagares_mediano_result = query_find_pagares_mediano_result[0];
    if(pagares_mediano_result.length < 1){
        res.json({
            success: false,
            message: 'No se encontraron Pagares a Mediano Plazo con los datos proporcionados'
        })
        return;
    }

    res.json({
        success: true,
        pagares_mediano_result
    })
};

const createPagareMediano = async (req, res) => {
    console.log(req.body);
    const data = req.body;
    if( !data.entregado ||
        !data.orden ||
        !data.fecha_recepcion ||
        !data.oficio_recepcion ||
        !data.fecha_recepcion_oficio ||
        !data.matricula ||
        !data.fecha_pagare ||
        !data.fecha_contrato ||
        !data.oficio_entrega ||
        !data.fecha_entrega_oficio ||
        !data.fecha_entrega ||
        !data.destino){
            res.json({
                success: false,
                message: 'Datos insuficientes para crear el pagare'
            })
            return;
        }

    const body_query = {
        no_pagaresMediano: uuidv4(),
        entregado: data.entregado,
        orden: data.orden,
        fecha_recepcion: data.fecha_recepcion,
        oficio_recepcion: data.oficio_recepcion,
        fecha_recepcion_oficio: data.fecha_recepcion_oficio,
        matricula: data.matricula,
        fecha_pagare: data.fecha_pagare,
        fecha_contrato: data.fecha_contrato,
        oficio_entrega: data.oficio_entrega,
        fecha_entrega_oficio: data.fecha_entrega_oficio,
        fecha_entrega: data.fecha_entrega,
        destino: data.destino
    }
    const query_create_pagare_mediano = `
    INSERT INTO pagares_mediano(
        no_pagaresMediano,
        entregado,
        orden,
        fecha_recepcion,
        oficio_recepcion,
        fecha_recepcion_oficio,
        matricula,
        fecha_pagare,
        fecha_contrato,
        oficio_entrega,
        fecha_entrega_oficio,
        fecha_entrega,
        destino
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const pool = await MYSQL.getPool();

    try {
        await pool.query(query_create_pagare_mediano, Object.values(body_query));
        res.json({
            success: true,
            message: 'Pagare creado correctamente'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error al crear el pagare'
        })
    }

}
const updatePagareMedianos = async (req, res) => {

    if(!req.body.no_pagaresMediano){
        res.json({
            success: false,
            message: 'Datos insuficientes para actualizar el pagare'
        })
        return;
    }
    const data = req.body;
    const query_update_data = createQueryUpdateData(data);
    const pool = await MYSQL.getPool();
    delete data.no_pagaresMediano;
    try {
        const response = await pool.query(query_update_data, Object.values(data));
        if(response[0].affectedRows !== 1){
            res.json({
                success: false,
                message: 'No se encontro el pagare Mediano a actualizar'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Pagare actualizado correctamente'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error al actualizar el pagare'
        })
    }
}

function createQueryUpdateData(data){
    const keys = Object.keys(data);
    const values = Object.values(data);
    let query = 'UPDATE pagares_mediano SET ';
    for(let i = 1; i < keys.length; i++){
        if(i === keys.length - 1){
            query += `${keys[i]} = ? WHERE no_pagaresMediano = '${values[0]}'`
        }else{
            query += `${keys[i]} = ?, `
        }
    }
    return query;
}

const deletePagareMedianos = async (req, res) => {
    const { identificador } = req.body;
    if(!identificador){
        res.json({
            success: false,
            message: 'Datos insuficientes para eliminar el pagare'
        })
        return;
    }

    const query_delete_pagare = 'DELETE FROM pagares_mediano WHERE no_pagaresMediano = ?';
    const pool = await MYSQL.getPool();

    try {
        await pool.query(query_delete_pagare, [identificador]);
        res.json({
            success: true,
            message: 'Pagare eliminado correctamente'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error al eliminar el pagare'
        })
    }

}

module.exports = {
    getAllPagaresMediano,
    createPagareMediano,
    updatePagareMedianos,
    deletePagareMedianos,
    getPagaresMedinaoBy
}
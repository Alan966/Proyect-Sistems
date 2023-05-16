const MYSQL = require('../../connection');
const { v4: uuidv4 }  = require('uuid');
const getFinanciamiento = async (req, res) => {
    const pool = await MYSQL.getPool();
    const findFinanciamiento = await pool.query('SELECT * FROM gastos_escritura INNER JOIN empleados ON gastos_escritura.matricula = empleados.MATRICULA LIMIT 0, 50');
    const allFinanciamiento = findFinanciamiento[0];
    if(allFinanciamiento.length < 1){
        res.send('No hay Financiamientos de Escrituras que mostrar')
        return;
    }
    const user = req.user;
    const auth_cookie = req.auth_token;

    res.render('financiamiento', {
        title: 'Financiamiento de Escrituras',
        allFinanciamiento,
        user: user.nameacount,
        email: user.email,
        auth_token: auth_cookie
    })
}
const getFinanciamientoFilterBy = async (req, res) => {
    const pool = await MYSQL.getPool();
    const filterby = req.params.filterby;
    const value = req.body.value;
    const query_find_financiamientosBy = `SELECT * FROM gastos_escritura INNER JOIN empleados ON gastos_escritura.matricula = empleados.MATRICULA WHERE ${filterby} LIKE '%${value}%'`;

    const query_find_financiamiento_result = await pool.query(query_find_financiamientosBy);
    const financiamiento_result = query_find_financiamiento_result[0];
    if(financiamiento_result.length < 1){
        res.json({
            success: false,
            message: 'No se encontraron financiamientos con los datos proporcionados'
        })
        return;
    }

    res.json({
        success: true,
        financiamiento_result
    })
};


const createFinanciamiento = async (req, res) => {
    const pool = await MYSQL.getPool();
    const body = req.body;
    console.log(body);
    if( !body.entrega ||
        !body.orden ||
        !body.oficio_recepcion ||
        !body.fecha_oficio_recepcion ||
        !body.fecha_recepcion ||
        !body.escritura ||
        !body.financiamiento_fecha ||
        !body.notaria ||
        !body.matricula ||
        !body.tiempo_guardia ||
        !body.no_entrega_oficio ||
        !body.fecha_entrega_oficio ||
        !body.dependencia){
            console.log(body);
            res.json({
                success: false,
                message: 'Faltan datos, insuficentes para crear el financiamiento'
            })
            return;
        }
        const body_query = {
            no_financiamiento: uuidv4(),
            entrega: body.entrega,
            orden: body.orden,
            oficio_recepcion: body.oficio_recepcion,
            fecha_oficio_recepcion: body.fecha_oficio_recepcion,
            fecha_recepcion: body.fecha_recepcion,
            escritura: body.escritura,
            financiamiento_fecha: body.financiamiento_fecha,
            notaria: body.notaria,
            matricula: body.matricula,
            tiempo_guardia: body.tiempo_guardia,
            no_entrega_oficio: body.no_entrega_oficio,
            fecha_entrega_oficio: body.fecha_entrega_oficio,
            dependencia: body.dependencia,
        }

        const query_create_financiamiento = `
        INSERT INTO gastos_escritura(
            no_financiamiento,
            entrega,
            orden,
            oficio_recepcion,
            fecha_oficio_recepcion,
            fecha_recepcion,
            escritura,
            financiamiento_fecha,
            notaria,
            matricula,
            tiempo_guardia,
            no_entrega_oficio,
            fecha_entrega_oficio,
            dependencia) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            try {
                const query_create_financiamiento_result = await pool.query(query_create_financiamiento, Object.values(body_query))
                res.json({
                    success: true,
                    message: 'Financiamiento creado'
                })
            } catch (error) {
                console.log(error);
                res.json({
                    success: false,
                    message: 'Error al crear el financiamiento'
                })
            }
}

const updateFinanciamiento = async (req, res) => {
    const pool = await MYSQL.getPool();
    const query_update_finaciameinto = createQueryUpdateData(req.body)
    let  body = req.body;
    if(!body.no_financiamiento){
        res.json({
            success: false,
            message: 'Faltan datos, insuficentes para actualizar el financiamiento'
        })
        return;
    }
    delete body.no_financiamiento;
try {
    const update_financiamiento = await pool.query(query_update_finaciameinto, Object.values(body));
    if(update_financiamiento[0].affectedRows !== 1){
        res.json({
            success: false,
            message: 'No se encontro el financiamiento a actualizar'
        });
        return;
    }
        res.json({
            success: true,
            message: 'Financiamiento actualizado'
        });
        return;
} catch (error) {
    console.log(error);
    res.json({
        success: false,
        message: 'Error al actualizar el financiamiento'
    });
}
}

function createQueryUpdateData(objetc){
    let query = 'UPDATE gastos_escritura SET ';
    let keys = Object.keys(objetc);
    let values = Object.values(objetc);
    for(let i = 1; i < keys.length; i++){
        if(i === keys.length - 1){
            query += `${keys[i]} = ? WHERE no_financiamiento = '${values[0]}'`;
        }else{
            query += `${keys[i]} = ?, `;
        }
    }
    return query;
}

const deleteFinanciameinto = async (req, res) => {
    const pool = await MYSQL.getPool();
    const { identificador } = req.body;
    console.log(identificador);
    if(!identificador){
        res.json({
            success: false,
            message: 'Faltan datos, insuficentes para eliminar el financiamiento'
        })
        return;
    }

    const query_delete_financiamiento = 'DELETE FROM gastos_escritura WHERE no_financiamiento = ?';
    try {
        const query_delete_financiamiento_result = await pool.query(query_delete_financiamiento, [identificador]);
        res.json({
            success: true,
            message: 'Financiamiento eliminado'
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'Error al eliminar el financiamiento'
        })
    }
}

const createNo_financiamiento = (req, res) => {
    res.json({
        no_financiamiento: uuidv4()
    })
}

module.exports = {
    getFinanciamiento,
    updateFinanciamiento,
    deleteFinanciameinto,
    createNo_financiamiento,
    createFinanciamiento,
    getFinanciamientoFilterBy
}
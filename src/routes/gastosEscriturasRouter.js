const express = require('express');
const router = express.Router();
const { getDatosEscrituras, updateGastosEscrituracion, createGastoEscrituracion, deleteGastosEscrituracion, getGastoEscriturailterBy } = require('../controllers/gastosEscriturasControllers');
const verifyCookies = require('../middlewares/verifyCookies');

router.get('/', verifyCookies.verifyCookies, getDatosEscrituras);
router.post('/createEscrituraGastos', createGastoEscrituracion);
router.put('/updategastos', updateGastosEscrituracion);
router.delete('/deletegastos', deleteGastosEscrituracion)
router.post('/filterby/:filterby', getGastoEscriturailterBy)


module.exports = router;
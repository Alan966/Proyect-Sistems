const express = require('express');
const router = express.Router();

const { getPagaresVehiculos, updatePagareVehiculo , deletePagareVehiculo, createPagareVehiculo, getPagaresVehiculosBy} = require('../controllers/pagaresVehiculosControllers');
const verifyCookies = require('../middlewares/verifyCookies');

router.get('/', verifyCookies.verifyCookies, getPagaresVehiculos);
router.post('/createpagare', createPagareVehiculo)
router.put('/updatepagares', updatePagareVehiculo);
router.delete('/deletepagare', deletePagareVehiculo);
router.post('/filterby/:filterby', getPagaresVehiculosBy);


module.exports = router;
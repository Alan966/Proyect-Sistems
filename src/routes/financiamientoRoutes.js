const express = require('express');
const router = express.Router();

const { getFinanciamiento, updateFinanciamiento , deleteFinanciameinto, createNo_financiamiento, createFinanciamiento, getFinanciamientoFilterBy} = require('../controllers/financiamientoControllers'); 
const verifyCookies = require('../middlewares/verifyCookies');

router.get('/', verifyCookies.verifyCookies, getFinanciamiento);
router.post('/createfinanciaiento', createFinanciamiento);
router.put('/updatefinaciamiento', updateFinanciamiento)
router.delete('/deletefinanciamiento', deleteFinanciameinto)
router.get('/createNo_financiamiento', createNo_financiamiento)
router.post('/filterby/:filterby', getFinanciamientoFilterBy)
module.exports = router;
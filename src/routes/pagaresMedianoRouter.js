const express = require('express');
const router = express.Router();
const { getAllPagaresMediano, updatePagareMedianos, deletePagareMedianos, createPagareMediano , getPagaresMedinaoBy} = require('../controllers/pagaresMedianoControllers');
const verifyCookies = require('../middlewares/verifyCookies');

router.get('/', verifyCookies.verifyCookies, getAllPagaresMediano);
router.post('/createpagare', createPagareMediano);
router.put('/updatepagares', updatePagareMedianos);
router.delete('/deletepagare', deletePagareMedianos);
router.post('/filterby/:filterby', getPagaresMedinaoBy);
module.exports = router;
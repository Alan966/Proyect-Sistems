const express = require('express');
const router = express.Router();

const { getNotaria, getAllNotarias, KnowIfIsANotaria } = require('../controllers/notariasController');
const verifyCookies = require('../middlewares/verifyCookies');


router.get('/', getAllNotarias)
router.get('/:notaria', verifyCookies.verifyCookies, getNotaria)
router.post('/', KnowIfIsANotaria)

module.exports = router;
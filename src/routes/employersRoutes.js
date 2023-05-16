const express = require('express')
const router = express.Router();
const { getEmployer } = require('../controllers/employersControllers');
const verifyCookies = require('../middlewares/verifyCookies');

router.get('/employer/:matricula', verifyCookies.verifyCookies, getEmployer )

module.exports = router;
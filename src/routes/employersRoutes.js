const express = require('express')
const router = express.Router();
const { getEmployer, createEmployer, createEmployerPost } = require('../controllers/employersControllers');
const verifyCookies = require('../middlewares/verifyCookies');

router.get('/employer/:matricula', verifyCookies.verifyCookies, getEmployer )

router.get('/createEmpleado', verifyCookies.verifyCookies, createEmployer )

router.post('/employer/createEmployer', verifyCookies.verifyCookies, createEmployerPost)

module.exports = router;
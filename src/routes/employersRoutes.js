const express = require('express')
const router = express.Router();
const { getEmployer } = require('../controllers/employersControllers');

router.get('/employer/:matricula', getEmployer )

module.exports = router;
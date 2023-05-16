const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardControllers');
const verifyCookies = require('../middlewares/verifyCookies');

router.get('/', verifyCookies.verifyCookies, getDashboard);

module.exports = router;
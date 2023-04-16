const express = require('express');
const router = express.Router();

const { getDashboard } = require('../controllers/dashboardControllers');

router.get('/', getDashboard);

module.exports = router;
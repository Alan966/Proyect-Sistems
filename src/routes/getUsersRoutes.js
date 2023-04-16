const express = require('express')
const router = express.Router();
const { getValuesUsers } = require('../controllers/getUsersController');

router.post('/', getValuesUsers)
router.get('/', (req, res) => {
    res.send('Hi How are you ?')
})

module.exports = router
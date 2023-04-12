const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/signupControllers');

router.get('/', (req, res) => {
    res.render('signup', {title: 'Signup'})
})
router.post('/', signup)
module.exports = router;
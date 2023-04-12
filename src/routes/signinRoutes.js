const express = require('express');
const router = express.Router();

const { signin } = require('../controllers/signinControllers');

router.get('/', (req, res) => {
    res.render('signin', {title: 'Signin'})
})
router.post('/', signin)
module.exports = router;
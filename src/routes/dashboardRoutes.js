const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('dashboard', {title: 'Dashboard'}),
    console.log(req);
});

module.exports = router;
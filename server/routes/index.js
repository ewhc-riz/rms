const express = require('express');
const router = express.Router();
const user = require('./user');
const addRecon = require('./recon');



router.use('/user', user);
router.use('/add-recon', addRecon);

module.exports = router;
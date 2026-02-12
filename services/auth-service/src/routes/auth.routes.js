const express = require('express');
const { verify } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/verify', verify);

module.exports = router;
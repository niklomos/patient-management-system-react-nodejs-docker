const express = require('express');
const router = express.Router();
const { validateToken } = require('../controllers/authController');

router.get('/validate-token', validateToken);

module.exports = router;

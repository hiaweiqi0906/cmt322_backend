const express = require('express');
const router = express.Router();
const { test, registerUser, loginUser, readUser } = require('../controllers/authController')

router.post('/login', loginUser)

module.exports = router;
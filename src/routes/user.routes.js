const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const { registerValidator, loginValidator } = require('../validators/user.validator');

// Registro
router.post('/register', registerValidator, userCtrl.register);

// Login
router.post('/login', loginValidator, userCtrl.login);

// Perfil
router.get('/me', auth, userCtrl.getProfile);

module.exports = router;

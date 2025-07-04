const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');



// Registro de usuario
router.post('/register' , authController.register);

// Login de usuario
router.post('/login', authController.login);

// Ver perfil
const auth = require('../middlewares/auth'); // Middleware JWT
router.get('/me', auth, authController.getProfile);

//Buscar 
router.get('/search', auth, authController.searchUser);

//View
router.get('/:id',auth, authController.getuserById);
module.exports = router;

module.exports = router;

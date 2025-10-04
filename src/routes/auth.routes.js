const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');
const auth = require('../middlewares/auth'); // Middleware JWT


// Registro de usuario
router.post('/register' , authController.register);

// Login de usuario
router.post('/login', authController.login);

// Ver perfil


router.get('/list', authController.listUser); 



router.get('/getusers', authController.getusers); 

router.put('/update/:id', authController.updateUser);

router.get('/me', auth, authController.getProfile);

//Buscar 
router.get('/search', auth, authController.searchUser);

//View
router.get('/:id',auth, authController.getuserById);



module.exports = router;


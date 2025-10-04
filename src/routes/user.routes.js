const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const { registerValidator, loginValidator } = require('../validators/user.validator');
router.put('/:ud', (req, res, next) => {
  console.log("✅ Entró en la ruta /update/:id");
  next();
}, userCtrl.updateUser);

// router.get('/search', userCtrl.searchUser);

// Registro
router.post('/register', registerValidator, userCtrl.register);

// Login
router.post('/login', loginValidator, userCtrl.login);

// Perfil

router.get('/search',auth,  userCtrl.searchUser);
router.get('/:id',auth, userCtrl.getuserById);


router.get('/user/production', authController.searchEnabledUsers);
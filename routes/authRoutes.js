const { Router } = require('express');
const authController = require('../controllers/authController');


const router = Router();

router.get('/',authController.login_get);
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.post('/login',authController.login_post);
router.get('/admin',authController.adm_login_get);
router.post('/admin',authController.adm_login_post);
router.get('/adminsign',authController.adm_signup_get);
router.post('/adminsign',authController.adm_signup_post);




module.exports = router;